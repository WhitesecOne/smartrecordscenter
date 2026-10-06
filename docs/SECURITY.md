# SECURITY: Smart Records Center

Status dokumen: draf v0.1, 26 September 2026.
Legenda: **[ADA]** berlaku untuk situs publik/demo yang sedang dibangun, **[RENCANA]** untuk platform (API, database, storage, AI) yang belum dibangun.

Standar dan regulasi di dokumen ini adalah **rujukan desain, bukan klaim kepatuhan atau sertifikasi**. Pemetaan kewajiban hukum yang pasti perlu dikaji tim legal.

Dokumen terkait: `ARCHITECTURE.md`, `DATABASE.md`, `API.md`.

## 1. Aset dan batas kepercayaan

Aset utama, urut dampak:

1. Isi arsip dan turunannya (teks OCR, embedding, nilai metadata hasil ekstraksi).
2. Keputusan tata kelola: klasifikasi, retensi, legal hold, persetujuan penyusutan.
3. Audit ledger dan checkpoint (bukti).
4. Kunci: KEK, DEK, kunci tanda tangan checkpoint, secret webhook, sesi.
5. Data pribadi pengguna dan pengunjung situs (form kontak, analytics).

Batas kepercayaan: Internet → reverse proxy → Web → API → (PostgreSQL, object storage, KMS); API ↔ worker (memproses file tidak tepercaya); worker → model AI; API → IdP organisasi. Diagram di `ARCHITECTURE.md` bagian 3.

## 2. Model ancaman (STRIDE ringkas)

| Kategori | Ancaman | Kontrol |
|---|---|---|
| **Spoofing** | Pencurian cookie sesi; JWT palsu atau `alg: none`; konfigurasi IdP salah (issuer lain diterima); penerima webhook palsu | Cookie `__Host-` HttpOnly Secure SameSite; sesi server-side yang dapat dicabut; allowlist issuer + audience + algoritma; JWKS dari issuer terdaftar; webhook bertanda tangan HMAC dengan timestamp |
| **Tampering** | Mengubah metadata atau status tanpa jejak; mengganti file di storage; mengubah atau menghapus log audit; mass assignment (`status`, `legal_hold` lewat PATCH) | Semua perubahan lewat API dengan audit dalam transaksi yang sama; SHA-256 plaintext + ciphertext dan fixity berkala; AEAD mendeteksi ciphertext yang diubah; audit append-only + hash chain + checkpoint WORM bertanda tangan; allowlist field PATCH; guard transisi di database |
| **Repudiation** | Penyetuju menyangkal menyetujui pemusnahan; admin menyangkal mengubah peran | Event audit dengan aktor, sesi, IP, request ID; tabel persetujuan terpisah; perubahan peran diaudit; opsi tanda tangan elektronik berita acara (open question) |
| **Information disclosure** | IDOR pada `/records/{id}`; kebocoran lewat hasil pencarian, snippet, jumlah hasil, atau alasan AI; URL unduhan dibagikan; data pribadi di log; backup; file HTML/SVG berbahaya disajikan dari origin aplikasi | ABAC di setiap endpoint + pre-filter di query; `404` untuk yang tidak boleh dilihat; URL bertanda tangan ≤ 5 menit dari origin storage, `attachment` + `nosniff`; log tanpa isi dan tanpa data pribadi; backup terenkripsi; alasan AI hanya mengutip dokumen yang sedang diproses |
| **Denial of service** | Upload sangat besar; bom dekompresi, PDF/gambar raksasa untuk OCR; query pencarian mahal; banjir form kontak | Batas ukuran dan tipe; batas halaman, piksel, waktu, dan memori per job; antrean dengan konkurensi terbatas; timeout query; rate limit per principal dan IP; honeypot + rate limit form |
| **Elevation of privilege** | Admin memberi dirinya peran penyetuju; SQL injection; escape dari konverter dokumen; prompt injection yang memicu aksi | SoD dan persetujuan kedua untuk peran sensitif; query terparameter; RLS fail-closed; worker di sandbox tanpa DB/KMS/jaringan (kecuali endpoint model); AI tanpa akses aksi |

## 3. Kontrol akses: RBAC + ABAC

### 3.1 Izin (permission)

| Kode | Arti |
|---|---|
| `record:read` | Lihat metadata arsip |
| `record_file:download` | Lihat/unduh isi file |
| `record:create` | Buat arsip, upload |
| `record:update` | Ubah metadata sesuai aturan status |
| `record:downgrade` | Menurunkan tingkat keamanan |
| `record:transition` | Transisi manual (pemindahan dini ke inaktif) |
| `classification:manage` | Kelola BCS dan JRA; reklasifikasi arsip inaktif |
| `retention:manage` | Override dan perhitungan ulang retensi |
| `policy:manage` | Registri kebijakan |
| `legal_hold:manage` | Pasang/lepas/rilis legal hold |
| `access:grant` | Beri/cabut grant per arsip |
| `ai:review` | Terima/tolak/koreksi usulan AI |
| `duplicate:resolve` | Tindak lanjut duplikat |
| `risk:manage` | Tindak lanjut temuan risiko |
| `disposition:propose` | Buat, ubah, ajukan, batalkan batch |
| `disposition:approve` | Setujui/tolak batch |
| `disposition:execute` | Eksekusi batch yang disetujui |
| `preservation:manage` | Fixity run, migrasi format |
| `audit:read` | Lihat event audit, verifikasi |
| `audit:export` | Ekspor paket bukti |
| `admin:users` | Kelola unit, pengguna, peran |
| `admin:settings` | Pengaturan organisasi, webhook, ambang AI |

### 3.2 Peran sistem (default, dapat disesuaikan organisasi)

| Izin | admin | records_manager | compliance_officer | auditor | unit_staff | approver |
|---|---|---|---|---|---|---|
| `record:read` | | ✓ | ✓ | ✓ | ✓ | ✓ |
| `record_file:download` | | ✓ | ✓ | grant | ✓ | ✓ |
| `record:create`, `record:update` | | ✓ | | | ✓ | |
| `record:downgrade`, `record:transition` | | ✓ | | | | |
| `classification:manage`, `retention:manage` | | ✓ | | | | |
| `policy:manage` | | ✓ | ✓ | | | |
| `legal_hold:manage` | | | ✓ | | | |
| `access:grant` | | ✓ | | | | |
| `ai:review` | | ✓ | | | ✓ | |
| `duplicate:resolve` | | ✓ | | | | |
| `risk:manage` | | | ✓ | | | |
| `disposition:propose`, `disposition:execute` | | ✓ | | | | |
| `disposition:approve` | | | | | | ✓ |
| `preservation:manage` | | ✓ | | | | |
| `audit:read` | | ✓ | ✓ | ✓ | | |
| `audit:export` | | | ✓ | ✓ | | |
| `admin:users`, `admin:settings` | ✓ | | | | | |

Catatan:

- Admin TI **tidak** otomatis bisa membaca arsip. Pemisahan ini disengaja.
- Auditor membaca metadata dan jejak audit lintas unit; isi file butuh grant.
- Setiap penugasan peran punya lingkup: seluruh organisasi atau satu unit (opsional beserta sub-unit).

### 3.3 Aturan ABAC

```
boleh(user, aksi, arsip) =
     tidak ada kebijakan deny yang cocok (access_policies, effect = deny)
  DAN user.clearance >= arsip.security_level          -- plafon, tidak bisa ditembus apa pun
  DAN aturan_status(aksi, arsip.status)                -- mis. disposed: hanya metadata
  DAN (
        peran user memberi izin aksi DAN arsip.unit_id dalam lingkup peran
     ATAU kebijakan allow yang cocok (klasifikasi, tingkat, unit, peran)
     ATAU grant aktif untuk user/unitnya atas arsip ini dan aksi ini
  )
```

- Urutan: deny > plafon clearance > aturan status > allow.
- `security_level` dibandingkan menurut urutan enum `public < internal < confidential < secret`.
- Grant selalu punya `expires_at` dan alasan; direkomendasikan maksimal 90 hari untuk `confidential`/`secret`.
- Satu implementasi kebijakan di API. Versi SQL-nya dipakai untuk daftar, pencarian, dan ekspor, sehingga filter terjadi di dalam query, bukan setelahnya.
- RLS PostgreSQL hanya mengisolasi tenant (`organization_id`) dan gagal tertutup bila konteks tidak di-set.

### 3.4 Pemisahan tugas (SoD)

- Pembuat batch penyusutan tidak boleh menyetujuinya (ditegakkan trigger database).
- Menetapkan peran `approver`, `records_manager`, atau `compliance_officer` butuh persetujuan admin kedua (F2).
- Pengguna tidak dapat mengubah peran atau clearance dirinya sendiri.
- Aksi break-glass (akses darurat) memerlukan alasan, berumur pendek, dan memicu notifikasi ke compliance.

## 4. Enkripsi dan manajemen kunci

### 4.1 In transit

- TLS 1.3 diutamakan, minimum TLS 1.2 dengan cipher suite modern, di reverse proxy.
- Trafik internal (API ↔ worker, API ↔ PostgreSQL, API ↔ storage) terenkripsi TLS; PostgreSQL `sslmode=verify-full`. mTLS antar-service pada F2.
- HSTS aktif (bagian 9).

### 4.2 At rest

- **Konten file**: envelope encryption di aplikasi. Setiap arsip punya DEK 256-bit acak; file dienkripsi dengan AEAD streaming dari library teruji (mis. libsodium `crypto_secretstream`). Jangan merakit mode enkripsi sendiri.
- DEK disimpan terbungkus (wrapped) oleh KEK organisasi di KMS/HSM (`data_keys.wrapped_dek`). DEK plaintext hanya ada di memori API, tidak pernah ditulis ke log atau disk.
- Enkripsi sisi server object storage tetap aktif sebagai lapisan kedua.
- **PostgreSQL**: enkripsi volume/disk dan backup terenkripsi. Kolom rahasia (refresh token, secret webhook) dienkripsi dengan KEK di aplikasi.
- Pilihan algoritma dan modul kriptografi mengikuti kebijakan organisasi/regulator sektor (open question di `PRD.md`).

### 4.3 Manajemen kunci

- KEK per organisasi di KMS cloud, HSM, atau Vault Transit, bergantung keputusan hosting. Hanya identitas service API yang boleh memanggil wrap/unwrap.
- Rotasi KEK: target tahunan atau saat insiden. DEK baru dibungkus KEK versi baru; DEK lama di-rewrap bertahap tanpa mengenkripsi ulang konten.
- Kunci tanda tangan checkpoint audit (Ed25519) terpisah dari KEK; kunci publik disertakan di paket bukti.
- Akses operator ke KMS memakai dual control dan tercatat.

## 5. Audit log tamper-evident

- Setiap perubahan data dan setiap akses konten (lihat, unduh, ekspor, pencarian) menghasilkan event dalam transaksi yang sama.
- `audit_events` append-only: trigger menolak UPDATE/DELETE/TRUNCATE; role aplikasi tidak punya hak tersebut dan bukan pemilik tabel.
- Hash chain per organisasi: `hash = SHA-256(prev_hash || seq || canonical)`, dengan `canonical` berupa JSON RFC 8785.
- Checkpoint kepala rantai ditandatangani dan ditulis ke bucket Object Lock mode compliance (target tiap jam). F3: timestamp RFC 3161 dari pihak ketiga.
- Yang dapat dideteksi: perubahan, penghapusan, atau penyisipan event (rantai putus); pemotongan ekor (kepala tidak cocok dengan checkpoint); penulisan ulang seluruh rantai oleh superuser (tidak cocok dengan checkpoint bertanda tangan di WORM).
- Batasan: ini **tamper-evident, bukan tamper-proof**. Perubahan di antara dua checkpoint oleh pihak dengan akses superuser terdeteksi pada checkpoint berikutnya, tidak dicegah.
- Isi dokumen tidak pernah masuk payload audit. Query pencarian dicatat dengan pola NIK/NPWP disamarkan.
- Akses baca ke audit dibatasi `audit:read` dan tercatat juga.

## 6. Legal hold

- Dipasang oleh `compliance_officer` dengan alasan dan referensi perkara; dapat mencakup banyak arsip.
- Efek: memblokir masuk batch final, eksekusi pemusnahan, dan crypto-shredding. Ditegakkan di API dan trigger database.
- Hold yang dipasang pada arsip `pending_disposition` otomatis mengeluarkan arsip itu dari batch.
- Opsional: menerapkan fitur legal hold objek di object storage untuk file terkait.
- Hold tidak pernah kedaluwarsa otomatis. Rilis butuh alasan dan tercatat di audit.

## 7. Retensi dan pemusnahan aman

Urutan eksekusi keputusan `destroy` (setelah batch disetujui):

1. Validasi ulang: status `pending_disposition`, tanpa legal hold, tidak vital, `nasib_akhir` bukan `permanen`, persetujuan cukup.
2. Buat berita acara dari snapshot item; simpan sebagai arsip; catat hash.
3. Hapus fisik turunan plaintext di PostgreSQL: `record_chunks` (teks dan embedding), nilai `metadata_extractions`, sampel bukti `risk_findings`, sidik duplikat.
4. Crypto-shredding: `data_keys.wrapped_dek = NULL`, `destroyed_at` diisi.
5. Hapus semua versi objek di storage; verifikasi objek tidak lagi ada.
6. Status `disposed`; event `record.destroyed` berisi daftar SHA-256 file (hash bukan isi, dipertahankan sebagai bukti).

Batasan yang wajib dinyatakan di berita acara dan kebijakan backup:

- Backup database dalam jendela retensi backup masih memuat DEK terbungkus dan turunan plaintext. Selama KEK masih ada, pemulihan backup lama secara teori dapat mengembalikan konten. Pemusnahan dinyatakan **final setelah jendela retensi backup berakhir** (nilai jendela: [DATA ASLI], mis. 35 hari).
- Opsi penguatan (F3): simpan `data_keys` di penyimpanan kunci terpisah dengan jendela backup lebih pendek, atau KEK per kohort pemusnahan yang dihancurkan setelah eksekusi.
- Arsip permanen di bucket Object Lock mode compliance tidak dapat dihapus siapa pun sampai masa retensi objek berakhir. Hanya arsip bernasib akhir permanen yang ditaruh di sana.

## 8. Data pribadi dan kepatuhan

### 8.1 UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)

- **Peran**: organisasi pelanggan adalah pengendali data pribadi atas isi arsip. Penyelenggara SRC berperan sebagai prosesor bila layanan di-hosting pihak penyelenggara; pada deploy on-prem perannya bergantung kontrak. Perlu kajian legal setelah model hosting diputuskan.
- **Dasar pemrosesan**: retensi arsip umumnya berdasar kewajiban hukum (kearsipan dan regulasi sektor). Permintaan penghapusan dari subjek data dinilai terhadap JRA dan kewajiban hukum; keputusannya dicatat di audit.
- **Inventaris**: deteksi risiko (NIK, NPWP, kontak, keuangan, data pribadi spesifik seperti kesehatan dan biometrik) menghasilkan inventaris arsip yang memuat data pribadi.
- **Minimisasi**: bukti temuan selalu disamarkan; log tanpa data pribadi; data contoh demo tanpa data pribadi asli.
- **Penilaian dampak**: UU PDP mengatur penilaian dampak untuk pemrosesan berisiko tinggi. Pemrosesan otomatis berskala besar oleh AI kemungkinan termasuk; lakukan sebelum go-live.
- **Kegagalan pelindungan**: prosedur notifikasi tertulis paling lambat 3 × 24 jam (Pasal 46 UU PDP) masuk runbook insiden.
- **Transfer lintas negara**: bila model AI atau hosting berada di luar Indonesia, ketentuan transfer data pribadi ke luar wilayah hukum RI berlaku. Ini masukan langsung untuk keputusan hosting dan model AI.

### 8.2 Rujukan kearsipan dan standar (rujukan, bukan klaim)

| Rujukan | Dipakai untuk |
|---|---|
| UU No. 43 Tahun 2009 tentang Kearsipan dan PP No. 28 Tahun 2012 (pelaksanaannya) | Konsep arsip dinamis/statis, arsip vital, JRA, penyusutan, berita acara |
| Peraturan ANRI terkait klasifikasi arsip, JRA, dan klasifikasi keamanan dan akses arsip | Struktur BCS, tingkat keamanan; nomor peraturan diverifikasi tim legal |
| PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik | Kewajiban penyelenggara sistem elektronik, termasuk lokasi pemrosesan untuk lingkup publik; dikaji tim legal |
| Regulasi sektor (mis. OJK untuk perbankan) | Retensi dan keamanan TI sektor; dipetakan per pelanggan |
| ISO 15489-1 (records management) | Konsep records, disposition, metadata |
| ISO 16175 (records dalam sistem digital) | Requirement fungsional sistem records |
| ISO 14721 (OAIS) dan PREMIS | Model preservasi dan kosakata event preservasi |
| ISO/IEC 27001 | Kerangka kontrol keamanan informasi (rujukan, bukan sertifikasi) |

## 9. Keamanan AI

1. **Prompt injection dari isi dokumen**. Isi dokumen adalah data tidak tepercaya.
   - Model klasifikasi dan ekstraksi tidak punya tool dan tidak dapat memicu aksi apa pun.
   - Output dibatasi JSON schema; server memvalidasi kode BCS (harus ada, aktif, dapat dipakai), rentang confidence, dan tipe field.
   - AI hanya boleh mengusulkan **kenaikan** tingkat keamanan; penurunan wajib manusia.
   - Hasil terburuk injeksi adalah usulan yang salah, yang tetap melewati review dan tidak dapat berujung pemusnahan tanpa persetujuan manusia.
   - Instruksi mencurigakan di dokumen dapat ditandai sebagai temuan untuk review (F2).
2. **Tidak ada pelatihan model tanpa izin**. Data pelanggan tidak dipakai melatih atau fine-tune model tanpa persetujuan tertulis. Penyedia model pihak ketiga wajib menjamin tanpa retensi data dan tanpa pelatihan; opsi self-hosted tersedia untuk organisasi yang mensyaratkan.
3. **Human-in-the-loop**.
   - Keputusan disposisi selalu manusia.
   - Auto-apply klasifikasi nonaktif default; aktivasi per organisasi hanya setelah presisi pada set validasi organisasi memenuhi target, dengan sampling review berkala.
   - Setiap keputusan AI tercatat dengan `actor_type = ai` dan `model_ref`.
4. **Isolasi data**. Konteks model hanya berisi dokumen yang sedang diproses dan daftar kode BCS. Sinyal kNN dari arsip lain hanya memakai label, bukan isi, sehingga alasan AI tidak dapat membocorkan isi arsip yang tidak boleh dilihat pengguna.
5. **Turunan adalah konten**. Teks OCR, embedding, dan nilai metadata diperlakukan setara isi arsip: ikut ABAC, ikut dimusnahkan.
6. **Output handling**. Alasan dan nilai dari model dirender sebagai teks ter-escape, tidak pernah sebagai HTML atau markdown bertaut.
7. **Rantai pasok model**. Versi model dipin; upgrade melalui evaluasi pada set validasi; rollback tersedia.
8. **Batas sumber daya**. Batas halaman, piksel, ukuran, dan waktu per job untuk mencegah bom OCR.

## 10. Keamanan web

### 10.1 Header

| Header | Nilai | Catatan |
|---|---|---|
| `Content-Security-Policy` | lihat di bawah | Mulai dengan `Content-Security-Policy-Report-Only`, uji dengan build nyata |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | `preload` setelah domain produksi diputuskan |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | publik: `strict-origin-when-cross-origin`; aplikasi: `same-origin` | Hindari ID arsip bocor lewat referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Buka `camera` bila fitur capture kamera ditambahkan |
| `X-Frame-Options` | `DENY` | Pelengkap `frame-ancestors 'none'` |
| `Cross-Origin-Opener-Policy` | `same-origin` | |
| `Cross-Origin-Resource-Policy` | `same-origin` | |
| `Cache-Control` | `no-store` untuk respons API dan halaman aplikasi berisi data arsip | |
| `X-Robots-Tag` | `noindex` untuk `/api/*` dan aplikasi yang memerlukan login | |

CSP aplikasi (nonce dibuat per request di `src/proxy.ts`):

```
default-src 'self';
script-src 'self' 'nonce-{nonce}' 'strict-dynamic';
style-src 'self' 'nonce-{nonce}';
style-src-attr 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
form-action 'self';
base-uri 'none';
object-src 'none';
upgrade-insecure-requests
```

- CSP bernonce di Next.js mengharuskan rendering dinamis. Untuk halaman aplikasi ini tidak masalah. Untuk halaman publik statis, pilihannya: terima rendering dinamis, atau evaluasi Subresource Integrity (fitur eksperimental Next.js) agar tetap statis. Putuskan setelah uji.
- `style-src-attr 'unsafe-inline'` diperlukan untuk atribut `style` yang dirender React; animasi Motion lewat CSSOM tidak terpengaruh CSP. Jika analytics dipasang, tambahkan domainnya secara eksplisit di `script-src`/`connect-src`.

### 10.2 Lain-lain

- File pengguna tidak pernah disajikan dari origin aplikasi: unduhan lewat URL bertanda tangan dari origin storage, `Content-Disposition: attachment`, `nosniff`. Pratinjau memakai salinan akses (PDF/gambar hasil render server) di viewer terisolasi.
- Upload: allowlist tipe berdasarkan isi file, scan malware di karantina, penolakan file terenkripsi/berpassword sesuai kebijakan organisasi.
- Validasi input di server untuk semua endpoint; query terparameter; tidak ada SQL dinamis dari input pengguna.
- `return_to` login dan redirect lain hanya menerima path relatif (cegah open redirect).
- Webhook menolak URL privat/loopback/link-local, dan resolusi DNS divalidasi ulang saat kirim (cegah SSRF lewat DNS rebinding).
- Dependensi: lockfile di repo, audit otomatis di CI, pembaruan terjadwal.

## 11. Situs publik [ADA]

**Form kontak** (Server Action):

- Validasi skema di server (mis. Zod); skema yang sama boleh dipakai di klien untuk UX. Panjang maksimum per field, format email, tanpa HTML.
- Pesan error per field dengan `aria-describedby` dan `aria-invalid`; nilai yang sudah diisi tidak hilang saat error.
- Rate limit per IP (dan per email): target 5 kiriman per 10 menit. Penyimpanan counter harus bersama antar-instance bila deploy lebih dari satu instance; counter di memori hanya valid untuk satu instance.
- Honeypot: field tersembunyi dari pengguna dan pembaca layar (`aria-hidden`, `tabindex="-1"`, `autocomplete="off"`), ditambah waktu minimum pengisian. Tanpa CAPTCHA default karena menghambat aksesibilitas; bila spam tinggi, pilih solusi yang aksesibel.
- Tidak mengirim email balasan otomatis berisi teks bebas pengguna (mencegah relay spam).
- Log hanya status dan metadata teknis, tanpa isi pesan.
- Tujuan pengiriman (email/CRM) dan masa simpan data prospek: [DATA ASLI], dicantumkan di kebijakan privasi.
- Sukses → `/thank-you` (`noindex`); konversi dicatat satu kali dan hanya bila pengguna menyetujui analytics.

**Cookie consent**:

- Sebelum persetujuan, hanya cookie yang benar-benar diperlukan. Bahasa ditentukan dari URL (`/id`, `/en`), jadi tidak butuh cookie.
- Tombol Terima dan Tolak setara (ukuran, kontras, posisi). Tautan untuk mengubah pilihan tersedia di footer.
- Analytics tidak dimuat sebelum persetujuan (Consent Mode default `denied` bila memakai Google). Penyedia analytics belum diputuskan.
- Pilihan disimpan beserta versi kebijakan dan waktu.

**Demo app**:

- Hanya data contoh statis berlabel "Data contoh"; tanpa login dan tanpa backend.
- NIK/NPWP hanya ditampilkan tersamar (`3171********0001`). Jangan membuat 16 digit acak yang bisa kebetulan valid.
- Nama orang di data contoh jelas fiktif; nama organisasi tidak meniru instansi nyata.
- Pertimbangkan `noindex` agar data contoh tidak muncul di mesin pencari seolah data nyata (open question di `PRD.md`).

## 12. Checklist hardening

### Aplikasi

- [ ] ABAC diuji dengan tes otomatis per endpoint, termasuk IDOR (akses ID milik unit/tenant lain → `404`)
- [ ] Allowlist field untuk setiap `PATCH`; `status` dan `legal_hold` tidak dapat diubah langsung
- [ ] CSP aktif (report-only lalu enforce), HSTS, dan header lain di bagian 10
- [ ] Sesi: cookie `__Host-`, idle dan absolute timeout, logout mencabut sesi server, rotasi ID sesi saat login
- [ ] CSRF: pemeriksaan `Origin`/`Sec-Fetch-Site` untuk request cookie yang mengubah data
- [ ] Upload: batas ukuran, allowlist tipe berdasarkan isi, scan malware, karantina
- [ ] Rate limit untuk login, pencarian, upload, form kontak
- [ ] Error tidak membocorkan stack trace atau detail internal; `trace_id` untuk korelasi

### Data

- [ ] RLS aktif di semua tabel ber-`organization_id`; uji tanpa `app.org_id` gagal
- [ ] Role aplikasi bukan pemilik tabel; tanpa UPDATE/DELETE/TRUNCATE pada `audit_events` dan `preservation_events`
- [ ] Trigger guard transisi, legal hold, SoD, dan append-only terpasang dan diuji
- [ ] Envelope encryption per arsip; tidak ada DEK plaintext di log atau disk
- [ ] Backup terenkripsi, uji restore terjadwal, jendela retensi backup terdokumentasi
- [ ] Checkpoint audit bertanda tangan ke bucket WORM; verifikasi harian dengan alert

### Infrastruktur

- [ ] TLS 1.2+ di edge, TLS internal, `sslmode=verify-full`
- [ ] Worker: non-root, filesystem read-only, tanpa kredensial DB/KMS, egress hanya ke endpoint model
- [ ] Konverter dokumen tanpa jaringan dan dengan batas sumber daya
- [ ] Bucket tidak publik; Object Lock compliance untuk `preservation` dan `audit-anchors`
- [ ] Rahasia di secret manager; tidak ada rahasia di image, repo, atau variabel build frontend
- [ ] Image container dipindai dan dipin digest-nya

### Operasional

- [ ] Log terpusat tanpa isi dokumen dan tanpa data pribadi
- [ ] Alert: fixity gagal, rantai audit putus, lonjakan `403`/`404`, lonjakan unduhan per pengguna
- [ ] Runbook insiden termasuk notifikasi 3 × 24 jam UU PDP
- [ ] Pentest eksternal sebelum go-live F1, lalu berkala
- [ ] Review akses peran sensitif per kuartal
- [ ] `/.well-known/security.txt` terpasang

## 13. Pelaporan kerentanan

- Kontak: `[DATA ASLI]` (email keamanan). Kunci PGP opsional: [DATA ASLI].
- `/.well-known/security.txt` (RFC 9116):

```
Contact: mailto:[DATA ASLI]
Expires: [DATA ASLI, maksimal 1 tahun ke depan, format RFC 3339]
Preferred-Languages: id, en
Policy: https://[DATA ASLI]/security
```

- Target waktu respons awal dan penyelesaian: [DATA ASLI]; jangan dipublikasikan sebelum tim sanggup memenuhinya.
- Pernyataan safe harbor untuk peneliti yang beritikad baik: disusun tim legal, [DATA ASLI].
- Cakupan awal: situs publik dan demo app. Platform masuk cakupan setelah F1 berjalan.
