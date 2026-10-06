# DATABASE: Skema PostgreSQL Smart Records Center

Status dokumen: draf v0.1, 26 September 2026.
Status implementasi: **[RENCANA]**. Belum ada database. Demo app saat ini memakai data contoh statis di frontend. Bagian 16 memetakan skema ini ke tipe data contoh agar UI konsisten sejak sekarang.

Dokumen terkait: `PRD.md` (lifecycle dan requirement), `ARCHITECTURE.md` (komponen), `API.md` (kontrak), `SECURITY.md` (akses dan enkripsi).

## 1. Prinsip

- **PostgreSQL 18** sebagai system of record. `uuidv7()` bawaan PG 18 dipakai untuk semua primary key (urut waktu, ramah indeks). Di PG < 18, UUIDv7 dibuat di aplikasi.
- **Multi-tenant**: setiap tabel bisnis punya `organization_id`, diisolasi dengan Row Level Security (bagian 14). Deploy single-tenant on-prem memakai kode dan skema yang sama.
- **Tidak ada DELETE untuk arsip.** Arsip hanya keluar lewat disposisi (status `disposed`); baris metadata tetap ada sebagai bukti. Konten dihapus lewat crypto-shredding (`data_keys`).
- **Snapshot retensi di record.** Saat diklasifikasi, aturan retensi disalin ke record. Perubahan JRA tidak mengubah arsip lama diam-diam; perhitungan ulang adalah aksi eksplisit yang diaudit.
- **Aturan kritis ditegakkan di database**, bukan hanya di API: transisi status, legal hold, larangan musnah untuk arsip vital/permanen, append-only audit, pemisahan tugas (SoD) persetujuan.
- Nama tabel dan kolom memakai bahasa Inggris snake_case, **kecuali kolom JRA** (`retensi_aktif_tahun`, `retensi_inaktif_tahun`, `nasib_akhir`) yang memakai istilah baku kearsipan Indonesia.
- Waktu disimpan `timestamptz` (UTC). Tanggal kearsipan (tanggal arsip, tanggal tutup, jatuh tempo) memakai `date`, ditafsirkan dalam zona waktu organisasi (`organizations.timezone`, default `Asia/Jakarta`).
- Hash disimpan sebagai `bytea` 32 byte (SHA-256). API menampilkannya sebagai hex huruf kecil.

## 2. Ekstensi dan enum

```sql
CREATE EXTENSION IF NOT EXISTS ltree;       -- hierarki BCS dan unit
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- pencarian nomor/judul fuzzy
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- exclusion constraint retention_rules
CREATE EXTENSION IF NOT EXISTS vector;      -- pgvector, dipakai Fase 2 (semantic search)

CREATE TYPE record_status  AS ENUM ('active','inactive','permanent','pending_disposition','disposed');
-- Urutan deklarasi = urutan tingkat, sehingga users.clearance >= records.security_level valid.
CREATE TYPE security_level AS ENUM ('public','internal','confidential','secret');
CREATE TYPE final_disposition AS ENUM ('permanen','musnah','dinilai_kembali');
CREATE TYPE retention_trigger AS ENUM ('closed','created','event');
CREATE TYPE review_status  AS ENUM ('proposed','accepted','rejected','corrected','superseded');
CREATE TYPE ai_job_type    AS ENUM ('ocr','classify','extract_metadata','detect_duplicates','detect_risks','embed');
CREATE TYPE job_status     AS ENUM ('queued','running','succeeded','failed','cancelled');
CREATE TYPE duplicate_method AS ENUM ('exact_sha256','near_text','perceptual_image','semantic');
CREATE TYPE finding_status AS ENUM ('open','acknowledged','remediated','false_positive');
CREATE TYPE risk_type      AS ENUM ('pii_nik','pii_npwp','pii_contact','pii_financial','pii_specific',
                                    'security_level_mismatch','missing_metadata','retention_overdue');
CREATE TYPE severity       AS ENUM ('low','medium','high','critical');
CREATE TYPE batch_kind     AS ENUM ('transfer_inactive','final');
CREATE TYPE batch_status   AS ENUM ('draft','submitted','approved','rejected','executed','cancelled');
CREATE TYPE disposition_decision AS ENUM ('transfer_inactive','destroy','make_permanent','extend_retention','exclude');
CREATE TYPE file_role      AS ENUM ('original','preservation','access');
CREATE TYPE preservation_event_type AS ENUM ('ingest','format_identification','validation','fixity_check','migration','replication');
CREATE TYPE event_outcome  AS ENUM ('success','warning','failure');
CREATE TYPE actor_type     AS ENUM ('user','system','ai','service');
```

Label UI yang disarankan untuk enum utama:

| Enum | Nilai | Label ID | Label EN |
|---|---|---|---|
| `record_status` | `active` | Aktif | Active |
| | `inactive` | Inaktif | Inactive |
| | `permanent` | Permanen | Permanent |
| | `pending_disposition` | Menunggu penyusutan | Pending disposition |
| | `disposed` | Musnah | Disposed |
| `security_level` | `public` | Biasa/Terbuka | Public |
| | `internal` | Terbatas | Internal |
| | `confidential` | Rahasia | Confidential |
| | `secret` | Sangat Rahasia | Secret |
| `final_disposition` | `permanen` | Permanen | Permanent |
| | `musnah` | Musnah | Destroy |
| | `dinilai_kembali` | Dinilai kembali | Re-evaluate |

Catatan: pemetaan `security_level` ke istilah Biasa/Terbatas/Rahasia/Sangat Rahasia mengikuti praktik klasifikasi keamanan arsip dinamis; rujukan peraturannya perlu diverifikasi tim legal.

## 3. Identitas: organisasi, unit, pengguna, peran

```sql
CREATE TABLE organizations (
  id             uuid PRIMARY KEY DEFAULT uuidv7(),
  name           text NOT NULL,
  slug           text NOT NULL UNIQUE,
  timezone       text NOT NULL DEFAULT 'Asia/Jakarta',
  default_locale text NOT NULL DEFAULT 'id' CHECK (default_locale IN ('id','en')),
  record_number_format text NOT NULL DEFAULT '{unit}-{yyyy}-{seq6}',  -- contoh hasil: KEU-2026-000123
  settings       jsonb NOT NULL DEFAULT '{}',  -- mis. {"ai_auto_apply": false, "ai_auto_apply_min_confidence": null}
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE units (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id   uuid NOT NULL REFERENCES organizations(id),
  parent_id         uuid REFERENCES units(id),
  code              text NOT NULL,            -- mis. 'KEU'
  name              text NOT NULL,
  path              ltree NOT NULL,           -- mis. 'SETJEN.KEU', untuk query sub-unit
  is_records_center boolean NOT NULL DEFAULT false,  -- unit kearsipan / record center penyimpan arsip inaktif
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

CREATE TABLE users (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  oidc_issuer     text NOT NULL,
  oidc_subject    text NOT NULL,
  email           text NOT NULL,
  display_name    text NOT NULL,
  primary_unit_id uuid REFERENCES units(id),
  clearance       security_level NOT NULL DEFAULT 'internal',  -- plafon akses, lihat SECURITY.md
  locale          text NOT NULL DEFAULT 'id' CHECK (locale IN ('id','en')),
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','deprovisioned')),
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (oidc_issuer, oidc_subject)
);
CREATE UNIQUE INDEX users_org_email_uq ON users (organization_id, lower(email));

-- Kode izin (permission) tetap, didefinisikan di kode API (daftar di SECURITY.md).
-- Peran bisa dikustomisasi per organisasi; peran sistem: admin, records_manager,
-- compliance_officer, auditor, unit_staff, approver.
CREATE TABLE roles (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  key             text NOT NULL,
  name_id         text NOT NULL,
  name_en         text NOT NULL,
  permissions     text[] NOT NULL,
  is_system       boolean NOT NULL DEFAULT false,
  UNIQUE (organization_id, key)
);

CREATE TABLE user_roles (
  organization_id     uuid NOT NULL REFERENCES organizations(id),
  user_id             uuid NOT NULL REFERENCES users(id),
  role_id             uuid NOT NULL REFERENCES roles(id),
  unit_id             uuid REFERENCES units(id),   -- NULL = seluruh organisasi
  include_descendants boolean NOT NULL DEFAULT true,
  granted_by          uuid REFERENCES users(id),
  granted_at          timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz,
  UNIQUE NULLS NOT DISTINCT (user_id, role_id, unit_id)
);

-- Sesi browser (cookie opaque). Token mentah tidak pernah disimpan.
CREATE TABLE web_sessions (
  id_hash         bytea PRIMARY KEY CHECK (octet_length(id_hash) = 32),  -- sha256(token cookie)
  organization_id uuid NOT NULL REFERENCES organizations(id),
  user_id         uuid NOT NULL REFERENCES users(id),
  refresh_token_ciphertext bytea,          -- refresh token IdP, terenkripsi KEK
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,
  ip              inet,
  user_agent      text
);
```

## 4. Governance: BCS, retensi, kebijakan

```sql
CREATE TABLE classifications (
  id                     uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id        uuid NOT NULL REFERENCES organizations(id),
  parent_id              uuid REFERENCES classifications(id),
  code                   text NOT NULL,       -- mis. 'KU.01.02' (contoh ilustratif)
  path                   ltree NOT NULL,      -- 'KU.01.02'; karakter di luar [A-Za-z0-9_-] dinormalisasi ke '_'
  title_id               text NOT NULL,
  title_en               text,
  description            text,                -- juga konteks untuk klasifikasi AI
  retensi_aktif_tahun    smallint CHECK (retensi_aktif_tahun >= 0),
  retensi_inaktif_tahun  smallint CHECK (retensi_inaktif_tahun >= 0),
  nasib_akhir            final_disposition,
  retention_trigger      retention_trigger NOT NULL DEFAULT 'closed',
  default_security_level security_level NOT NULL DEFAULT 'internal',
  is_vital_default       boolean NOT NULL DEFAULT false,
  is_assignable          boolean NOT NULL DEFAULT true,  -- false untuk node pengelompok (fungsi)
  status                 text NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','retired')),
  created_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code),
  -- JRA diisi lengkap atau tidak sama sekali
  CHECK ((retensi_aktif_tahun IS NULL) = (retensi_inaktif_tahun IS NULL)
     AND (retensi_aktif_tahun IS NULL) = (nasib_akhir IS NULL)),
  -- kode yang bisa dipakai arsip wajib punya JRA
  CHECK (NOT is_assignable OR nasib_akhir IS NOT NULL)
);

-- Pengecualian/override JRA: per unit, berbasis event, atau regulasi sektoral.
-- Default tetap di classifications. Resolusi: aturan unit spesifik > aturan semua unit > default kode.
CREATE TABLE retention_rules (
  id                    uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id       uuid NOT NULL REFERENCES organizations(id),
  classification_id     uuid NOT NULL REFERENCES classifications(id),
  unit_id               uuid REFERENCES units(id),     -- NULL = semua unit
  retensi_aktif_tahun   smallint NOT NULL CHECK (retensi_aktif_tahun >= 0),
  retensi_inaktif_tahun smallint NOT NULL CHECK (retensi_inaktif_tahun >= 0),
  nasib_akhir           final_disposition NOT NULL,
  retention_trigger     retention_trigger NOT NULL DEFAULT 'closed',
  trigger_event         text,          -- wajib bila trigger 'event', mis. 'kontrak_berakhir'
  legal_basis           text NOT NULL, -- dasar hukum/keputusan internal
  valid_from            date NOT NULL,
  valid_to              date,
  approved_by           uuid REFERENCES users(id),
  approved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CHECK ((retention_trigger = 'event') = (trigger_event IS NOT NULL)),
  CHECK (valid_to IS NULL OR valid_to > valid_from),
  -- tidak boleh ada dua aturan aktif yang tumpang tindih untuk kode + unit yang sama
  EXCLUDE USING gist (
    classification_id WITH =,
    (coalesce(unit_id, '00000000-0000-0000-0000-000000000000'::uuid)) WITH =,
    daterange(valid_from, valid_to) WITH &&
  )
);
```

## 5. Repository: record, file, kunci, teks

```sql
-- Satu DEK per record (semua versi file). Menghapus wrapped_dek = crypto-shredding.
CREATE TABLE data_keys (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  kek_ref         text NOT NULL,     -- id + versi KEK di KMS/HSM
  wrapped_dek     bytea,             -- NULL setelah dimusnahkan
  created_at      timestamptz NOT NULL DEFAULT now(),
  destroyed_at    timestamptz,
  CHECK ((wrapped_dek IS NULL) = (destroyed_at IS NOT NULL))
);

CREATE TABLE records (
  id                    uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id       uuid NOT NULL REFERENCES organizations(id),
  record_number         text NOT NULL,            -- nomor arsip, mis. 'KEU-2026-000123'
  title                 text NOT NULL,
  description           text,
  classification_id     uuid REFERENCES classifications(id),  -- NULL = belum diklasifikasi
  unit_id               uuid NOT NULL REFERENCES units(id),   -- unit pengolah (pencipta)
  custodian_unit_id     uuid NOT NULL REFERENCES units(id),   -- unit penyimpan saat ini
  status                record_status NOT NULL DEFAULT 'active',
  security_level        security_level NOT NULL DEFAULT 'internal',
  is_vital              boolean NOT NULL DEFAULT false,
  legal_hold            boolean NOT NULL DEFAULT false,       -- cache, dijaga trigger (bagian 6)
  record_date           date NOT NULL,            -- tanggal arsip dibuat/diterima
  closed_at             date,                     -- tanggal berkas ditutup
  retention_rule_id     uuid REFERENCES retention_rules(id),  -- NULL = default kode klasifikasi
  -- snapshot JRA saat diklasifikasi
  retensi_aktif_tahun   smallint,
  retensi_inaktif_tahun smallint,
  nasib_akhir           final_disposition,
  retention_start       date,  -- closed_at / record_date / tanggal event, sesuai retention_trigger
  active_until          date GENERATED ALWAYS AS
                          ((retention_start + make_interval(years => retensi_aktif_tahun))::date) STORED,
  inactive_until        date GENERATED ALWAYS AS
                          ((retention_start + make_interval(years => retensi_aktif_tahun + retensi_inaktif_tahun))::date) STORED,
  data_key_id           uuid NOT NULL REFERENCES data_keys(id),
  metadata              jsonb NOT NULL DEFAULT '{}',  -- metadata tambahan per jenis arsip
  version               int  NOT NULL DEFAULT 1,      -- optimistic locking, dipakai sebagai ETag
  created_by            uuid REFERENCES users(id),    -- NULL bila dibuat integrasi/sistem
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  disposed_at           timestamptz,
  UNIQUE (organization_id, record_number),
  CHECK (status = 'active' OR classification_id IS NOT NULL),
  CHECK ((status = 'disposed') = (disposed_at IS NOT NULL)),
  CHECK (closed_at IS NULL OR closed_at >= record_date),
  CHECK (classification_id IS NULL OR nasib_akhir IS NOT NULL)
);

CREATE TABLE record_files (
  id                  uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id     uuid NOT NULL REFERENCES organizations(id),
  record_id           uuid NOT NULL REFERENCES records(id),
  version             int  NOT NULL CHECK (version >= 1),
  role                file_role NOT NULL DEFAULT 'original',
  derived_from_id     uuid REFERENCES record_files(id),  -- sumber migrasi format
  filename            text NOT NULL,
  mime_type           text NOT NULL,
  size_bytes          bigint NOT NULL CHECK (size_bytes >= 0),
  sha256              bytea NOT NULL CHECK (octet_length(sha256) = 32),  -- hash plaintext (bukti)
  ciphertext_sha256   bytea CHECK (octet_length(ciphertext_sha256) = 32), -- hash objek tersimpan (fixity rutin)
  storage_bucket      text NOT NULL,
  storage_key         text NOT NULL,
  storage_version_id  text,
  format_puid         text,          -- PRONOM PUID hasil identifikasi format
  preservation_format text,          -- mis. 'PDF/A-2b' untuk role 'preservation'
  scan_status         text NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending','clean','infected','error')),
  page_count          int,
  text_simhash        bigint,        -- sidik near-duplicate teks
  phash               bigint,        -- perceptual hash (gambar/halaman pertama)
  created_by          uuid REFERENCES users(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  destroyed_at        timestamptz,
  UNIQUE (record_id, version, role),
  UNIQUE (storage_bucket, storage_key),
  CHECK (role = 'original' OR derived_from_id IS NOT NULL)
);

-- Teks hasil OCR/ekstraksi per potongan, untuk full-text dan semantic search.
-- Ini salinan isi arsip dalam bentuk plaintext: WAJIB dihapus fisik saat pemusnahan.
CREATE TABLE record_chunks (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  file_id         uuid NOT NULL REFERENCES record_files(id),
  chunk_no        int  NOT NULL,
  page_from       int,
  page_to         int,
  lang            text NOT NULL DEFAULT 'id' CHECK (lang IN ('id','en','other')),
  content         text NOT NULL,
  tsv             tsvector NOT NULL,   -- diisi API: to_tsvector('indonesian' | 'english' | 'simple', content)
  embedding       vector(1024),        -- Fase 2; dimensi mengikuti model (BELUM diputuskan)
  model_ref       text,
  UNIQUE (file_id, chunk_no)
);

-- Dokumen kebijakan disimpan sebagai arsip; tabel ini menyimpan registrinya.
CREATE TABLE policies (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  code            text NOT NULL,          -- mis. 'KEB-ARSIP-01'
  title           text NOT NULL,
  version         int  NOT NULL,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','retired')),
  effective_from  date,
  record_id       uuid REFERENCES records(id),
  approved_by     uuid REFERENCES users(id),
  approved_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code, version),
  CHECK (status <> 'approved' OR (approved_by IS NOT NULL AND effective_from IS NOT NULL))
);
ALTER TABLE classifications ADD COLUMN policy_id uuid REFERENCES policies(id);
ALTER TABLE retention_rules ADD COLUMN policy_id uuid REFERENCES policies(id);
```

Perhitungan retensi (kolom generated, selalu konsisten dengan snapshot):

- `retention_start` diisi API: `closed_at` bila trigger `closed`, `record_date` bila `created`, tanggal event bila `event`.
- `active_until = retention_start + retensi_aktif_tahun`
- `inactive_until = retention_start + retensi_aktif_tahun + retensi_inaktif_tahun`
- Selama berkas belum ditutup (`retention_start` NULL), kedua tanggal NULL dan arsip tetap `active`.
- Keputusan `extend_retention` menambah `retensi_inaktif_tahun` pada snapshot; `inactive_until` ikut bergeser otomatis.
- Tanggal 29 Februari + n tahun (bukan kabisat) menjadi 28 Februari (perilaku PostgreSQL, sudah diuji).

## 6. Legal hold

```sql
CREATE TABLE legal_holds (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name            text NOT NULL,
  reason          text NOT NULL,
  case_reference  text,
  created_by      uuid NOT NULL REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  released_by     uuid REFERENCES users(id),
  released_at     timestamptz,
  release_reason  text,
  CHECK ((released_at IS NULL) = (released_by IS NULL)),
  CHECK (released_at IS NULL OR release_reason IS NOT NULL)
);

CREATE TABLE legal_hold_records (
  legal_hold_id   uuid NOT NULL REFERENCES legal_holds(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  added_by        uuid NOT NULL REFERENCES users(id),
  added_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (legal_hold_id, record_id)
);

-- records.legal_hold = ada minimal satu hold aktif
CREATE FUNCTION refresh_legal_hold(p_record uuid) RETURNS void LANGUAGE sql AS $$
  UPDATE records r SET legal_hold = EXISTS (
    SELECT 1 FROM legal_hold_records x JOIN legal_holds h ON h.id = x.legal_hold_id
    WHERE x.record_id = r.id AND h.released_at IS NULL)
  WHERE r.id = p_record;
$$;

CREATE FUNCTION legal_hold_records_sync() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM refresh_legal_hold(COALESCE(NEW.record_id, OLD.record_id));
  RETURN NULL;
END $$;
CREATE TRIGGER legal_hold_records_sync AFTER INSERT OR DELETE ON legal_hold_records
  FOR EACH ROW EXECUTE FUNCTION legal_hold_records_sync();

CREATE FUNCTION legal_holds_release_sync() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM refresh_legal_hold(x.record_id) FROM legal_hold_records x WHERE x.legal_hold_id = NEW.id;
  RETURN NULL;
END $$;
CREATE TRIGGER legal_holds_release_sync AFTER UPDATE OF released_at ON legal_holds
  FOR EACH ROW EXECUTE FUNCTION legal_holds_release_sync();
```

## 7. AI & automation

```sql
-- Sekaligus antrean job: API mengklaim dengan FOR UPDATE SKIP LOCKED (lihat ARCHITECTURE.md).
CREATE TABLE ai_jobs (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  file_id         uuid REFERENCES record_files(id),
  type            ai_job_type NOT NULL,
  status          job_status NOT NULL DEFAULT 'queued',
  model_ref       text,                  -- nama@versi model/tool
  attempts        smallint NOT NULL DEFAULT 0,
  max_attempts    smallint NOT NULL DEFAULT 5,
  run_after       timestamptz NOT NULL DEFAULT now(),
  locked_by       text,
  locked_at       timestamptz,
  error           text,
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  finished_at     timestamptz
);

CREATE TABLE ai_classifications (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id   uuid NOT NULL REFERENCES organizations(id),
  record_id         uuid NOT NULL REFERENCES records(id),
  job_id            uuid REFERENCES ai_jobs(id),
  classification_id uuid NOT NULL REFERENCES classifications(id),
  rank              smallint NOT NULL CHECK (rank BETWEEN 1 AND 5),
  confidence        numeric(4,3) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  suggested_security_level security_level,
  rationale         text,                -- alasan singkat, hanya mengutip dokumen ini
  model_ref         text NOT NULL,
  status            review_status NOT NULL DEFAULT 'proposed',
  auto_applied      boolean NOT NULL DEFAULT false,
  decided_by        uuid REFERENCES users(id),
  decided_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT auto_applied OR (status = 'accepted' AND decided_by IS NULL))
);

CREATE TABLE metadata_extractions (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  file_id         uuid REFERENCES record_files(id),
  job_id          uuid REFERENCES ai_jobs(id),
  field           text NOT NULL,   -- 'nomor_naskah','tanggal_naskah','perihal','pengirim','penerima',...
  value           text,            -- nilai usulan model
  final_value     text,            -- nilai setelah review
  confidence      numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),
  source_ref      jsonb,           -- {"page": 1, "bbox": [x0,y0,x1,y1]} bukti lokasi
  model_ref       text NOT NULL,
  status          review_status NOT NULL DEFAULT 'proposed',
  reviewed_by     uuid REFERENCES users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (status NOT IN ('accepted','corrected') OR final_value IS NOT NULL)
);

CREATE TABLE duplicates (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),   -- arsip yang lebih baru
  duplicate_of_id uuid NOT NULL REFERENCES records(id),   -- kandidat asli
  method          duplicate_method NOT NULL,
  score           numeric(4,3) NOT NULL CHECK (score BETWEEN 0 AND 1),
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','confirmed','dismissed')),
  note            text,
  resolved_by     uuid REFERENCES users(id),
  resolved_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (record_id, duplicate_of_id, method),
  CHECK (record_id <> duplicate_of_id)
);

CREATE TABLE risk_findings (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  file_id         uuid REFERENCES record_files(id),
  type            risk_type NOT NULL,
  severity        severity NOT NULL,
  detector_ref    text NOT NULL,       -- mis. 'regex-nik@1'
  occurrences     int  NOT NULL DEFAULT 1 CHECK (occurrences >= 1),
  evidence        jsonb NOT NULL,      -- SELALU tersamar: {"sample": "3171********0001", "pages": [2]}
  status          finding_status NOT NULL DEFAULT 'open',
  assigned_to     uuid REFERENCES users(id),
  resolved_by     uuid REFERENCES users(id),
  resolved_at     timestamptz,
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

Deteksi duplikat: `exact_sha256` lewat indeks `record_files (organization_id, sha256)`; `near_text` dan `perceptual_image` lewat jarak Hamming 64-bit, mis. `bit_count((a.text_simhash # b.text_simhash)::bit(64)) <= 3`. Pemindaian ini O(n) per organisasi.
<!-- ponytail: scan Hamming linear per org; tambah LSH banding (4 band x 16 bit, diindeks) bila korpus > ~1 juta file atau p95 deteksi melewati target -->

## 8. Akses

```sql
-- Aturan ABAC berbasis data. Dievaluasi deny-overrides (lihat SECURITY.md).
CREATE TABLE access_policies (
  id                  uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id     uuid NOT NULL REFERENCES organizations(id),
  name                text NOT NULL,
  effect              text NOT NULL CHECK (effect IN ('allow','deny')),
  permissions         text[] NOT NULL,
  classification_path ltree,            -- subtree BCS; NULL = semua
  security_level      security_level,   -- NULL = semua tingkat
  unit_id             uuid REFERENCES units(id),   -- unit pemilik arsip; NULL = semua
  role_id             uuid REFERENCES roles(id),   -- subjek; NULL = semua peran
  valid_from          timestamptz NOT NULL DEFAULT now(),
  valid_to            timestamptz,
  created_by          uuid NOT NULL REFERENCES users(id),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Pengecualian per arsip (need-to-know). Tidak bisa menembus plafon clearance.
CREATE TABLE access_grants (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  grantee_user_id uuid REFERENCES users(id),
  grantee_unit_id uuid REFERENCES units(id),
  permissions     text[] NOT NULL,     -- mis. '{record:read,record_file:download}'
  reason          text NOT NULL,
  expires_at      timestamptz NOT NULL,  -- grant selalu punya masa berlaku
  granted_by      uuid NOT NULL REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  revoked_by      uuid REFERENCES users(id),
  revoked_at      timestamptz,
  CHECK (num_nonnulls(grantee_user_id, grantee_unit_id) = 1),
  CHECK (expires_at > created_at)
);
```

## 9. Disposisi (penyusutan)

Istilah: "disposisi" di sini = disposition menurut ISO 15489 (pemindahan inaktif, pemusnahan, penyerahan permanen), bukan disposisi surat.

```sql
CREATE TABLE disposition_batches (
  id                     uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id        uuid NOT NULL REFERENCES organizations(id),
  batch_number           text NOT NULL,         -- mis. 'PNY-2026-0007'
  kind                   batch_kind NOT NULL,   -- transfer_inactive | final
  status                 batch_status NOT NULL DEFAULT 'draft',
  title                  text NOT NULL,
  required_approvals     smallint NOT NULL DEFAULT 1 CHECK (required_approvals >= 1),
  created_by             uuid NOT NULL REFERENCES users(id),
  created_at             timestamptz NOT NULL DEFAULT now(),
  submitted_at           timestamptz,
  decided_at             timestamptz,
  executed_by            uuid REFERENCES users(id),
  executed_at            timestamptz,
  berita_acara_number    text,
  berita_acara_record_id uuid REFERENCES records(id),  -- berita acara disimpan sebagai arsip
  UNIQUE (organization_id, batch_number),
  CHECK (status <> 'executed' OR (executed_at IS NOT NULL AND berita_acara_record_id IS NOT NULL))
);

CREATE TABLE disposition_items (
  batch_id        uuid NOT NULL REFERENCES disposition_batches(id),
  record_id       uuid NOT NULL REFERENCES records(id),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  decision        disposition_decision NOT NULL,
  extend_years    smallint CHECK (extend_years > 0),
  snapshot        jsonb NOT NULL,  -- nomor, judul, kode, unit, tanggal, retensi saat diusulkan (isi berita acara)
  note            text,
  executed_at     timestamptz,
  PRIMARY KEY (batch_id, record_id),
  CHECK ((decision = 'extend_retention') = (extend_years IS NOT NULL))
);

CREATE TABLE disposition_approvals (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  batch_id        uuid NOT NULL REFERENCES disposition_batches(id),
  approver_id     uuid NOT NULL REFERENCES users(id),
  decision        text NOT NULL CHECK (decision IN ('approved','rejected')),
  note            text,
  decided_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (batch_id, approver_id)
);

-- SoD: pembuat usulan tidak boleh menyetujui usulannya sendiri.
CREATE FUNCTION disposition_approval_sod() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.approver_id = (SELECT created_by FROM disposition_batches WHERE id = NEW.batch_id) THEN
    RAISE EXCEPTION 'pembuat batch tidak boleh menyetujui batch yang sama'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER disposition_approval_sod BEFORE INSERT ON disposition_approvals
  FOR EACH ROW EXECUTE FUNCTION disposition_approval_sod();
```

### Guard transisi status record

State machine lengkap ada di `PRD.md` bagian 7. Database menolak transisi di luar tabel, dan menolak pemusnahan arsip yang di-hold, vital, atau bernasib akhir permanen, walau API salah.

```sql
CREATE FUNCTION records_guard_transition() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;
  IF NOT (
       (OLD.status = 'active'              AND NEW.status = 'inactive')
    OR (OLD.status = 'inactive'            AND NEW.status = 'pending_disposition')
    OR (OLD.status = 'pending_disposition' AND NEW.status IN ('inactive','disposed','permanent'))
  ) THEN
    RAISE EXCEPTION 'transisi % -> % tidak diizinkan', OLD.status, NEW.status
      USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.status IN ('pending_disposition','disposed') AND NEW.legal_hold THEN
    RAISE EXCEPTION 'record % dalam legal hold', OLD.id USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.status = 'disposed' AND (NEW.is_vital OR NEW.nasib_akhir = 'permanen') THEN
    RAISE EXCEPTION 'record % vital atau bernasib akhir permanen, tidak boleh dimusnahkan', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER records_guard_transition BEFORE UPDATE OF status ON records
  FOR EACH ROW EXECUTE FUNCTION records_guard_transition();
```

## 10. Preservation

```sql
CREATE TABLE preservation_events (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  file_id         uuid NOT NULL REFERENCES record_files(id),
  type            preservation_event_type NOT NULL,
  outcome         event_outcome NOT NULL,
  expected_sha256 bytea,
  actual_sha256   bytea,
  result_file_id  uuid REFERENCES record_files(id),  -- hasil migrasi format
  tool_ref        text NOT NULL,     -- mis. 'siegfried@1.x', 'verapdf@1.x', 'sha256-stream@1'
  detail          jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (type <> 'fixity_check' OR (expected_sha256 IS NOT NULL AND actual_sha256 IS NOT NULL)),
  CHECK (type <> 'migration' OR outcome <> 'success' OR result_file_id IS NOT NULL)
);
```

Kosakata event mengikuti semangat PREMIS (event type, outcome, agent/tool). `preservation_events` juga append-only (bagian 11).

## 11. Audit ledger (append-only, hash chain)

Desain:

- Satu rantai per organisasi. `audit_heads` menyimpan kepala rantai (seq terakhir + hash) dan dikunci baris (`FOR UPDATE`) saat insert, sehingga urutan per organisasi serial.
- API menyusun `canonical`: JSON kanonik RFC 8785 (JCS) berisi `id, organization_id, created_at, actor_type, actor_id, actor_label, action, target_type, target_id, payload`. Trigger mengisi `seq`, `prev_hash`, `hash`.
- `hash = SHA-256(prev_hash || int8send(seq) || utf8(canonical))`. Genesis `prev_hash` = 32 byte nol. Verifier eksternal cukup membaca kolom `canonical`, tidak perlu meniru format jsonb PostgreSQL.
- Event audit ditulis dalam transaksi yang sama dengan perubahan bisnis: tidak ada perubahan tanpa jejak, tidak ada jejak tanpa perubahan.
<!-- ponytail: kunci baris per org membuat penulisan audit serial per organisasi (plafon kira-kira ratusan s.d. ribuan tx/detik); upgrade: outbox + ledger writer tunggal dengan batch -->

```sql
CREATE TABLE audit_heads (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id),
  seq             bigint NOT NULL,
  hash            bytea  NOT NULL
);

CREATE TABLE audit_events (
  organization_id uuid        NOT NULL,
  seq             bigint      NOT NULL,
  id              uuid        NOT NULL,
  created_at      timestamptz NOT NULL,        -- diisi API, ikut di-hash lewat canonical
  actor_type      actor_type  NOT NULL,
  actor_id        uuid,                        -- users.id; NULL untuk system/ai
  actor_label     text        NOT NULL,        -- snapshot, mis. email atau 'ai:classifier@2026-09'
  action          text        NOT NULL,        -- mis. 'record.status_changed'
  target_type     text        NOT NULL,        -- mis. 'record'
  target_id       uuid,
  payload         jsonb       NOT NULL,        -- before/after, alasan, model_ref; tanpa isi dokumen
  request_id      text,
  ip              inet,
  canonical       text        NOT NULL,
  prev_hash       bytea       NOT NULL,
  hash            bytea       NOT NULL,
  PRIMARY KEY (organization_id, seq, created_at)
) PARTITION BY RANGE (created_at);

CREATE FUNCTION audit_chain() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE h audit_heads%ROWTYPE;
BEGIN
  INSERT INTO audit_heads (organization_id, seq, hash)
  VALUES (NEW.organization_id, 0, decode(repeat('00', 32), 'hex'))
  ON CONFLICT (organization_id) DO NOTHING;
  SELECT * INTO h FROM audit_heads WHERE organization_id = NEW.organization_id FOR UPDATE;
  NEW.seq       := h.seq + 1;
  NEW.prev_hash := h.hash;
  NEW.hash      := sha256(h.hash || int8send(NEW.seq) || convert_to(NEW.canonical, 'UTF8'));
  UPDATE audit_heads SET seq = NEW.seq, hash = NEW.hash
   WHERE organization_id = NEW.organization_id;
  RETURN NEW;
END $$;
CREATE TRIGGER audit_chain BEFORE INSERT ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_chain();

-- Append-only: tolak UPDATE, DELETE, TRUNCATE.
CREATE FUNCTION forbid_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% pada % ditolak: tabel append-only', TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'insufficient_privilege';
END $$;
CREATE TRIGGER audit_events_immutable BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER audit_events_no_truncate BEFORE TRUNCATE ON audit_events
  FOR EACH STATEMENT EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER preservation_events_immutable BEFORE UPDATE OR DELETE ON preservation_events
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER preservation_events_no_truncate BEFORE TRUNCATE ON preservation_events
  FOR EACH STATEMENT EXECUTE FUNCTION forbid_mutation();

-- Checkpoint kepala rantai yang ditulis ke bucket WORM (Object Lock) dan ditandatangani.
CREATE TABLE audit_checkpoints (
  organization_id uuid NOT NULL REFERENCES organizations(id),
  seq             bigint NOT NULL,
  hash            bytea  NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  anchor_uri      text NOT NULL,      -- mis. s3://audit-anchors/<org>/<seq>.json
  signature       bytea NOT NULL,     -- Ed25519 atas {org, seq, hash, created_at}, kunci di KMS/HSM
  tsa_token       bytea,              -- RFC 3161 timestamp token (Fase 3)
  PRIMARY KEY (organization_id, seq)
);
```

Batasan yang harus dipahami:

- Trigger tidak menghentikan superuser atau pemilik tabel (bisa `ALTER TABLE ... DISABLE TRIGGER`, `DETACH PARTITION`, `TRUNCATE` langsung ke partisi). Karena itu: role aplikasi bukan pemilik, dan checkpoint bertanda tangan di WORM mendeteksi penulisan ulang. Sistem ini **tamper-evident**, bukan tamper-proof.
- Keunikan `(organization_id, seq)` hanya dijamin per partisi (keterbatasan PK tabel berpartisi). Celah atau duplikat seq terdeteksi oleh job verifikasi.
- `audit_heads` hanya boleh diubah oleh fungsi trigger. Dalam deploy nyata, `audit_chain()` dibuat `SECURITY DEFINER` milik role `src_ledger`, dan `src_app` tidak punya hak UPDATE pada `audit_heads`.

### Partisi audit_events

- Partisi range bulanan pada `created_at`, batas eksplisit UTC. Dibuat 3 bulan ke depan oleh scheduler (atau pg_partman).
- Partisi lama tetap online; tidak ada DROP. Arsip partisi ke WORM (NDJSON + checkpoint) sebelum dipertimbangkan detach. Masa simpan audit_events sendiri masih open question (`PRD.md`).
- Indeks dibuat di tabel induk sehingga otomatis ada di setiap partisi.

```sql
CREATE TABLE audit_events_2026_09 PARTITION OF audit_events
  FOR VALUES FROM ('2026-09-01 00:00+00') TO ('2026-10-01 00:00+00');
CREATE TABLE audit_events_2026_10 PARTITION OF audit_events
  FOR VALUES FROM ('2026-10-01 00:00+00') TO ('2026-11-01 00:00+00');
```

Verifikasi rantai (dipakai `POST /api/v1/audit/verifications`): baca berurutan per `seq`, hitung ulang `hash`, bandingkan `prev_hash` dengan `hash` baris sebelumnya, cocokkan kepala dengan checkpoint terakhir di WORM, dan cocokkan `payload` dengan isi `canonical`.

## 12. Tabel pendukung API

```sql
CREATE TABLE idempotency_keys (
  organization_id uuid NOT NULL REFERENCES organizations(id),
  principal       text NOT NULL,        -- user id atau client id
  key             text NOT NULL,
  request_hash    bytea NOT NULL,       -- sha256(method + path + body)
  response_status int,                  -- NULL = masih diproses
  response_body   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),  -- dibersihkan setelah 24 jam
  PRIMARY KEY (organization_id, principal, key)
);

CREATE TABLE webhook_endpoints (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id   uuid NOT NULL REFERENCES organizations(id),
  url               text NOT NULL CHECK (url LIKE 'https://%'),
  events            text[] NOT NULL,
  secret_ciphertext bytea NOT NULL,     -- terenkripsi KEK; ditampilkan sekali saat dibuat
  active            boolean NOT NULL DEFAULT true,
  created_by        uuid NOT NULL REFERENCES users(id),
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Sekaligus outbox: baris dibuat dalam transaksi yang sama dengan event audit sumber.
CREATE TABLE webhook_deliveries (
  id               uuid PRIMARY KEY DEFAULT uuidv7(),
  organization_id  uuid NOT NULL REFERENCES organizations(id),
  endpoint_id      uuid NOT NULL REFERENCES webhook_endpoints(id),
  event_type       text NOT NULL,
  audit_seq        bigint,
  payload          jsonb NOT NULL,     -- tipis: id dan status, tanpa isi dokumen
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','delivered','failed','dead')),
  attempts         smallint NOT NULL DEFAULT 0,
  next_attempt_at  timestamptz NOT NULL DEFAULT now(),
  last_status_code int,
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

## 13. Indeks penting

```sql
CREATE INDEX units_path_gist           ON units USING gist (path);
CREATE INDEX classifications_path_gist ON classifications USING gist (path);

-- Jatuh tempo (dipakai scheduler dan GET /retention/due)
CREATE INDEX records_active_due   ON records (organization_id, active_until)   WHERE status = 'active';
CREATE INDEX records_inactive_due ON records (organization_id, inactive_until) WHERE status = 'inactive';
CREATE INDEX records_unclassified ON records (organization_id, created_at)     WHERE classification_id IS NULL;
CREATE INDEX records_legal_hold   ON records (organization_id)                 WHERE legal_hold;
-- Filter daftar + ABAC
CREATE INDEX records_scope        ON records (organization_id, unit_id, security_level, status);
CREATE INDEX records_class        ON records (classification_id);
CREATE INDEX records_title_trgm   ON records USING gin (title gin_trgm_ops);
CREATE INDEX records_number_trgm  ON records USING gin (record_number gin_trgm_ops);

CREATE INDEX record_files_record  ON record_files (record_id);
CREATE INDEX record_files_sha256  ON record_files (organization_id, sha256);
CREATE INDEX record_chunks_record ON record_chunks (record_id);
CREATE INDEX record_chunks_tsv    ON record_chunks USING gin (tsv);
CREATE INDEX record_chunks_embedding ON record_chunks USING hnsw (embedding vector_cosine_ops);  -- Fase 2

CREATE INDEX ai_jobs_ready        ON ai_jobs (run_after) WHERE status = 'queued';
CREATE UNIQUE INDEX ai_jobs_one_open ON ai_jobs (file_id, type) WHERE status IN ('queued','running');
CREATE INDEX ai_class_review      ON ai_classifications (organization_id, created_at) WHERE status = 'proposed';
CREATE INDEX meta_review          ON metadata_extractions (organization_id, created_at) WHERE status = 'proposed';
CREATE INDEX risk_open            ON risk_findings (organization_id, severity) WHERE status = 'open';
CREATE INDEX risk_record          ON risk_findings (record_id);
CREATE INDEX dup_open             ON duplicates (organization_id) WHERE status = 'open';

CREATE INDEX grants_record        ON access_grants (record_id)       WHERE revoked_at IS NULL;
CREATE INDEX grants_user          ON access_grants (grantee_user_id) WHERE revoked_at IS NULL;
CREATE INDEX user_roles_user      ON user_roles (user_id);
CREATE INDEX hold_records_record  ON legal_hold_records (record_id);
CREATE INDEX disp_items_record    ON disposition_items (record_id);
CREATE INDEX pres_events_file     ON preservation_events (file_id, created_at DESC);
CREATE INDEX webhook_due          ON webhook_deliveries (next_attempt_at) WHERE status IN ('pending','failed');

CREATE INDEX audit_target ON audit_events (organization_id, target_type, target_id, created_at);
CREATE INDEX audit_actor  ON audit_events (organization_id, actor_id, created_at);
CREATE INDEX audit_action ON audit_events (organization_id, action, created_at);
```

Catatan semantic search: filter organisasi dan ABAC diterapkan bersama pencarian vektor. Pakai `hnsw.iterative_scan` (pgvector 0.8+) agar hasil tetap lengkap saat filter ketat.

## 14. Row Level Security dan role database

```sql
-- Isolasi tenant untuk semua tabel yang punya organization_id.
-- current_setting tanpa missing_ok: bila app.org_id belum di-set, query gagal (fail closed).
DO $$
DECLARE t regclass;
BEGIN
  FOR t IN
    SELECT c.oid::regclass
    FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid
    WHERE a.attname = 'organization_id' AND NOT a.attisdropped
      AND c.relkind IN ('r','p') AND NOT c.relispartition
      AND c.relnamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY tenant_isolation ON %s
      USING (organization_id = current_setting('app.org_id')::uuid)
      WITH CHECK (organization_id = current_setting('app.org_id')::uuid)$p$, t);
  END LOOP;
END $$;
```

API menjalankan `SET LOCAL app.org_id = '<uuid>'` di awal setiap transaksi. Dengan connection pool, nilai kosong setelah transaksi selesai juga gagal di-cast ke uuid, jadi tetap fail closed. RLS hanya untuk isolasi tenant; keputusan akses per arsip (ABAC) ada di API dan diterjemahkan ke `WHERE` untuk daftar dan pencarian.

| Role DB | Dipakai oleh | Hak |
|---|---|---|
| `src_owner` | migrasi (CI/CD, break-glass) | pemilik skema; tidak dipakai runtime |
| `src_app` | API service | SELECT/INSERT/UPDATE tabel bisnis; INSERT/SELECT saja pada `audit_events`, `preservation_events`; DELETE hanya pada `record_chunks`, `metadata_extractions`, `idempotency_keys`, `web_sessions`, `legal_hold_records` |
| `src_ledger` | pemilik fungsi `audit_chain()` | UPDATE `audit_heads` |
| `src_readonly` | laporan/BI internal (opsional) | SELECT pada view tanpa konten |

Worker tidak punya akses database (lihat `ARCHITECTURE.md`).

## 15. Konvensi migrasi

- Migrasi SQL berurutan dan hanya maju (forward-only); tidak ada perubahan skema manual di produksi.
- Menambah nilai enum: `ALTER TYPE ... ADD VALUE` (aman). Menghapus/mengganti nilai enum: dilarang; tambah nilai baru lalu migrasi data.
- Setiap tabel baru ber-`organization_id` otomatis tercakup blok RLS di atas bila dijalankan ulang di migrasi yang sama; migrasi berikutnya wajib menambah policy sendiri.

## 16. Pemetaan ke data contoh UI (Fase 0)

Demo app memakai data statis. Agar nanti bisa diganti respons API tanpa mengubah komponen, bentuk data contoh sebaiknya mengikuti tipe ini (nama field = nama JSON di `API.md`):

```ts
export type RecordStatus = 'active' | 'inactive' | 'permanent' | 'pending_disposition' | 'disposed'
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'secret'
export type FinalDisposition = 'permanen' | 'musnah' | 'dinilai_kembali'
export type BatchKind = 'transfer_inactive' | 'final'
export type BatchStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'executed' | 'cancelled'
export type DispositionDecision = 'transfer_inactive' | 'destroy' | 'make_permanent' | 'extend_retention' | 'exclude'
export type ActorType = 'user' | 'system' | 'ai' | 'service'

export interface RecordSummary {
  id: string                    // UUIDv7
  record_number: string         // 'KEU-2026-000123'
  title: string
  classification: { code: string; title_id: string; title_en: string | null } | null
  unit: { code: string; name: string }
  status: RecordStatus
  security_level: SecurityLevel
  is_vital: boolean
  legal_hold: boolean
  record_date: string           // 'YYYY-MM-DD'
  closed_at: string | null
  retensi_aktif_tahun: number | null
  retensi_inaktif_tahun: number | null
  nasib_akhir: FinalDisposition | null
  active_until: string | null
  inactive_until: string | null
}

export interface AuditEvent {
  seq: number
  id: string
  created_at: string            // RFC 3339 UTC
  actor_type: ActorType
  actor_label: string
  action: string                // 'record.status_changed'
  target_type: string
  target_id: string | null
  payload: Record<string, unknown>
  prev_hash: string             // hex 64 karakter
  hash: string
}
```

Aturan data contoh: NIK/NPWP hanya ditampilkan tersamar (`3171********0001`), jangan pernah 16 digit penuh, karena angka acak bisa kebetulan milik orang sungguhan.
