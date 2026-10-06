# Panduan logo Smart Records Center

Disetujui pemilik pada 6 Oktober 2026 (konsep C, "Arsip Tersimpan").

## Gagasan

Bingkai sistem yang sudut terakhirnya diisi satu blok arsip: arsip masuk ke sistem dan terkunci di tempatnya. Bingkai navy adalah platform, blok biru adalah arsip yang tersimpan dan dapat dibuktikan.

## Berkas

Semua master ada di `public/brand/` (SVG, bidang tertutup, tanpa teks hidup).

| Berkas | Pakai untuk |
|---|---|
| `logo-symbol.svg` / `.png` (1024 px) | Latar putih atau terang, ukuran 48 px ke atas |
| `logo-symbol-small.svg` | 16 sampai 48 px: bingkai lebih tebal, blok lebih besar |
| `logo-symbol-inverse.svg` | Latar navy atau gelap |
| `logo-symbol-black.svg`, `logo-symbol-white.svg` | Cetak satu warna, stempel, emboss |
| `logo-app-icon.svg` / `.png` (1024 px) | Favicon, ikon aplikasi, avatar media sosial |

Di situs, simbol digambar oleh `src/components/logo.tsx` (versi ukuran kecil) dan nama ditulis dengan Red Hat Display Bold. Favicon dan ikon aplikasi dibuat dari `src/app/icon.svg`.

## Warna

| Peran | HEX | RGB |
|---|---|---|
| Bingkai, navy | `#0B2447` | 11, 36, 71 |
| Blok arsip, biru | `#1D4ED8` | 29, 78, 216 |
| Blok arsip di latar navy | `#9BB8FF` | 155, 184, 255 |

Di latar navy, bingkai menjadi putih dan blok memakai `#9BB8FF`.

## Ruang kosong dan ukuran minimum

- Ruang kosong di sekeliling simbol minimal selebar blok arsip (seperempat lebar simbol).
- Ukuran minimum: 16 px di layar (pakai versi ukuran kecil), 8 mm di cetak.
- Jarak simbol ke nama: sekitar sepertiga tinggi simbol.

## Jangan

- Memutar, memiringkan, atau mencerminkan simbol.
- Memindahkan blok arsip ke sudut lain atau menutup celah bingkai.
- Mengganti warna di luar tabel di atas, menambah gradien, bayangan, atau garis tepi.
- Menaruh simbol berwarna navy di atas latar gelap; pakai versi terbalik.

## Catatan

Belum ada pemeriksaan merek dagang. Sebelum logo didaftarkan atau dipakai di materi resmi, lakukan penelusuran di DJKI (pdki-indonesia.dgip.go.id).
