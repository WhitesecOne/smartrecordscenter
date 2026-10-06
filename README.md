# Smart Records Center

Situs publik Smart Records Center, platform tata kelola arsip digital. Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui di atas Base UI, dan Motion. Seluruh teks dalam Bahasa Indonesia.

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run check    # cek skema formulir kontak dan rantai hash log audit
npm run build
```

## Variabel lingkungan

Salin `.env.example` menjadi `.env.local` untuk lokal, dan isi nilai yang sama di Vercel (Project Settings, Environment Variables).

| Nama | Wajib | Fungsi |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Ya, di produksi | URL kanonis, contoh `https://smartrecordscenter.com`. Tanpa nilai ini `robots.txt` memblokir semua crawler. |
| `RESEND_API_KEY` | Ya, agar formulir demo terkirim | Mengirim permintaan demo ke email pemilik lewat Resend. Tanpa kunci, permintaan hanya tercatat di log server. |
| `CONTACT_FROM` | Tidak | Alamat pengirim, harus memakai domain yang sudah diverifikasi di Resend. |
| `CONTACT_TO` | Tidak | Penerima permintaan demo. Bawaan: email di `src/lib/site.ts`. |
| `NEXT_PUBLIC_GA_ID` | Tidak | ID Google Analytics 4; dimuat hanya setelah pengunjung menyetujui cookie. |

## Struktur konten

- `src/lib/modules.ts`: tujuh modul (nama, fitur, peran AI, layar produk). Menu, halaman modul, dan footer membaca dari sini.
- `src/lib/site.ts`: nama, kontak, navigasi, sektor industri, dan acuan regulasi.
- `src/components/product/`: layar produk berlabel "Data contoh".
- `docs/IMAGE-CREDITS.md`: sumber dan lisensi setiap foto.
- `public/brand/` dan `docs/BRAND.md`: berkas logo dan panduan pemakaiannya.
- `DESIGN.md` dan `PRODUCT.md`: sistem desain dan kebenaran produk.

## Deploy

Repositori ini terhubung ke Vercel. Setiap push ke `main` memicu deploy produksi. Domain `smartrecordscenter.com` dikelola DNS-nya di Hostinger; nilai record yang benar selalu yang ditampilkan Vercel di Project Settings, Domains (atau `vercel domains inspect smartrecordscenter.com`).
