import type { Metadata } from "next"

import { ProductMock } from "@/components/product/mocks"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { ogBase, site } from "@/lib/site"

const title = "Tentang Kami"
const description =
  "Latar belakang dan prinsip Smart Records Center, platform tata kelola arsip digital bagi organisasi teregulasi yang wajib membuktikan pengelolaan arsipnya."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tentang-kami" },
  openGraph: { ...ogBase, url: "/tentang-kami", title, description },
}

const problems = [
  {
    head: "Arsip tersebar di banyak tempat.",
    text: "Folder bersama, email, aplikasi unit, dan lemari kertas menyimpan potongan yang berbeda. Tidak ada satu sumber yang bisa dipercaya untuk menjawab arsip mana yang berlaku.",
  },
  {
    head: "Retensi dihitung manual.",
    text: "Skema klasifikasi dan JRA tersedia sebagai dokumen kebijakan, tetapi penerapannya dikerjakan satu per satu. Hasilnya tidak konsisten dan jatuh tempo retensi terlewat.",
  },
  {
    head: "Bukti audit sulit dihadirkan.",
    text: "Daftar usulan penyusutan dan berita acara disusun terpisah, sementara log aplikasi biasa dapat diubah administrator. Saat pemeriksaan, kepatuhan harus dibuktikan dengan kerja tambahan.",
  },
]

const principles = [
  { title: "Tata kelola lebih dulu", text: "Setiap fitur dijelaskan melalui aturan yang ditegakkannya: klasifikasi, retensi, akses, atau penyusutan." },
  { title: "Siklus hidup, bukan daftar modul", text: "Kami menjelaskan arsip dari diterima sampai permanen atau musnah. Ketujuh modul adalah cara menjalankan tahap-tahap itu." },
  { title: "Bukti di atas klaim", text: "Setiap tindakan otomatis dapat ditelusuri dan diaudit. Regulasi dan standar kami sebut sebagai rujukan rancangan, bukan klaim sertifikasi." },
  { title: "Bahasa yang jelas dan formal", text: "Kami memakai bahasa yang lugas dan tepat, yang dapat dipercaya arsiparis maupun auditor." },
]

/** Visible slot for company facts the owner has not supplied yet. */
function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-navy/30 bg-white px-4 py-3 text-[0.9375rem] font-medium text-navy">{children}</p>
}

export default function TentangKamiPage() {
  const legal = [
    ["Nama badan hukum", site.entity],
    ["Nomor Induk Berusaha (NIB)", "[DATA ASLI: NIB]"],
    ["Alamat kantor", site.address],
    ["Email", site.email],
    ["Telepon", site.phone],
  ]

  return (
    <>
      <PageHero
        crumbs={[{ label: "Tentang Kami" }]}
        title="Kami membangun tata kelola arsip yang bisa dipertanggungjawabkan"
        lead="Smart Records Center dibuat untuk organisasi yang wajib menyimpan, menemukan kembali, menyusutkan, dan membuktikan pengelolaan arsipnya di bawah aturan kearsipan dan pelindungan data pribadi di Indonesia."
        photo={{ src: "/images/jakarta-skyline.webp", alt: "Cakrawala gedung perkantoran Jakarta saat fajar" }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              title="Mengapa Smart Records Center dibuat"
              lead="Organisasi teregulasi menghadapi masalah yang sama, apa pun sektornya. Arsip terus bertambah, sementara aturan untuk mengelolanya masih dijalankan dengan tangan."
            />
            <ul className="mt-10 flex max-w-[65ch] flex-col">
              {problems.map((p) => (
                <li key={p.head} className="border-t border-border py-6 last:pb-0">
                  <p className="text-lg font-semibold text-navy">{p.head}</p>
                  <p className="mt-2 leading-relaxed">{p.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[65ch] border-t-2 border-navy pt-6 text-lg leading-relaxed text-navy">
              Karena itu, kami menjadikan tata kelola dan otomasi satu jalur yang sama. Aturan diterapkan pada setiap arsip yang masuk, dan setiap keputusan, baik oleh
              manusia maupun oleh sistem, dicatat sebagai bukti.
            </p>
          </div>
          <div className="min-w-0 lg:sticky lg:top-36 lg:self-start">
            <ProductMock k="evidence" />
            <p className="mt-3 text-[13px] text-muted-foreground">Paket bukti: arsip, metadata, dan potongan log audit yang dapat diverifikasi penerimanya.</p>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <SectionHeading title="Prinsip kami" lead="Empat prinsip ini menentukan cara kami merancang produk dan cara kami berbicara tentangnya." />
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="border-t-2 border-navy pt-5">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="profil">
        <SectionHeading title="Profil perusahaan" lead="Informasi resmi tentang perusahaan yang mengembangkan dan menyelenggarakan Smart Records Center." />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-xl font-bold">Sejarah</h3>
            <div className="mt-4">
              <Placeholder>[DATA ASLI: sejarah singkat perusahaan, tahun berdiri, dan latar belakang pendirian]</Placeholder>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Visi dan misi</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Placeholder>[DATA ASLI: visi resmi perusahaan]</Placeholder>
              <Placeholder>[DATA ASLI: misi resmi perusahaan]</Placeholder>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold">Pimpinan</h3>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-navy/30 bg-mist px-4 text-center text-sm font-medium text-navy"
                >
                  [DATA ASLI: foto resmi]
                </div>
                <p className="mt-4 font-semibold text-navy">[DATA ASLI: nama]</p>
                <p className="mt-1 text-[0.9375rem]">[DATA ASLI: jabatan]</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h3 className="text-xl font-bold">Legalitas dan kantor</h3>
          <dl className="grid gap-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-x-8">
            {legal.map(([k, v]) => (
              <div key={k} className="sm:contents">
                <dt className="text-[0.9375rem] text-muted-foreground">{k}</dt>
                <dd className="mt-1 font-medium text-navy sm:mt-0">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <CtaBand photo={{ src: "/images/analytics-laptop.webp", alt: "Grafik analitik di layar laptop" }} />
    </>
  )
}
