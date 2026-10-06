# DESIGN-SYSTEM: Smart Records Center

Status: berlaku untuk website publik (Fase 0, Bahasa Indonesia). Dokumen ini ditulis dari kode yang sudah dibangun, bukan dari rencana. Sumber kebenaran token ada di `src/app/globals.css`; ringkasan mesin-baca ada di `DESIGN.md` (root) dan `.impeccable/design.json`.

## 1. Arah desain

- **Tema terang, formal, modern.** Situs dibaca di meja kerja pada siang hari oleh records manager, tim kepatuhan, dan CIO. Tidak ada mode gelap; ini keputusan pemilik (26 Sep 2026).
- **Produk sebagai gambar utama.** Aset visual utama adalah layar produk yang dibuat dengan kode (dashboard, jadwal retensi, ekstraksi AI, register audit), bukan ilustrasi generik. Setiap layar produk memuat label "Data contoh".
- **Bukti, bukan klaim.** Tidak ada angka, logo klien, testimoni, atau sertifikasi yang dikarang. Data yang belum ada ditulis `[DATA ASLI: ...]`.

## 2. Warna

| Token (CSS) | Nilai | Kelas Tailwind | Peran |
|---|---|---|---|
| `--navy` | `#0b2447` | `text-navy`, `bg-navy` | Heading, band CTA, footer, status Permanen |
| `--teal` | `#0e7c7b` | `bg-teal`, `text-teal` | Satu-satunya warna aksi: tombol utama, ikon centang, status Aktif |
| `--teal-ink` | `#0a6463` | `text-teal-ink` | Teks tautan dan hover tombol utama |
| `--teal-wash` | `#e7f3f2` | `bg-teal-wash` | Latar badge Aktif, sorotan baris |
| `--mist` | `#f5f7fa` | `bg-mist` | Permukaan section selang-seling |
| `--body` | `#3b4a5e` | `text-body` | Teks paragraf |
| `--muted-foreground` | `#526179` | `text-muted-foreground` | Teks sekunder |
| `--border` | `#e2e8f0` | `border-border` | Garis rambut |
| `--input` | `#cbd5e1` | `border-input` | Border kontrol form |
| `--destructive` | `#b42318` | `text-destructive` | Error form, rantai audit putus |

Warna status hanya dipakai di dalam UI produk:

| Status | Tampilan |
|---|---|
| Aktif | teal (`bg-teal-wash text-teal-ink`) |
| Inaktif | slate (`bg-slate-100 text-slate-700`) |
| Permanen | navy (`bg-[#e6ecf5] text-navy`) |
| Menunggu penyusutan | amber (`bg-st-pending-wash text-st-pending`, `#9a5b00` di atas `#fff4e0`) |
| Musnah | abu dicoret (`line-through`) |

Kontras yang sudah diperiksa (WCAG AA, teks normal 4,5:1):

| Pasangan | Rasio |
|---|---|
| Putih di atas teal | 5,01 |
| Teal-ink di atas teal-wash | 6,13 |
| Muted di atas mist | 5,85 |
| Amber di atas amber-wash | 4,98 |
| Putih 65% di atas navy | 6,86 |
| Body di atas putih | 9,02 |

## 3. Tipografi

- **Plus Jakarta Sans** (variabel, `next/font`) untuk semua teks. Alasan: huruf ini dirancang untuk identitas kota Jakarta, berakar lokal, modern, dan formal.
- **JetBrains Mono** hanya untuk nomor arsip, kode klasifikasi, hash, dan waktu. Tidak dipakai sebagai hiasan.

| Kelas | Pemakaian | Nilai |
|---|---|---|
| `.display` | h1 | berat 750, tracking -0.03em, line-height 1.05; halaman dalam `clamp(2.25rem, 4.4vw, 3.5rem)`, hero beranda `clamp(2.4rem, 4.4vw, 3.6rem)` |
| `.h2` | heading section | berat 700, `clamp(1.875rem, 3.1vw, 2.625rem)` |
| `.lead` | paragraf pembuka | 1.125rem, line-height 1.7 |
| body | paragraf | 1rem sampai 0.9375rem, line-height lega |
| `.code` | data | JetBrains Mono, tracking -0.01em |

Aturan: satu h1 per halaman (dari `PageHero` atau hero beranda), tanpa eyebrow/kicker kecil di atas heading, tanpa gradient text, lebar baca paragraf maksimal sekitar 60ch.

## 4. Ruang, radius, elevasi

- Kontainer: `.container-page` = `max-w-7xl` dengan gutter 16/24/32px.
- Ritme section: `py-20 lg:py-28` (komponen `Section`), permukaan `white` dan `mist` bergantian.
- Radius: tombol 8px (`rounded-md`), kontrol form 10px (`rounded-lg`), kartu dan bingkai produk 14px (`rounded-xl`), band CTA 18px (`rounded-2xl`), badge 5px. Tombol, badge, dan tag tidak pernah berbentuk pil; lingkaran hanya untuk penanda langkah dan titik.
- Elevasi: `.shadow-product` (tiga lapis lembut) hanya untuk bingkai produk, mega menu, cookie banner, dan kartu yang di-hover. Kartu biasa memakai border, bukan bayangan.

## 5. Komponen

| Komponen | Berkas | Catatan |
|---|---|---|
| Header + mega menu | `src/components/header-nav.tsx` | Utility bar navy, NavigationMenu Base UI (Platform, Modul, Solusi), Sheet + Accordion di mobile, bayangan saat scroll |
| Footer | `src/components/site-footer.tsx` | Navy, kontak `[DATA ASLI]`, tautan legal, pengaturan cookie |
| Section, SectionHeading, PageHero, Breadcrumb, CtaBand | `src/components/section.tsx` | Kerangka semua halaman |
| Reveal | `src/components/reveal.tsx` | Satu gerakan naik singkat saat masuk layar; konten tetap terlihat tanpa JavaScript |
| Diagram platform | `src/components/platform-diagram.tsx` | Bagan struktur produk, setiap node menaut ke halaman modul |
| Timeline siklus hidup | `src/components/lifecycle.tsx` | Garis penghubung menggambar diri sekali saat terlihat |
| Diagram arsitektur | `src/components/architecture-diagram.tsx` | Arsitektur target dari `docs/ARCHITECTURE.md` |
| Layar produk | `src/components/product/*` | `MockFrame`, `MockPanel`, `MockTable`, `StatusBadge`, `Confidence`, 19 layar (`ProductMock k="..."`) |
| Register audit interaktif | `src/components/product/register-client.tsx` | Verifikasi SHA-256 sungguhan di browser, simulasi pengubahan entri |
| Ekstraksi metadata interaktif | `src/components/product/extraction.tsx` | Hover/fokus baris menyorot sumber nilai di dokumen |
| Cookie banner | `src/components/cookie-consent.tsx` | Tolak dan Izinkan setara; analitik hanya dimuat setelah izin |
| CTA lengket mobile | `src/components/sticky-cta.tsx` | Muncul hanya saat CTA di halaman tidak terlihat penuh |

Kontrol di dalam layar produk adalah bagian dari gambar. Kontrol itu dirender sebagai `span`, bukan tombol aktif, supaya tidak ada kontrol mati.

## 6. Gerak

- Masuk hero: dashboard naik 28px dan kartu usulan AI menyusul. Keduanya tidak memudar dari nol.
- `Reveal` pada visual section, garis timeline, dan transisi tab modul.
- `MotionConfig reducedMotion="user"` menghormati preferensi pengguna. `html[data-scroll-behavior="smooth"]` wajib ada agar Next.js mematikan smooth scroll saat berpindah halaman.

## 7. Aset gambar

- Foto dari Unsplash (lisensi Unsplash), disimpan lokal di `public/images/*.webp` dan dikompres dengan cwebp (q72, lebar maks 1800px). Selalu lewat `next/image` dengan `sizes` dan alt berbahasa Indonesia.
- Logo di `src/components/logo.tsx` masih **sementara**: tumpukan lembar arsip di kotak navy. Ganti dengan logo resmi pemilik.
- Ikon favicon, Apple, manifest (192/512), dan OG image 1200x630 dibuat dari mark yang sama (`src/app/icon.svg`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`).

## 8. Konten dan bahasa

- Bahasa Indonesia formal, kalimat aktif, istilah kearsipan baku (BCS, JRA, penyusutan, berita acara, arsip vital).
- CTA spesifik: "Minta Demo", "Lihat Cara Kerjanya", "Kirim Permintaan Demo". Tidak memakai "Get Started" atau "Learn More".
- Tanpa em dash. Tanpa kata promosi kosong seperti revolusioner, canggih, atau seamless.
- Regulasi dan standar ditulis sebagai referensi rancangan, bukan klaim sertifikasi.

## 9. Saat menambah halaman

1. Pakai `PageHero` dan `Section` dari `section.tsx`. Jangan membuat kerangka baru.
2. Isi `metadata` dengan `title`, `description` 140 sampai 160 karakter, `alternates.canonical`, dan `openGraph: { ...ogBase, url, title, description }` (`ogBase` dari `src/lib/site.ts`).
3. Tambahkan URL ke `src/app/sitemap.ts` bila halaman itu kanonis.
4. Jalankan `npm run check`, `npx tsc --noEmit`, `npx eslint src`, dan pemeriksaan overflow di 320px.
