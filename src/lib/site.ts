export const site = {
  name: "Smart Records Center",
  tagline: "Platform tata kelola arsip digital",
  description:
    "Smart Records Center adalah platform tata kelola arsip digital: repositori terstruktur per organisasi, pencarian teks lengkap, metadata standar, klasifikasi, retensi dan penyusutan, jejak audit yang tidak dapat diubah, serta pelaporan kepatuhan, dengan AI yang usulannya selalu ditinjau manusia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Contact details and entity name supplied by the owner on 2026-10-06 (provisional until the legal entity is registered).
  entity: "Smart Records Center",
  address: "Jl. Raya Ceger, Jl. H. Baneng No. 4, RT.6/RW.3, Ceger, Kec. Cipayung, Kota Jakarta Timur, DKI Jakarta 13880",
  email: "hqonitah@gmail.com",
  phone: "+62 816-744-953",
  securityEmail: "hqonitah@gmail.com",
}

export type NavLink = { href: string; label: string; desc?: string }
export type Sector = NavLink & { id: string; photo: { src: string; alt: string } }

export const platformNav: NavLink[] = [
  { href: "/platform", label: "Ikhtisar Platform", desc: "Tujuh modul di atas satu sumber data dan satu jejak audit." },
  { href: "/platform/cara-kerja", label: "Cara Kerja", desc: "Perjalanan satu arsip dari diterima sampai permanen atau musnah." },
  { href: "/platform/arsitektur", label: "Arsitektur & Integrasi", desc: "Lapisan sistem, pemisahan organisasi, opsi penerapan, dan integrasi." },
  { href: "/platform/keamanan", label: "Keamanan & Kepatuhan", desc: "Kontrol akses, enkripsi, jejak audit, dan acuan regulasi." },
]

export const sectors: Sector[] = [
  {
    id: "pemerintah",
    href: "/industri#pemerintah",
    label: "Instansi Pemerintah",
    desc: "Klasifikasi dan JRA instansi, penyusutan dengan berita acara, arsip vital dan permanen.",
    photo: { src: "/images/monas-aerial.webp", alt: "Monumen Nasional dan gedung-gedung di Jakarta Pusat dilihat dari udara" },
  },
  {
    id: "bumn",
    href: "/industri#bumn",
    label: "BUMN & BUMD",
    desc: "Arsip korporasi dan arsip penugasan pemerintah dalam satu tata kelola, dengan anak perusahaan sebagai organisasi terpisah.",
    photo: { src: "/images/port-aerial.webp", alt: "Pelabuhan peti kemas dengan dermaga dan kapal dilihat dari udara" },
  },
  {
    id: "keuangan",
    href: "/industri#keuangan",
    label: "Perbankan & Keuangan",
    desc: "Retensi dokumen nasabah dan transaksi, data pribadi tersamar, bukti untuk pemeriksaan.",
    photo: { src: "/images/finance-towers.webp", alt: "Dua menara perkantoran berdinding kaca di bawah langit cerah" },
  },
  {
    id: "korporasi",
    href: "/industri#korporasi",
    label: "Korporasi",
    desc: "Kontrak, SDM, dan keuangan tertata dengan hak akses per unit dan per anak perusahaan.",
    photo: { src: "/images/office-curve.webp", alt: "Gedung perkantoran berdinding kaca melengkung" },
  },
]

export const companyNav: NavLink[] = [
  { href: "/mengapa-kami", label: "Mengapa Kami", desc: "Alasan memilih platform yang dibangun untuk kearsipan Indonesia." },
  { href: "/tentang-kami", label: "Tentang Kami", desc: "Siapa kami, prinsip kerja, dan cara kami bekerja dengan klien." },
]

export const legalNav: NavLink[] = [
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
]

/** Regulations and standards the design follows. References, not certification claims. */
export const references = [
  { code: "UU 43/2009", name: "tentang Kearsipan" },
  { code: "UU 27/2022", name: "tentang Pelindungan Data Pribadi" },
  { code: "ISO 15489", name: "Manajemen rekod" },
  { code: "ISO 23081", name: "Metadata manajemen rekod" },
  { code: "ISO 15836", name: "Elemen metadata Dublin Core" },
]

/** Page-level openGraph replaces the layout's object wholesale, so every page spreads this in. */
export const ogBase = { siteName: site.name, locale: "id_ID", type: "website" } as const
