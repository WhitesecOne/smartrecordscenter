import {
  ArchiveIcon,
  CalendarClockIcon,
  ChartColumnBigIcon,
  FileSearchIcon,
  FolderTreeIcon,
  ScrollTextIcon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react"

export type MockKey =
  | "tenants"
  | "records"
  | "lifecycle"
  | "fixity"
  | "duplicate"
  | "search"
  | "facets"
  | "semantic"
  | "access"
  | "metadata"
  | "validation"
  | "history"
  | "extraction"
  | "bcs"
  | "versions"
  | "classify"
  | "retention"
  | "disposition"
  | "transfer"
  | "hold"
  | "risk"
  | "register"
  | "evidence"
  | "anomaly"
  | "reports"
  | "dashboard"
  | "regulator"
  | "summary"

/** `ai` marks a feature where a model proposes and a person confirms. */
export type Feature = { id: string; name: string; desc: string; points: string[]; mock: MockKey; ai?: boolean }
export type Rule = { part: string; does: string; rule: string; evidence: string }
export type Photo = { src: string; alt: string }

export type Module = {
  slug:
    | "repositori-arsip"
    | "pencarian-temu-kembali"
    | "manajemen-metadata"
    | "klasifikasi-arsip"
    | "retensi-penyusutan"
    | "jejak-audit"
    | "pelaporan"
  name: string
  icon: LucideIcon
  /** One line under the name in menus, lists and cards. */
  short: string
  /** What the model does inside this module, in one sentence. */
  ai: string
  title: string
  lead: string
  metaDescription: string
  heroMock: MockKey
  features: Feature[]
  rules: Rule[]
  related: Module["slug"][]
}

export const modules: Module[] = [
  {
    slug: "repositori-arsip",
    name: "Repositori Arsip",
    icon: ArchiveIcon,
    short: "Penyimpanan arsip terstruktur dengan pemisahan data antarorganisasi yang aman.",
    ai: "AI mengenali berkas yang identik atau hampir sama, lalu menautkannya untuk ditinjau arsiparis.",
    title: "Penyimpanan arsip yang terstruktur, terpisah per organisasi, dan terjaga keutuhannya",
    lead: "Setiap organisasi menyimpan arsipnya dalam ruang data sendiri. Arsip tersusun dari khazanah, seri, berkas, hingga item, dengan status aktif, inaktif, atau permanen yang mengikuti jadwal retensinya.",
    metaDescription:
      "Repositori arsip terstruktur dengan pemisahan data antarorganisasi (multi-tenant), status aktif, inaktif, dan permanen, cek keutuhan berkas, serta deteksi duplikat berbantuan AI.",
    heroMock: "records",
    features: [
      {
        id: "pemisahan-organisasi",
        name: "Pemisahan data antarorganisasi",
        desc: "Satu platform melayani banyak organisasi (multi-tenant). Data, kunci enkripsi, pengguna, dan aturan setiap organisasi terpisah sepenuhnya.",
        points: [
          "Setiap permintaan data selalu dibatasi pada organisasi milik pengguna",
          "Kunci enkripsi dibuat dan dikelola per organisasi",
          "Administrator satu organisasi tidak dapat melihat arsip organisasi lain",
        ],
        mock: "tenants",
      },
      {
        id: "struktur",
        name: "Struktur penyimpanan berjenjang",
        desc: "Arsip disusun dari khazanah, seri, berkas, sampai item. Setiap arsip memiliki nomor, kode klasifikasi, unit pengolah, dan tingkat keamanan yang jelas.",
        points: [
          "Nomor arsip mengikuti pola unit, tahun, dan urutan",
          "Filter berdasarkan status, unit, kode, dan tingkat keamanan",
          "Tidak ada tombol hapus; arsip hanya keluar melalui penyusutan resmi",
        ],
        mock: "records",
      },
      {
        id: "status",
        name: "Status aktif, inaktif, dan permanen",
        desc: "Setelah berkas ditutup, masa retensi mulai dihitung. Arsip berpindah status pada tanggal yang dihitung sistem, bukan menunggu seseorang mengingatnya.",
        points: [
          "Arsip aktif masih dapat diperbarui versinya oleh unit pengolah",
          "Arsip inaktif hanya dapat dibaca dan setiap peminjaman dicatat",
          "Setiap perpindahan status tercatat di jejak audit",
        ],
        mock: "lifecycle",
      },
      {
        id: "keutuhan",
        name: "Keutuhan berkas terjaga",
        desc: "Hash SHA-256 setiap berkas dihitung saat diterima dan diperiksa ulang secara terjadwal. Salinan disimpan di lebih dari satu lokasi.",
        points: [
          "Selisih hash membuka insiden dan memulihkan berkas dari salinan yang utuh",
          "Arsip permanen disimpan di media write-once yang tidak dapat diubah",
          "Hasil setiap pemeriksaan tersimpan dan dapat diekspor",
        ],
        mock: "fixity",
      },
      {
        id: "duplikat",
        name: "Deteksi duplikat",
        desc: "Berkas identik dikenali dari hash yang sama. Berkas yang hampir sama, seperti pindaian ulang atau versi lain, dikenali AI dari kemiripan isinya.",
        points: [
          "Duplikat ditautkan, tidak pernah dihapus otomatis",
          "Arsiparis memilih arsip utama dan menandai sisanya",
          "Keputusan penanganan duplikat tercatat",
        ],
        mock: "duplicate",
        ai: true,
      },
    ],
    rules: [
      { part: "Pemisahan organisasi", does: "Membatasi data dan kunci per organisasi", rule: "Setiap permintaan dibatasi pada organisasi pengguna", evidence: "Log akses dengan penanda organisasi" },
      { part: "Struktur", does: "Menyusun khazanah, seri, berkas, dan item", rule: "Arsip final wajib memiliki nomor dan kode klasifikasi", evidence: "Riwayat penetapan nomor dan kode" },
      { part: "Status", does: "Memindahkan arsip aktif, inaktif, permanen", rule: "Tanggal pindah dihitung dari aturan retensi", evidence: "Kejadian perpindahan status" },
      { part: "Keutuhan", does: "Memeriksa hash dan menjaga salinan", rule: "Selisih hash membuka insiden pemulihan", evidence: "Hasil pemeriksaan per berkas" },
      { part: "Duplikat (AI)", does: "Menautkan berkas identik dan mirip", rule: "Tidak ada penghapusan otomatis", evidence: "Pasangan duplikat dan keputusannya" },
    ],
    related: ["klasifikasi-arsip", "retensi-penyusutan", "jejak-audit"],
  },
  {
    slug: "pencarian-temu-kembali",
    name: "Pencarian & Temu Kembali",
    icon: FileSearchIcon,
    short: "Pencarian teks lengkap dan berbasis metadata, disaring hak akses.",
    ai: "AI membaca pindaian dengan OCR dan memahami maksud kalimat pencarian, bukan hanya kata yang sama persis.",
    title: "Arsip yang dicari ditemukan dalam hitungan detik, sesuai hak akses",
    lead: "Cari dengan kata di dalam dokumen, dengan field metadata, atau dengan kalimat biasa. Hasil selalu disaring oleh hak akses pengguna sebelum ditampilkan, dan pencarian atas arsip rahasia tercatat.",
    metaDescription:
      "Pencarian teks lengkap dan berbasis metadata atas arsip digital, OCR untuk pindaian, pencarian makna berbantuan AI, dan hasil yang disaring hak akses.",
    heroMock: "search",
    features: [
      {
        id: "teks-lengkap",
        name: "Pencarian teks lengkap",
        desc: "Isi setiap dokumen diindeks, termasuk pindaian yang sudah melalui OCR. Cuplikan menunjukkan letak kata di dalam dokumen.",
        points: [
          "Mendukung frasa, sinonim istilah kearsipan, dan operator pencarian",
          "Cuplikan teks menunjukkan halaman dan posisi kata yang cocok",
          "Hasil diurutkan menurut relevansi atau tanggal",
        ],
        mock: "search",
      },
      {
        id: "metadata",
        name: "Pencarian berbasis metadata",
        desc: "Saring hasil berdasarkan kode klasifikasi, unit pengolah, rentang tanggal, status, dan tingkat keamanan.",
        points: [
          "Filter dapat digabung dan disimpan sebagai pencarian tetap",
          "Jumlah hasil per filter terlihat sebelum dipilih",
          "Hasil dapat diekspor menjadi daftar arsip",
        ],
        mock: "facets",
      },
      {
        id: "hak-akses",
        name: "Hasil sesuai hak akses",
        desc: "Akses ditentukan oleh peran, unit kerja, dan tingkat keamanan arsip: Biasa, Terbatas, Rahasia, dan Sangat Rahasia.",
        points: [
          "Arsip rahasia tidak muncul di hasil pencarian bagi yang tidak berwenang",
          "Setiap pembukaan, unduhan, dan penolakan akses tercatat",
          "Peminjaman arsip inaktif memakai izin berbatas waktu",
        ],
        mock: "access",
      },
      {
        id: "pencarian-makna",
        name: "Pencarian makna dan OCR",
        desc: "AI mengubah pindaian menjadi teks yang dapat dicari dan memahami maksud kalimat, sehingga \"kontrak sewa gedung yang habis tahun ini\" tetap menemukan arsip yang relevan.",
        points: [
          "Hasil pencarian makna tetap disaring hak akses",
          "Kata kunci yang cocok tetap ditandai agar pengguna dapat memeriksa",
          "Kualitas OCR per halaman tercatat dan halaman buruk ditandai",
        ],
        mock: "semantic",
        ai: true,
      },
    ],
    rules: [
      { part: "Teks lengkap", does: "Mengindeks isi dokumen dan pindaian", rule: "Indeks diperbarui setiap versi baru", evidence: "Status indeks per berkas" },
      { part: "Metadata", does: "Menyaring berdasarkan field arsip", rule: "Filter mengikuti skema metadata organisasi", evidence: "Pencarian tetap yang tersimpan" },
      { part: "Hak akses", does: "Menyaring hasil sebelum ditampilkan", rule: "Tingkat keamanan membatasi hasil", evidence: "Log pencarian atas arsip rahasia" },
      { part: "Pencarian makna (AI)", does: "Mencocokkan maksud kalimat", rule: "Hasil tetap disaring hak akses", evidence: "Kueri dan arsip yang dibuka" },
    ],
    related: ["manajemen-metadata", "klasifikasi-arsip", "jejak-audit"],
  },
  {
    slug: "manajemen-metadata",
    name: "Manajemen Metadata",
    icon: TagsIcon,
    short: "Skema metadata sesuai standar Dublin Core yang diperluas dan ISO 23081.",
    ai: "AI mengambil nomor surat, tanggal, pengirim, dan perihal langsung dari dokumen, lengkap dengan sumber dan skor keyakinannya.",
    title: "Metadata yang lengkap, konsisten, dan sesuai standar sejak arsip diterima",
    lead: "Skema metadata mengikuti elemen Dublin Core yang diperluas untuk kebutuhan kearsipan dan prinsip ISO 23081. Field wajib divalidasi, perubahan tercatat, dan AI membantu mengisi nilai dari isi dokumen.",
    metaDescription:
      "Manajemen metadata arsip dengan skema Dublin Core yang diperluas dan ISO 23081, validasi field wajib, riwayat perubahan, dan ekstraksi metadata berbantuan AI.",
    heroMock: "metadata",
    features: [
      {
        id: "skema",
        name: "Skema metadata standar",
        desc: "Elemen Dublin Core seperti judul, pencipta, tanggal, subjek, dan format diperluas dengan elemen kearsipan: kode klasifikasi, retensi, tingkat keamanan, dan hubungan antararsip.",
        points: [
          "Elemen dipetakan ke Dublin Core agar dapat dipertukarkan",
          "Metadata manajemen arsip mengikuti prinsip ISO 23081",
          "Organisasi dapat menambah elemen sendiri tanpa merusak skema dasar",
        ],
        mock: "metadata",
      },
      {
        id: "validasi",
        name: "Field wajib dan validasi",
        desc: "Setiap jenis arsip memiliki daftar field wajib dan format nilai. Arsip dengan metadata belum lengkap tidak dapat ditetapkan sebagai arsip final.",
        points: [
          "Format tanggal, nomor surat, dan kode diperiksa saat diisi",
          "Daftar nilai baku untuk unit, jenis, dan tingkat keamanan",
          "Arsip dengan field wajib kosong ditandai di antrean kerja",
        ],
        mock: "validation",
      },
      {
        id: "riwayat",
        name: "Riwayat perubahan metadata",
        desc: "Setiap perubahan nilai metadata menyimpan nilai lama, nilai baru, pengubah, waktu, dan alasannya.",
        points: [
          "Nilai dari mesin dan koreksi manusia disimpan berdampingan",
          "Perubahan pada arsip inaktif memerlukan persetujuan",
          "Riwayat dapat diekspor bersama arsipnya",
        ],
        mock: "history",
      },
      {
        id: "ekstraksi",
        name: "Ekstraksi metadata",
        desc: "AI mengisi field dari isi dokumen. Setiap nilai menyimpan halaman dan posisi teks asalnya serta skor keyakinan.",
        points: [
          "Nilai dengan keyakinan di bawah 0,90 ditandai perlu review",
          "Arsiparis mengonfirmasi atau mengoreksi sebelum nilai berlaku",
          "Model, versi, dan peninjau tercatat per arsip",
        ],
        mock: "extraction",
        ai: true,
      },
    ],
    rules: [
      { part: "Skema", does: "Menetapkan elemen metadata", rule: "Elemen dipetakan ke Dublin Core dan ISO 23081", evidence: "Versi skema yang berlaku" },
      { part: "Validasi", does: "Memeriksa field wajib dan format", rule: "Arsip final wajib lengkap", evidence: "Hasil validasi per arsip" },
      { part: "Riwayat", does: "Menyimpan setiap perubahan nilai", rule: "Perubahan menyertakan alasan", evidence: "Nilai lama, nilai baru, dan pengubah" },
      { part: "Ekstraksi (AI)", does: "Mengisi field dari isi dokumen", rule: "Di bawah 0,90 wajib review", evidence: "Model, skor, sumber, dan peninjau" },
    ],
    related: ["klasifikasi-arsip", "pencarian-temu-kembali", "repositori-arsip"],
  },
  {
    slug: "klasifikasi-arsip",
    name: "Klasifikasi Arsip",
    icon: FolderTreeIcon,
    short: "Taksonomi klasifikasi arsip yang dapat dikonfigurasi per organisasi.",
    ai: "AI mengusulkan kode klasifikasi dari isi dan konteks dokumen; arsiparis mengonfirmasi, mengubah, atau menolaknya.",
    title: "Klasifikasi arsip yang mengikuti struktur dan fungsi organisasi Anda",
    lead: "Setiap organisasi menyusun taksonomi klasifikasinya sendiri: fungsi, kegiatan, dan transaksi. Kode klasifikasi menjadi alamat tetap arsip dan membawa aturan retensi serta tingkat keamanannya.",
    metaDescription:
      "Taksonomi klasifikasi arsip yang dapat dikonfigurasi per organisasi, versi skema yang tercatat, dan usulan klasifikasi berbantuan AI dengan konfirmasi arsiparis.",
    heroMock: "bcs",
    features: [
      {
        id: "taksonomi",
        name: "Taksonomi per organisasi",
        desc: "Kode klasifikasi hierarkis disusun berdasarkan fungsi, kegiatan, dan transaksi. Struktur dapat diimpor dari klasifikasi arsip yang sudah berlaku.",
        points: [
          "Kedalaman hierarki dan pola kode mengikuti kebutuhan organisasi",
          "Setiap kode membawa retensi, nasib akhir, dan tingkat keamanan",
          "Arsip tanpa kode klasifikasi tidak dapat ditetapkan sebagai arsip final",
        ],
        mock: "bcs",
      },
      {
        id: "versi",
        name: "Perubahan skema yang tercatat",
        desc: "Penambahan, penggabungan, dan penonaktifan kode berlaku dengan tanggal efektif. Arsip lama tetap memakai kode yang berlaku saat dibuat.",
        points: [
          "Perubahan kode tercatat: siapa, kapan, dan alasannya",
          "Pemetaan kode lama ke kode baru dapat dijalankan secara bertahap",
          "Riwayat versi skema tersedia untuk pemeriksaan",
        ],
        mock: "versions",
      },
      {
        id: "usulan-ai",
        name: "Usulan klasifikasi",
        desc: "AI membaca isi dan konteks dokumen lalu mengusulkan kode klasifikasi. Usulan tidak berlaku sebelum dikonfirmasi arsiparis.",
        points: [
          "Usulan dengan keyakinan di bawah 0,90 ditandai perlu review",
          "Arsiparis dapat mengubah atau menolak usulan",
          "Model, versi, skor, dan peninjau tercatat per arsip",
        ],
        mock: "classify",
        ai: true,
      },
    ],
    rules: [
      { part: "Taksonomi", does: "Memberi kode klasifikasi pada setiap arsip", rule: "Arsip final wajib memiliki kode", evidence: "Kode dan tanggal penetapan" },
      { part: "Versi skema", does: "Mengelola perubahan kode", rule: "Perubahan berlaku dengan tanggal efektif", evidence: "Riwayat perubahan dan alasannya" },
      { part: "Usulan (AI)", does: "Mengusulkan kode dari isi dokumen", rule: "Menunggu konfirmasi; di bawah 0,90 wajib review", evidence: "Model, versi, skor, dan peninjau" },
    ],
    related: ["retensi-penyusutan", "manajemen-metadata", "repositori-arsip"],
  },
  {
    slug: "retensi-penyusutan",
    name: "Retensi & Penyusutan",
    icon: CalendarClockIcon,
    short: "Mesin aturan jadwal retensi dan alur kerja penyusutan dengan persetujuan berjenjang.",
    ai: "AI menandai data pribadi dan arsip yang tampak salah klasifikasi sebelum masuk usulan penyusutan.",
    title: "Jadwal retensi dijalankan oleh mesin aturan, penyusutan melalui persetujuan berjenjang",
    lead: "Jadwal retensi arsip (JRA) ditulis sebagai aturan yang dijalankan sistem. Tanggal pindah ke inaktif dan jatuh tempo dihitung otomatis, lalu arsip yang jatuh tempo disusun menjadi usulan pemindahan, pemusnahan, atau penyerahan.",
    metaDescription:
      "Mesin aturan jadwal retensi arsip (JRA), alur kerja penyusutan dengan persetujuan berjenjang, berita acara digital, legal hold, dan deteksi risiko berbantuan AI.",
    heroMock: "retention",
    features: [
      {
        id: "mesin-aturan",
        name: "Mesin aturan retensi",
        desc: "Setiap kode klasifikasi membawa masa retensi aktif, masa retensi inaktif, dan nasib akhir: permanen, musnah, atau dinilai kembali.",
        points: [
          "Tanggal dihitung dari tanggal penutupan berkas, bukan diisi manual",
          "Perubahan JRA berlaku dengan tanggal efektif yang jelas",
          "Daftar arsip yang akan jatuh tempo tersedia jauh hari sebelumnya",
        ],
        mock: "retention",
      },
      {
        id: "alur-penyusutan",
        name: "Alur kerja penyusutan",
        desc: "Arsip yang jatuh tempo disusun menjadi batch usulan. Batch melewati penilaian, persetujuan berjenjang, dan pelaksanaan dengan berita acara.",
        points: [
          "Pengusul dan penyetuju batch harus orang yang berbeda",
          "Berita acara digital memuat daftar arsip, penyetuju, dan hash setiap berkas",
          "Arsip yang ditolak kembali ke repositori dengan alasan tercatat",
        ],
        mock: "disposition",
      },
      {
        id: "penyerahan",
        name: "Penyerahan arsip permanen",
        desc: "Arsip bernilai guna permanen disiapkan dalam paket penyerahan ke lembaga kearsipan, lengkap dengan daftar arsip, metadata, dan hash berkas.",
        points: [
          "Paket penyerahan dapat diverifikasi keutuhannya oleh penerima",
          "Status penyerahan dipantau sampai diterima",
          "Bukti penerimaan tersimpan bersama arsipnya",
        ],
        mock: "transfer",
      },
      {
        id: "legal-hold",
        name: "Legal hold",
        desc: "Arsip yang terkait perkara atau pemeriksaan dibekukan sampai hold dicabut oleh pihak berwenang.",
        points: [
          "Arsip dalam hold otomatis dikeluarkan dari semua usulan penyusutan",
          "Dasar hold, pemohon, dan tanggal pencabutan tercatat",
          "Bagian hukum memantau daftar arsip dalam hold",
        ],
        mock: "hold",
      },
      {
        id: "deteksi-risiko",
        name: "Deteksi risiko sebelum penyusutan",
        desc: "AI menandai NIK, NPWP, nomor rekening, dan arsip yang tampak salah klasifikasi, agar tidak ada arsip yang dimusnahkan dengan dasar yang keliru.",
        points: [
          "Nilai sensitif selalu ditampilkan tersamar",
          "Arsip bertanda risiko ditahan dari batch sampai direview",
          "Temuan memiliki tingkat risiko dan tindak lanjut yang tercatat",
        ],
        mock: "risk",
        ai: true,
      },
    ],
    rules: [
      { part: "Mesin aturan", does: "Menghitung masa aktif, inaktif, dan nasib akhir", rule: "Tanggal dihitung dari penutupan berkas", evidence: "Aturan dan tanggal hasil hitungan" },
      { part: "Penyusutan", does: "Menyusun batch arsip yang jatuh tempo", rule: "Persetujuan berjenjang oleh orang yang berbeda", evidence: "Berita acara dengan hash setiap berkas" },
      { part: "Penyerahan", does: "Menyiapkan paket arsip permanen", rule: "Paket memuat hash setiap berkas", evidence: "Bukti penerimaan" },
      { part: "Legal hold", does: "Membekukan arsip terkait perkara", rule: "Dikeluarkan dari semua usulan penyusutan", evidence: "Dasar hold, pemohon, dan tanggal cabut" },
      { part: "Deteksi risiko (AI)", does: "Menandai data pribadi dan salah klasifikasi", rule: "Ditahan dari batch sampai direview", evidence: "Temuan, tingkat, dan tindak lanjut" },
    ],
    related: ["klasifikasi-arsip", "jejak-audit", "pelaporan"],
  },
  {
    slug: "jejak-audit",
    name: "Jejak Audit",
    icon: ScrollTextIcon,
    short: "Log yang tidak dapat diubah atas seluruh aksi terhadap arsip.",
    ai: "AI menandai pola akses yang tidak wajar, dan setiap keputusan AI di modul lain ikut tercatat di log yang sama.",
    title: "Setiap aksi terhadap arsip tercatat dan dapat diverifikasi",
    lead: "Log audit bersifat append-only dan dirantai dengan hash. Siapa melakukan apa, pada arsip mana, kapan, dan berdasarkan aturan apa tercatat permanen. Auditor dapat memastikan tidak ada entri yang diubah atau dihapus.",
    metaDescription:
      "Jejak audit append-only yang tidak dapat diubah atas seluruh aksi terhadap arsip, verifikasi rantai hash, paket bukti untuk pemeriksaan, dan deteksi akses tidak wajar berbantuan AI.",
    heroMock: "evidence",
    features: [
      {
        id: "log-immutable",
        name: "Log yang tidak dapat diubah",
        desc: "Setiap kejadian dicatat: pembuatan, pembukaan, perubahan metadata, perpindahan status, penyusutan, dan keputusan AI. Setiap entri menyimpan hash entri sebelumnya.",
        points: [
          "Entri tidak dapat diubah atau dihapus, termasuk oleh administrator",
          "Perubahan di tengah rantai langsung terdeteksi saat verifikasi",
          "Verifikasi rantai berjalan terjadwal dan setiap kali ekspor",
        ],
        mock: "register",
      },
      {
        id: "paket-bukti",
        name: "Paket bukti",
        desc: "Arsip, metadata, riwayat, dan potongan log diekspor dalam satu paket untuk pemeriksaan internal, audit eksternal, atau sengketa.",
        points: [
          "Paket memuat daftar isi dan hash setiap berkas",
          "Tujuan ekspor dan pemohonnya tercatat",
          "Penerima dapat memverifikasi keutuhan paket secara mandiri",
        ],
        mock: "evidence",
      },
      {
        id: "akses-tidak-wajar",
        name: "Deteksi akses tidak wajar",
        desc: "AI mempelajari pola akses normal per unit dan menandai penyimpangan, seperti unduhan massal di luar jam kerja atau akses berulang yang ditolak.",
        points: [
          "Temuan dikirim ke petugas keamanan, bukan memblokir otomatis",
          "Setiap temuan menyertakan entri log yang menjadi dasarnya",
          "Tindak lanjut dan penutupan temuan tercatat",
        ],
        mock: "anomaly",
        ai: true,
      },
    ],
    rules: [
      { part: "Log audit", does: "Mencatat setiap aksi terhadap arsip", rule: "Append-only, tidak dapat diubah atau dihapus", evidence: "Log itu sendiri" },
      { part: "Rantai hash", does: "Mengaitkan setiap entri dengan entri sebelumnya", rule: "Verifikasi terjadwal dan setiap ekspor", evidence: "Hasil verifikasi dengan hash awal dan akhir" },
      { part: "Paket bukti", does: "Mengekspor arsip, metadata, dan log", rule: "Paket memuat hash setiap isi", evidence: "Catatan ekspor: pemohon dan tujuan" },
      { part: "Akses tidak wajar (AI)", does: "Menandai penyimpangan pola akses", rule: "Temuan ditinjau petugas, tidak memblokir otomatis", evidence: "Temuan, entri dasar, dan tindak lanjut" },
    ],
    related: ["pelaporan", "retensi-penyusutan", "repositori-arsip"],
  },
  {
    slug: "pelaporan",
    name: "Pelaporan",
    icon: ChartColumnBigIcon,
    short: "Dasbor kepatuhan dan laporan operasional untuk pelanggan dan regulator.",
    ai: "AI menyusun draf ringkasan temuan periode berjalan untuk ditinjau sebelum laporan dikirim.",
    title: "Dasbor kepatuhan dan laporan yang siap diserahkan kepada pimpinan dan regulator",
    lead: "Status kepatuhan kearsipan terlihat setiap saat: arsip tanpa klasifikasi, retensi yang lewat jatuh tempo, penyusutan yang tertunda, dan hasil verifikasi jejak audit. Laporan berkala disusun dari data yang sama.",
    metaDescription:
      "Dasbor kepatuhan kearsipan, laporan operasional untuk pelanggan, laporan berkala untuk regulator, dan draf ringkasan temuan berbantuan AI.",
    heroMock: "reports",
    features: [
      {
        id: "dasbor-kepatuhan",
        name: "Dasbor kepatuhan",
        desc: "Indikator kepatuhan per unit dan per organisasi: kelengkapan klasifikasi dan metadata, ketepatan retensi, penyusutan tertunda, dan status rantai audit.",
        points: [
          "Setiap angka dapat ditelusuri sampai ke daftar arsipnya",
          "Indikator dapat disaring per unit, periode, dan jenis arsip",
          "Ambang batas per indikator ditetapkan oleh organisasi",
        ],
        mock: "reports",
      },
      {
        id: "laporan-operasional",
        name: "Laporan operasional",
        desc: "Volume arsip masuk, antrean review, peminjaman, dan pekerjaan unit kearsipan dalam satu tampilan untuk pengelola layanan dan pelanggan.",
        points: [
          "Laporan terjadwal dikirim ke penerima yang ditentukan",
          "Format ekspor PDF dan spreadsheet",
          "Setiap organisasi hanya melihat datanya sendiri",
        ],
        mock: "dashboard",
      },
      {
        id: "laporan-regulator",
        name: "Laporan untuk regulator",
        desc: "Daftar arsip, laporan penyusutan, dan rekap arsip vital disusun dalam format yang diminta lembaga pembina dan pemeriksa.",
        points: [
          "Templat laporan dapat disesuaikan per regulator",
          "Laporan menyertakan hash dan tanggal pembuatan",
          "Riwayat pengiriman laporan tersimpan",
        ],
        mock: "regulator",
      },
      {
        id: "ringkasan-ai",
        name: "Draf ringkasan temuan",
        desc: "AI menyusun draf narasi dari angka periode berjalan: apa yang berubah, unit mana yang tertinggal, dan temuan yang perlu perhatian.",
        points: [
          "Setiap kalimat dalam draf merujuk ke angka sumbernya",
          "Draf wajib ditinjau dan disetujui sebelum dikirim",
          "Model, versi, dan peninjau tercatat",
        ],
        mock: "summary",
        ai: true,
      },
    ],
    rules: [
      { part: "Dasbor kepatuhan", does: "Menampilkan indikator kepatuhan", rule: "Setiap angka dapat ditelusuri ke arsipnya", evidence: "Kueri dan waktu pembaruan" },
      { part: "Laporan operasional", does: "Merekap pekerjaan dan volume arsip", rule: "Data dibatasi per organisasi", evidence: "Jadwal dan penerima laporan" },
      { part: "Laporan regulator", does: "Menyusun laporan berkala", rule: "Laporan menyertakan hash dan tanggal", evidence: "Riwayat pengiriman" },
      { part: "Ringkasan (AI)", does: "Menyusun draf narasi temuan", rule: "Wajib ditinjau sebelum dikirim", evidence: "Model, versi, dan peninjau" },
    ],
    related: ["jejak-audit", "retensi-penyusutan", "repositori-arsip"],
  },
]

export const moduleBySlug = (slug: string) => modules.find((m) => m.slug === slug)
