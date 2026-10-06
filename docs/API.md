# API: Smart Records Center REST API v1

Status dokumen: draf v0.1, 26 September 2026.
Status implementasi: **seluruh isi dokumen ini [RENCANA]**. Belum ada endpoint yang berjalan. Demo app saat ini memakai data contoh statis.

Dokumen terkait: `DATABASE.md` (sumber enum dan field), `SECURITY.md` (izin dan ABAC), `ARCHITECTURE.md` (komponen).

## 1. Dasar

- Base URL: `https://[DATA ASLI]/api/v1` (domain produksi belum ditentukan). Web dan API satu origin.
- Kontrak resmi nantinya: OpenAPI 3.1 (`openapi/openapi.yaml`). Dokumen ini adalah acuan sebelum spesifikasi itu dibuat.
- Versi di path. Perubahan aditif (field atau endpoint baru) boleh di v1; perubahan yang merusak klien menjadi v2.
- JSON UTF-8, field `snake_case`. Enum persis seperti `DATABASE.md` bagian 2.
- ID: UUIDv7 string. Waktu: RFC 3339 UTC (`2026-09-26T08:15:00Z`). Tanggal kearsipan: `YYYY-MM-DD`.
- Hash: hex huruf kecil 64 karakter.
- Bahasa pesan (judul error, label): `Accept-Language: id` atau `en`. Data arsip tidak diterjemahkan; BCS mengembalikan `title_id` dan `title_en`.
- Health: `GET /healthz` (liveness), `GET /readyz` (readiness), tanpa auth dan tanpa detail internal.

## 2. Autentikasi dan sesi

### 2.1 Browser: OIDC + sesi cookie

| Endpoint | Fungsi |
|---|---|
| `GET /auth/login?return_to=/id/app` | Redirect ke IdP organisasi (Authorization Code + PKCE, `state`, `nonce`). `return_to` hanya path relatif. |
| `GET /auth/callback` | Tukar code, validasi ID token, JIT provisioning, buat sesi, redirect ke `return_to`. |
| `POST /auth/logout` | Hapus sesi server; opsional RP-initiated logout ke IdP. |
| `GET /me` | Profil, organisasi, peran, lingkup unit, clearance, izin efektif. |

- Cookie: `__Host-src_session`, `HttpOnly; Secure; SameSite=Lax; Path=/`. Nilai opaque; server hanya menyimpan hash-nya.
- Timeout (target, dapat dikonfigurasi): idle 30 menit, absolut 12 jam.
- CSRF: request yang mengubah data dengan auth cookie wajib punya header `Origin` yang sama dengan origin aplikasi; bila `Sec-Fetch-Site` ada, harus `same-origin`. Selain itu ditolak `403`.

Contoh `GET /me`:

```json
{
  "id": "01926f3a-7c2e-7b41-9d0e-5a1f2c3d4e5f",
  "display_name": "[nama pengguna]",
  "email": "[email]",
  "organization": { "id": "01926f3a-0000-7000-8000-000000000001", "name": "[DATA ASLI]" },
  "locale": "id",
  "clearance": "confidential",
  "roles": [
    { "key": "records_manager", "unit": null },
    { "key": "unit_staff", "unit": { "code": "KEU", "name": "Keuangan" } }
  ],
  "permissions": ["record:read", "record:create", "classification:manage", "disposition:propose"]
}
```

### 2.2 Integrasi: bearer JWT

- OAuth 2.0 client credentials (F2). Header `Authorization: Bearer <jwt>`.
- Validasi: `iss` dari allowlist issuer per organisasi, `aud = src-api`, `exp`/`nbf`, algoritma allowlist (`RS256`, `PS256`, `ES256`; `none` dan HMAC ditolak), kunci dari JWKS issuer dengan cache.
- Umur token target ≤ 15 menit. Scope dipetakan ke izin (`records:read` → `record:read`, dst.).
- Endpoint yang memakai bearer tidak menerima cookie, dan sebaliknya.

## 3. Konvensi

### 3.1 Pagination cursor

```
GET /records?limit=50&cursor=eyJrIjoiMDE5MjZm...
```

```json
{
  "data": [ { "...": "..." } ],
  "page": { "next_cursor": "eyJrIjoiMDE5MjZmZjEifQ", "has_more": true }
}
```

- `limit` default 50, maksimum 200. Cursor opaque, jangan diparse klien.
- Tidak ada `total` default (mahal dan dapat membocorkan keberadaan data yang tidak boleh dilihat).
- Urutan: `?sort=-created_at` (awalan `-` untuk menurun). Field sort yang diizinkan tercantum per endpoint.

### 3.2 Error: RFC 9457 (`application/problem+json`)

```json
{
  "type": "urn:src:problem:legal-hold-active",
  "title": "Arsip sedang dalam legal hold",
  "status": 409,
  "detail": "Arsip KEU-2026-000123 tidak dapat masuk usulan penyusutan selama legal hold aktif.",
  "instance": "/api/v1/disposition-batches/01927a10-5b3c-7d21-8e4f-0a1b2c3d4e5f/submit",
  "code": "legal_hold_active",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

Error validasi menambahkan `errors` per field:

```json
{
  "type": "urn:src:problem:validation",
  "title": "Data tidak valid",
  "status": 422,
  "code": "validation_failed",
  "errors": [
    { "field": "record_date", "code": "required", "message": "Tanggal arsip wajib diisi." },
    { "field": "closed_at", "code": "before_record_date", "message": "Tanggal tutup tidak boleh sebelum tanggal arsip." }
  ],
  "trace_id": "..."
}
```

| Status | Kapan |
|---|---|
| 400 | Request tidak dapat diparse |
| 401 | Tidak terautentikasi |
| 403 | Terlihat tetapi tidak berizin untuk aksi ini, atau CSRF gagal |
| 404 | Tidak ada, **atau tidak boleh dilihat** (mencegah enumerasi) |
| 409 | Konflik state (`legal_hold_active`, `invalid_transition`, `batch_required`, `idempotency_in_progress`) |
| 412 | `If-Match` tidak cocok (`version_mismatch`) |
| 413 | File melebihi batas |
| 415 | Tipe file tidak diizinkan |
| 422 | Validasi gagal, atau `Idempotency-Key` dipakai ulang dengan body berbeda |
| 428 | `If-Match` wajib tetapi tidak dikirim |
| 429 | Rate limit; ada `Retry-After` |

`title` dan `message` mengikuti `Accept-Language`; `code` stabil untuk dipakai klien.

### 3.3 Idempotency

- Header `Idempotency-Key: <uuid>` **wajib** untuk: upload file, `POST` yang membuat resource, transisi status, `submit`/`approvals`/`execute` batch, pembuatan ekspor dan verifikasi.
- Disimpan 24 jam per `(organisasi, principal, key)`. Key sama + body sama → respons tersimpan diputar ulang. Key sama + body berbeda → `422`. Request pertama masih berjalan → `409 idempotency_in_progress`.

### 3.4 Konkurensi

- Resource berversi mengembalikan `ETag: "<version>"`. `PATCH` dan transisi wajib `If-Match`. Tidak cocok → `412`.

### 3.5 Operasi asinkron

- `202 Accepted` + header `Location` ke resource job, mis. `/ai/jobs/{id}` atau `/audit/exports/{id}`.

### 3.6 Rate limit

- Per principal dan per IP. Header `RateLimit-Policy` dan `RateLimit` (draf IETF) serta `Retry-After` saat `429`. Angka batas ditentukan setelah uji beban.

### 3.7 Izin

Kolom "Izin" di tabel endpoint memakai kode dari `SECURITY.md` bagian 3. Semua akses ke arsip juga melewati ABAC (unit, tingkat keamanan, clearance, grant, status).

## 4. Records

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/records` | `record:read` | Filter: `status`, `unit_id`, `classification` (awalan kode, mis. `KU.01`), `security_level`, `is_vital`, `legal_hold`, `unclassified=true`, `due_before`, `q` (nomor/judul). Sort: `created_at`, `record_date`, `active_until`, `inactive_until`. |
| POST | `/records` | `record:create` | Buat arsip. Nomor dibuat otomatis. |
| GET | `/records/{id}` | `record:read` | Detail + ringkasan file, usulan terbuka, temuan terbuka. |
| PATCH | `/records/{id}` | `record:update` | Field yang dapat diubah bergantung status (lihat bawah). Wajib `If-Match`. |
| POST | `/records/{id}/close` | `record:update` | Isi `closed_at`, hitung retensi. |
| POST | `/records/{id}/transitions` | `record:transition` | Hanya `active → inactive` dini dengan alasan. Transisi lain lewat batch (`409 batch_required`). |
| GET | `/records/{id}/timeline` | `record:read` | Gabungan event audit, usulan AI, event preservasi, urut waktu. |
| GET | `/records/{id}/files` | `record:read` | Daftar file dan versi. |
| POST | `/records/{id}/files` | `record:update` | Upload versi baru (stream). |
| GET | `/records/{id}/files/{file_id}/download` | `record_file:download` | `302` ke URL bertanda tangan berumur ≤ 5 menit, `Content-Disposition: attachment`. Tercatat di audit. |
| GET | `/records/{id}/grants` | `access:grant` | Grant aktif. |
| POST | `/records/{id}/grants` | `access:grant` | Beri akses; `expires_at` wajib. |
| POST | `/records/{id}/grants/{grant_id}/revoke` | `access:grant` | Cabut grant. |

**Tidak ada `DELETE /records/{id}`.** Arsip keluar hanya lewat batch penyusutan.

Field yang dapat di-`PATCH`:

| Status | Field |
|---|---|
| `active` | `title`, `description`, `metadata`, `record_date`, `classification_id`, `security_level`, `is_vital`, `unit_id` |
| `inactive` | Sama, hanya dengan izin `classification:manage` (records manager); reklasifikasi menghitung ulang retensi |
| `pending_disposition` | Tidak ada (keluarkan dulu dari batch) |
| `permanent` | `description`, `metadata`, `is_vital` |
| `disposed` | Tidak ada |

Menurunkan `security_level` butuh izin `record:downgrade` dan alasan. Field `status`, `legal_hold`, tanggal jatuh tempo, dan snapshot JRA tidak pernah dapat di-`PATCH`.

`POST /records`

```json
{
  "title": "Surat Perintah Membayar Termin 2 Pengadaan Server",
  "unit_id": "01926f3a-1111-7000-8000-00000000a001",
  "record_date": "2026-09-15",
  "security_level": "internal",
  "classification_id": null,
  "metadata": { "nomor_naskah": "[nomor naskah]" }
}
```

`201 Created`, `ETag: "1"`

```json
{
  "id": "01927a0c-3e1d-7a55-9c2b-6f7e8d9a0b1c",
  "record_number": "KEU-2026-000123",
  "title": "Surat Perintah Membayar Termin 2 Pengadaan Server",
  "classification": null,
  "unit": { "id": "01926f3a-1111-7000-8000-00000000a001", "code": "KEU", "name": "Keuangan" },
  "custodian_unit": { "id": "01926f3a-1111-7000-8000-00000000a001", "code": "KEU", "name": "Keuangan" },
  "status": "active",
  "security_level": "internal",
  "is_vital": false,
  "legal_hold": false,
  "record_date": "2026-09-15",
  "closed_at": null,
  "retensi_aktif_tahun": null,
  "retensi_inaktif_tahun": null,
  "nasib_akhir": null,
  "active_until": null,
  "inactive_until": null,
  "version": 1,
  "created_at": "2026-09-26T08:15:00Z"
}
```

`POST /records/{id}/files`: body mentah (bukan multipart).

```
POST /api/v1/records/01927a0c-.../files
Content-Type: application/pdf
Content-Length: 482113
Content-Disposition: attachment; filename="spm-termin-2.pdf"
Content-Digest: sha-256=:<base64 sha256>:
Idempotency-Key: 5b0f6a0e-2f7b-4c4e-9b8a-1d2c3b4a5f60
```

`201 Created`

```json
{
  "id": "01927a0d-8f00-7c3a-b1d2-3e4f5a6b7c8d",
  "version": 1,
  "role": "original",
  "filename": "spm-termin-2.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 482113,
  "sha256": "9f2c...e41a",
  "scan_status": "pending",
  "created_at": "2026-09-26T08:16:02Z",
  "jobs": [ { "id": "01927a0d-9000-7000-8000-000000000001", "type": "ocr", "status": "queued" } ]
}
```

- `Content-Digest` (RFC 9530) opsional; bila ada dan tidak cocok dengan hash server → `422 digest_mismatch`, file dibuang.
- Tipe diizinkan: allowlist per organisasi (default: PDF, gambar umum, dokumen office, email `.eml`). Tipe ditentukan dari isi file, bukan hanya header.
- Batas ukuran per file ditentukan organisasi (`413` bila lewat).

`POST /records/{id}/transitions`

```json
{ "to": "inactive", "reason": "Unit dilebur; arsip dipindah lebih awal ke record center." }
```

`200 OK` dengan record terbaru, atau `409`:

```json
{ "type": "urn:src:problem:batch-required", "status": 409, "code": "batch_required",
  "title": "Transisi ini harus lewat batch penyusutan" }
```

## 5. Classifications (BCS) dan retensi

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/classifications` | `record:read` | `?parent_id=`, `?q=`, `?tree=true` (seluruh pohon ringkas), `?assignable=true` |
| GET | `/classifications/{id}` | `record:read` | |
| POST | `/classifications` | `classification:manage` | |
| PATCH | `/classifications/{id}` | `classification:manage` | Tidak mengubah snapshot arsip yang sudah ada |
| POST | `/classifications/{id}/retire` | `classification:manage` | Kode tidak dapat dipakai arsip baru |
| POST | `/classifications/imports?dry_run=true` | `classification:manage` | Upload CSV/XLSX BCS + JRA; `202`, hasil berisi error per baris |
| GET | `/retention-rules` | `retention:manage` | Override per unit/event |
| POST | `/retention-rules` | `retention:manage` | `legal_basis` wajib; tumpang tindih → `409 retention_rule_overlap` |
| PATCH | `/retention-rules/{id}` | `retention:manage` | |
| GET | `/retention/due` | `disposition:propose` | `?kind=transfer_inactive\|final&before=2026-12-31` |
| POST | `/retention/recalculations` | `retention:manage` | F2. `{ "classification_id": "...", "dry_run": true }` → `202`, pratinjau arsip terdampak |
| GET | `/legal-holds` | `legal_hold:manage` | |
| POST | `/legal-holds` | `legal_hold:manage` | |
| POST | `/legal-holds/{id}/records` | `legal_hold:manage` | `{ "record_ids": [...] }` |
| DELETE | `/legal-holds/{id}/records/{record_id}` | `legal_hold:manage` | Lepas satu arsip dari hold |
| POST | `/legal-holds/{id}/release` | `legal_hold:manage` | `{ "reason": "..." }` wajib |
| GET | `/policies`, POST `/policies`, POST `/policies/{id}/approve` | `policy:manage` | Registri kebijakan |

Contoh item `GET /classifications/{id}` (kode dan judul ilustratif):

```json
{
  "id": "01926f40-2222-7000-8000-0000000c0102",
  "code": "KU.01.02",
  "parent": { "id": "01926f40-2222-7000-8000-0000000c0100", "code": "KU.01" },
  "title_id": "Pembayaran",
  "title_en": "Payments",
  "retensi_aktif_tahun": 2,
  "retensi_inaktif_tahun": 8,
  "nasib_akhir": "musnah",
  "retention_trigger": "closed",
  "default_security_level": "internal",
  "is_vital_default": false,
  "is_assignable": true,
  "status": "active",
  "policy": { "id": "01926f40-3333-7000-8000-000000000001", "code": "KEB-ARSIP-01", "version": 1 }
}
```

## 6. Search

`POST /search` (izin `record:read`; hasil selalu difilter ABAC di dalam query)

```json
{
  "q": "kontrak pengadaan server 2024",
  "mode": "hybrid",
  "filters": { "status": ["active", "inactive"], "classification": "KU", "unit_id": null },
  "limit": 20,
  "cursor": null
}
```

```json
{
  "data": [
    {
      "record": { "id": "01927a0c-...", "record_number": "KEU-2024-000981", "title": "[judul]", "status": "inactive", "security_level": "internal" },
      "score": 0.83,
      "matches": [ { "file_id": "01927a0d-...", "page": 3, "snippet": "... <mark>pengadaan server</mark> ..." } ]
    }
  ],
  "page": { "next_cursor": null, "has_more": false }
}
```

- `mode`: `fulltext` (F1), `semantic` dan `hybrid` (F2; hybrid menggabungkan peringkat dengan reciprocal rank fusion).
- Snippet hanya dari arsip yang boleh diunduh pengguna; untuk arsip yang hanya boleh dilihat metadatanya, `matches` kosong.
- `snippet` berisi teks ter-escape dengan `<mark>` saja; klien tidak boleh merender HTML lain.
- Query tercatat di audit dengan pola NIK/NPWP disamarkan.

## 7. AI jobs dan review

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/ai/jobs` | `record:read` | `?record_id=&type=&status=` |
| GET | `/ai/jobs/{id}` | `record:read` | |
| POST | `/records/{id}/ai-jobs` | `ai:review` | Jalankan ulang: `{ "types": ["classify", "extract_metadata"] }` → `202` |
| POST | `/ai/jobs/{id}/cancel` | `ai:review` | |
| GET | `/ai/review-queue` | `ai:review` | `?kind=classification\|metadata`, urut confidence menaik |
| GET | `/records/{id}/classification-suggestions` | `record:read` | |
| POST | `/classification-suggestions/{id}/accept` | `ai:review` + `record:update` | `{ "record_version": 3 }`; menerapkan kode + snapshot JRA |
| POST | `/classification-suggestions/{id}/reject` | `ai:review` | `{ "note": "..." }` |
| GET | `/records/{id}/metadata-extractions` | `record:read` | |
| PATCH | `/metadata-extractions/{id}` | `ai:review` | `{ "status": "corrected", "final_value": "..." }` |

Nilai enum: `type` = `ocr | classify | extract_metadata | detect_duplicates | detect_risks | embed`; `status` job = `queued | running | succeeded | failed | cancelled`; `status` review = `proposed | accepted | rejected | corrected | superseded`.

Contoh `GET /records/{id}/classification-suggestions`:

```json
{
  "data": [
    {
      "id": "01927a0e-1a2b-7c3d-8e4f-5a6b7c8d9e0f",
      "classification": { "id": "01926f40-...", "code": "KU.01.02", "title_id": "Pembayaran" },
      "rank": 1,
      "confidence": 0.912,
      "suggested_security_level": "internal",
      "rationale": "Dokumen memuat perintah pembayaran termin kontrak (hal. 1).",
      "model_ref": "classifier@[versi]",
      "status": "proposed",
      "auto_applied": false,
      "created_at": "2026-09-26T08:17:40Z"
    }
  ]
}
```

Endpoint internal untuk worker (jaringan internal saja, autentikasi service, bukan bagian API publik): `POST /internal/jobs/claim`, `POST /internal/jobs/{id}/heartbeat`, `GET /internal/files/{id}/content`, `POST /internal/jobs/{id}/result`, `POST /internal/jobs/{id}/fail`.

## 8. Duplikat dan risiko

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/duplicates` | `duplicate:resolve` | `?status=open&method=` |
| POST | `/duplicates/{id}/resolve` | `duplicate:resolve` | `{ "status": "confirmed" \| "dismissed", "note": "..." }`. Tidak pernah menghapus arsip. |
| GET | `/risks` | `risk:manage` | `?status=open&type=pii_nik&severity=high` |
| PATCH | `/risks/{id}` | `risk:manage` | `{ "status": "remediated", "note": "Tingkat keamanan dinaikkan ke confidential." }` |

Contoh temuan:

```json
{
  "id": "01927a0f-0000-7000-8000-00000000f001",
  "record": { "id": "01927a0c-...", "record_number": "KEU-2026-000123" },
  "type": "pii_nik",
  "severity": "high",
  "detector_ref": "regex-nik@1",
  "occurrences": 4,
  "evidence": { "sample": "3171********0001", "pages": [2, 5] },
  "status": "open",
  "created_at": "2026-09-26T08:18:05Z"
}
```

## 9. Disposition batches

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/disposition-batches` | `disposition:propose` atau `disposition:approve` | `?status=&kind=` |
| POST | `/disposition-batches` | `disposition:propose` | Draf dari `record_ids` atau `from_due` |
| GET | `/disposition-batches/{id}` | sama | Termasuk item dan persetujuan |
| PATCH | `/disposition-batches/{id}/items/{record_id}` | `disposition:propose` | Hanya saat `draft`: `decision`, `extend_years`, `note` |
| DELETE | `/disposition-batches/{id}/items/{record_id}` | `disposition:propose` | Hanya saat `draft` |
| POST | `/disposition-batches/{id}/submit` | `disposition:propose` | Batch `final`: item → `pending_disposition` |
| POST | `/disposition-batches/{id}/approvals` | `disposition:approve` | Approver ≠ pembuat (`403 segregation_of_duties`) |
| POST | `/disposition-batches/{id}/execute` | `disposition:execute` | `202`; job eksekusi |
| POST | `/disposition-batches/{id}/cancel` | `disposition:propose` | Sebelum dieksekusi; item kembali ke status sebelumnya |
| GET | `/disposition-batches/{id}/berita-acara` | `record:read` | PDF berita acara (setelah `executed`) |

Status batch: `draft → submitted → approved | rejected → executed`, atau `cancelled`. Keputusan item: `transfer_inactive | destroy | make_permanent | extend_retention | exclude`.

`POST /disposition-batches`

```json
{
  "kind": "final",
  "title": "Usulan penyusutan arsip keuangan jatuh tempo 2026",
  "from_due": { "before": "2026-12-31", "classification": "KU" }
}
```

`201 Created`

```json
{
  "id": "01927a10-5b3c-7d21-8e4f-0a1b2c3d4e5f",
  "batch_number": "PNY-2026-0007",
  "kind": "final",
  "status": "draft",
  "required_approvals": 1,
  "items_summary": { "destroy": 118, "make_permanent": 6, "needs_decision": 3 },
  "created_by": { "id": "01926f3a-...", "display_name": "[nama]" },
  "created_at": "2026-09-26T09:00:00Z"
}
```

`needs_decision` = item bernasib akhir `dinilai_kembali` yang belum diputuskan; batch tidak dapat di-`submit` sebelum nol.

`POST /disposition-batches/{id}/approvals`

```json
{ "decision": "approved", "note": "Sesuai JRA dan hasil penilaian." }
```

`POST /disposition-batches/{id}/execute` → `202`, `Location: /disposition-batches/{id}`. Eksekusi memvalidasi ulang setiap item (status, legal hold, vital, nasib akhir); item yang gagal validasi dikeluarkan dan dilaporkan, bukan dieksekusi.

## 10. Preservation

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/records/{id}/preservation-events` | `record:read` | Semua event untuk file arsip |
| GET | `/preservation/summary` | `preservation:manage` | `?from=&to=`: jumlah per tipe event dan outcome |
| POST | `/preservation/fixity-runs` | `preservation:manage` | `{ "scope": { "record_ids": [...] } }` atau `{ "scope": { "classification": "KU" } }` → `202` |
| GET | `/preservation/fixity-runs/{id}` | `preservation:manage` | Progres dan kegagalan |
| POST | `/record-files/{id}/migrations` | `preservation:manage` | F2. `{ "target_format": "PDF/A-2b" }` → `202` |

Contoh event:

```json
{
  "id": "01927a20-0000-7000-8000-0000000e0001",
  "file_id": "01927a0d-8f00-7c3a-b1d2-3e4f5a6b7c8d",
  "type": "fixity_check",
  "outcome": "success",
  "expected_sha256": "4be1...90cd",
  "actual_sha256": "4be1...90cd",
  "tool_ref": "sha256-stream@1",
  "created_at": "2026-09-26T02:00:11Z"
}
```

Tipe event: `ingest | format_identification | validation | fixity_check | migration | replication`. Outcome: `success | warning | failure`.

## 11. Audit

| Method | Path | Izin | Keterangan |
|---|---|---|---|
| GET | `/audit/events` | `audit:read` | `?target_type=&target_id=&actor_id=&action=&from=&to=`; urut `seq` |
| GET | `/audit/events/{seq}` | `audit:read` | Termasuk `canonical`, `prev_hash`, `hash` |
| POST | `/audit/verifications` | `audit:read` | Verifikasi rentang; kecil `200`, besar `202` |
| GET | `/audit/verifications/{id}` | `audit:read` | |
| GET | `/audit/checkpoints` | `audit:read` | Daftar checkpoint + URI anchor |
| POST | `/audit/exports` | `audit:export` | Paket bukti; `202` |
| GET | `/audit/exports/{id}` | `audit:export` | Status + URL unduh berumur pendek |

Contoh event:

```json
{
  "seq": 48213,
  "id": "01927a11-7777-7000-8000-000000000abc",
  "created_at": "2026-09-26T09:30:02Z",
  "actor_type": "user",
  "actor_label": "[email penyetuju]",
  "action": "disposition_batch.approved",
  "target_type": "disposition_batch",
  "target_id": "01927a10-5b3c-7d21-8e4f-0a1b2c3d4e5f",
  "payload": { "decision": "approved", "note": "Sesuai JRA dan hasil penilaian." },
  "prev_hash": "a3f1...77c2",
  "hash": "0be9...d410"
}
```

`POST /audit/verifications`

```json
{ "from_seq": 1, "to_seq": 48213 }
```

```json
{
  "valid": true,
  "checked": 48213,
  "first_seq": 1,
  "last_seq": 48213,
  "head_hash": "0be9...d410",
  "broken_at_seq": null,
  "checkpoints_matched": 312,
  "verified_at": "2026-09-26T09:31:00Z"
}
```

`POST /audit/exports`

```json
{ "scope": { "disposition_batch_id": "01927a10-5b3c-7d21-8e4f-0a1b2c3d4e5f" } }
```

Isi paket (ZIP): `events.ndjson` (termasuk `canonical`, `prev_hash`, `hash`), `verification.json`, `checkpoints.json` + tanda tangan + kunci publik, `manifest.json` (SHA-256 setiap file dalam paket), berita acara PDF, `README` langkah verifikasi mandiri. Ekspor mematuhi ABAC dan tercatat sebagai event `audit.exported`.

Nama `action` utama (dipakai juga untuk webhook): `record.created`, `record.updated`, `record.classified`, `record.closed`, `record.status_changed`, `record.destroyed`, `record.viewed`, `record_file.uploaded`, `record_file.downloaded`, `ai.classification_proposed`, `ai.classification_applied`, `metadata.reviewed`, `duplicate.detected`, `risk.detected`, `legal_hold.applied`, `legal_hold.released`, `access.granted`, `access.revoked`, `disposition_batch.created`, `disposition_batch.submitted`, `disposition_batch.approved`, `disposition_batch.rejected`, `disposition_batch.executed`, `preservation.fixity_checked`, `preservation.migrated`, `audit.checkpoint_created`, `audit.verified`, `audit.exported`.

## 12. Webhooks (F2)

| Method | Path | Izin |
|---|---|---|
| GET, POST | `/webhooks` | `admin:settings` |
| PATCH, DELETE | `/webhooks/{id}` | `admin:settings` |
| POST | `/webhooks/{id}/test` | `admin:settings` |
| GET | `/webhooks/{id}/deliveries` | `admin:settings` |

- URL wajib `https://`; alamat privat/loopback/link-local ditolak (cegah SSRF).
- Secret ditampilkan sekali saat dibuat.
- Tanda tangan mengikuti spesifikasi Standard Webhooks: header `webhook-id`, `webhook-timestamp`, `webhook-signature: v1,<base64 HMAC-SHA256>`. Penerima menolak timestamp lebih dari 5 menit.
- Payload tipis (tanpa isi dokumen, tanpa data pribadi); penerima mengambil detail lewat API dengan kredensialnya sendiri.
- Retry dengan backoff eksponensial sampai 24 jam (target), lalu `dead`.

```json
{
  "type": "disposition_batch.executed",
  "timestamp": "2026-09-27T01:00:00Z",
  "data": {
    "organization_id": "01926f3a-0000-7000-8000-000000000001",
    "batch_id": "01927a10-5b3c-7d21-8e4f-0a1b2c3d4e5f",
    "batch_number": "PNY-2026-0007",
    "audit_seq": 48390
  }
}
```

## 13. Admin (ringkas)

| Method | Path | Izin |
|---|---|---|
| GET, POST, PATCH | `/units`, `/units/{id}` | `admin:users` |
| GET, PATCH | `/users`, `/users/{id}` (status, clearance, unit utama) | `admin:users` |
| GET, POST, PATCH | `/roles`, `/roles/{id}` | `admin:users` |
| POST, DELETE | `/users/{id}/roles` | `admin:users` (lihat SoD di `SECURITY.md`) |
| GET, PATCH | `/organization/settings` | `admin:settings` |
