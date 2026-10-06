/** Questions records managers, auditors and IT ask before a demo. Shown on the home page and in /llms.txt; answers restate what the site already documents. */
export const faq: { q: string; a: string }[] = [
  {
    q: "Apa itu Smart Records Center?",
    a: "Smart Records Center adalah platform tata kelola arsip digital untuk organisasi teregulasi di Indonesia. Platform ini menyatukan tujuh modul: repositori arsip, pencarian dan temu kembali, manajemen metadata, klasifikasi arsip, retensi dan penyusutan, jejak audit, serta pelaporan, di atas satu sumber data dan satu jejak audit.",
  },
  {
    q: "Apakah usulan AI langsung berlaku?",
    a: "Tidak. AI hanya mengusulkan kode klasifikasi, nilai metadata, atau temuan risiko. Setiap usulan menampilkan sumber dan skor keyakinannya, lalu menunggu konfirmasi arsiparis. Usulan dengan keyakinan di bawah 0,90 ditandai wajib review, dan model, versi, serta peninjaunya tercatat di jejak audit.",
  },
  {
    q: "Bagaimana data antarorganisasi dipisahkan?",
    a: "Setiap organisasi memiliki ruang data sendiri (multi-tenant). Setiap kueri dibatasi pada organisasi milik pengguna, dan berkas setiap organisasi dienkripsi dengan kunci miliknya sendiri. Administrator satu organisasi tidak dapat melihat arsip organisasi lain.",
  },
  {
    q: "Standar metadata apa yang dipakai?",
    a: "Skema metadata mengikuti elemen Dublin Core (ISO 15836) yang diperluas dengan elemen kearsipan seperti kode klasifikasi, retensi, dan tingkat keamanan. Metadata manajemen arsip mengacu pada prinsip ISO 23081, sehingga arsip tetap dapat dipertukarkan dan diperiksa oleh sistem lain.",
  },
  {
    q: "Bagaimana jadwal retensi arsip (JRA) dijalankan?",
    a: "JRA ditulis sebagai aturan yang dijalankan mesin aturan. Tanggal pindah ke inaktif dan jatuh tempo dihitung dari tanggal penutupan berkas. Arsip yang jatuh tempo disusun menjadi usulan penyusutan yang harus disetujui berjenjang oleh orang yang berbeda dari pengusulnya.",
  },
  {
    q: "Bisakah jejak audit diubah oleh administrator?",
    a: "Tidak. Log audit bersifat append-only dan setiap entri menyimpan hash entri sebelumnya. Perubahan pada satu entri membuat rantai putus tepat di entri itu saat diverifikasi, sehingga auditor dapat memeriksa keutuhan log dan paket bukti secara mandiri.",
  },
  {
    q: "Apakah arsip bisa dihapus dari repositori?",
    a: "Tidak ada tombol hapus. Arsip hanya keluar dari repositori melalui penyusutan resmi dengan persetujuan berjenjang dan berita acara digital. Arsip dalam legal hold dan arsip vital tidak pernah masuk usulan pemusnahan.",
  },
  {
    q: "Regulasi dan standar apa yang dijadikan acuan?",
    a: "Rancangan platform mengacu pada UU 43/2009 tentang Kearsipan, UU 27/2022 tentang Pelindungan Data Pribadi, ISO 15489 tentang manajemen rekod, ISO 23081 tentang metadata manajemen rekod, dan ISO 15836 tentang elemen metadata Dublin Core. Acuan ini adalah dasar rancangan, bukan klaim sertifikasi.",
  },
]
