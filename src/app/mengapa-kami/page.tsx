import { ArrowRightIcon, CheckIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { ProductMock } from "@/components/product/mocks"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import type { MockKey } from "@/lib/modules"
import { ogBase } from "@/lib/site"
import { cn } from "@/lib/utils"

const title = "Mengapa Kami"
const description =
  "Mengapa Smart Records Center: tujuh modul tata kelola arsip digital di satu platform, aturan kearsipan Indonesia sejak awal, AI dengan review manusia, dan jejak audit yang dapat diverifikasi."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mengapa-kami" },
  openGraph: { ...ogBase, url: "/mengapa-kami", title, description },
}

type Reason = { title: string; text: string; points: string[]; link: { href: string; label: string }; mock: MockKey }

// Reason 1 is drawn with the full-width platform diagram; the other three sit beside a product screen.
const reasons: Reason[] = [
  {
    title: "Aturan kearsipan Indonesia sejak awal",
    text: "Klasifikasi arsip, JRA, penyusutan, dan berita acara menjadi bagian inti sistem, bukan tambahan yang dirakit di atas aplikasi dokumen umum.",
    points: [
      "Kode klasifikasi hierarkis berdasarkan fungsi, kegiatan, dan transaksi menjadi alamat tetap setiap arsip.",
      "Setiap kode membawa retensi aktif, retensi inaktif, dan nasib akhir: permanen, musnah, atau dinilai kembali.",
      "Penyusutan berjalan lewat batch usulan, persetujuan berjenjang, dan berita acara digital.",
    ],
    link: { href: "/modul/klasifikasi-arsip", label: "Pelajari modul Klasifikasi Arsip" },
    mock: "bcs",
  },
  {
    title: "AI dengan kendali manusia",
    text: "AI bekerja di ketujuh modul: membaca pindaian, mengisi metadata, mengusulkan kode klasifikasi, menandai risiko, dan menyusun draf laporan. Keputusan tetap berada di tangan arsiparis.",
    points: [
      "Setiap usulan menampilkan skor keyakinan dan sumbernya di dokumen, lalu menunggu konfirmasi.",
      "Usulan dengan keyakinan di bawah 0,90 ditandai perlu review.",
      "AI tidak dapat memutuskan pemusnahan, memasang legal hold, atau mengubah hak akses.",
      "Model, versi, skor, dan peninjau tercatat di jejak audit.",
    ],
    link: { href: "/modul#perbandingan", label: "Lihat peran AI di setiap modul" },
    mock: "classify",
  },
  {
    title: "Bukti yang bisa diverifikasi",
    text: "Auditor dapat memeriksa keutuhan jejak audit dan paket bukti secara mandiri, tanpa bergantung pada pernyataan vendor.",
    points: [
      "Log audit bersifat append-only: entri tidak dapat diubah atau dihapus, termasuk oleh administrator.",
      "Setiap entri menyimpan hash entri sebelumnya, sehingga perubahan di tengah rantai langsung terdeteksi.",
      "Paket bukti memuat hash setiap berkas dan dapat diverifikasi penerimanya.",
    ],
    link: { href: "/modul/jejak-audit", label: "Pelajari modul Jejak Audit" },
    mock: "register",
  },
]

type Level = "none" | "partial" | "native"
type Cell = { level: Level; label: string; note: string }
type Row = { need: string; manual: Cell; dms: Cell; src: Cell }

const manual = (note: string, label = "Manual"): Cell => ({ level: "none", label, note })
const partial = (note: string, label = "Sebagian"): Cell => ({ level: "partial", label, note })
const native = (note: string): Cell => ({ level: "native", label: "Bawaan", note })

const comparison: Row[] = [
  {
    need: "Pemisahan data antarorganisasi",
    manual: manual("Folder bersama tanpa batas yang jelas", "Tidak ada"),
    dms: partial("Bergantung pada konfigurasi dan lisensi"),
    src: native("Ruang data dan kunci enkripsi per organisasi"),
  },
  {
    need: "Pencarian isi dan metadata sesuai hak akses",
    manual: manual("Mencari satu per satu di folder"),
    dms: partial("Pencarian teks, filter metadata terbatas"),
    src: native("Teks lengkap, OCR, filter metadata, pencarian makna"),
  },
  {
    need: "Metadata standar (Dublin Core, ISO 23081)",
    manual: manual("Hanya nama berkas dan folder", "Tidak ada"),
    dms: partial("Field bebas, pemetaan standar perlu dibangun"),
    src: native("Skema Dublin Core diperluas dengan validasi field wajib"),
  },
  {
    need: "Klasifikasi arsip per organisasi",
    manual: manual("Struktur folder yang berbeda di tiap unit"),
    dms: partial("Lewat folder atau metadata, perlu kustomisasi"),
    src: native("Taksonomi hierarkis yang dapat dikonfigurasi dan berversi"),
  },
  {
    need: "Retensi otomatis sesuai JRA",
    manual: manual("Dihitung di tabel terpisah dan mudah terlewat"),
    dms: partial("Perlu kustomisasi aturan per jenis dokumen"),
    src: native("Mesin aturan menghitung tanggal dari penutupan berkas"),
  },
  {
    need: "Penyusutan dengan berita acara",
    manual: manual("Daftar usulan dan berita acara disusun terpisah"),
    dms: partial("Alur persetujuan perlu dibangun sendiri"),
    src: native("Batch usulan, persetujuan berjenjang, berita acara digital"),
  },
  {
    need: "Legal hold",
    manual: manual("Bergantung pada ingatan dan catatan terpisah"),
    dms: partial("Perlu kustomisasi"),
    src: native("Arsip dalam hold dikeluarkan dari semua usulan penyusutan"),
  },
  {
    need: "Jejak audit yang dapat diverifikasi",
    manual: manual("Tidak ada jejak yang terpusat", "Tidak ada"),
    dms: partial("Log aktivitas, keutuhannya sulit dibuktikan"),
    src: native("Log append-only berantai hash"),
  },
  {
    need: "Dasbor kepatuhan dan laporan regulator",
    manual: manual("Disusun manual dari banyak tabel"),
    dms: partial("Laporan aktivitas umum"),
    src: native("Indikator yang dapat ditelusuri ke daftar arsipnya"),
  },
  {
    need: "AI dengan review manusia",
    manual: manual("Seluruh pengisian metadata oleh staf", "Tidak ada"),
    dms: partial("Bergantung produk, keputusan AI jarang tercatat"),
    src: native("Usulan dengan skor, dikonfirmasi arsiparis, tercatat di jejak audit"),
  },
]

const columns = [
  { key: "manual", label: "Folder bersama & proses manual" },
  { key: "dms", label: "Aplikasi dokumen umum (DMS)" },
  { key: "src", label: "Smart Records Center" },
] as const

function CompareCell({ cell, highlight }: { cell: Cell; highlight?: boolean }) {
  return (
    <td className={cn("px-4 py-4 align-top", highlight && "bg-brand-wash")}>
      <span className={cn("flex items-center gap-1.5 font-semibold", highlight ? "text-brand" : "text-navy")}>
        {cell.level === "native" && <CheckIcon className="size-4 shrink-0" aria-hidden />}
        {cell.label}
      </span>
      <span className={cn("mt-1 block text-[13.5px] leading-snug", highlight ? "text-navy" : "text-muted-foreground")}>{cell.note}</span>
    </td>
  )
}

const limits = [
  "Penyusunan skema klasifikasi dan JRA tetap tanggung jawab organisasi Anda. Platform menjalankan aturan yang Anda tetapkan.",
  "Smart Records Center bukan aplikasi tata naskah dinas atau persuratan, dan bukan pengganti aplikasi perkantoran.",
  "Regulasi dan standar yang kami sebut adalah rujukan rancangan, bukan klaim sertifikasi.",
]

export default function MengapaKamiPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Mengapa Kami" }]}
        title="Tata kelola arsip yang bisa dibuktikan, bukan sekadar disimpan"
        lead="Smart Records Center dirancang untuk organisasi yang wajib menyimpan, menemukan kembali, menyusutkan, dan membuktikan pengelolaan arsipnya. Berikut empat alasan platform ini berbeda dari folder bersama dan aplikasi dokumen umum."
        photo={{ src: "/images/jakarta-day.webp", alt: "Gedung-gedung perkantoran tinggi di Jakarta di bawah langit biru" }}
      />

      {/* Reason 1: one platform; the structure diagram itself lives on /platform and /modul. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          <SectionHeading
            title="Satu platform untuk seluruh siklus"
            lead="Penyimpanan, pencarian, metadata, klasifikasi, retensi, penyusutan, jejak audit, dan pelaporan berada di satu sistem dengan satu sumber data."
          />
          <div className="flex flex-col justify-end">
            <ul className="flex flex-col gap-3">
              {[
                "Status arsip berpindah dari aktif ke inaktif hingga permanen atau musnah tanpa ekspor ke sistem lain.",
                "Setiap tahap memakai data arsip yang sama, sehingga tidak ada salinan metadata yang saling bertentangan.",
                "Modul dapat diterapkan bertahap, dimulai dari bagian yang paling mendesak bagi organisasi Anda.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/platform" className="mt-6 link-action">
              Pelajari ikhtisar platform <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      {reasons.map((r, i) => {
        const flip = i % 2 === 0
        // The audit log is a wide table whose hash column is the proof, so it gets the full row under its text, as on the home page.
        if (r.mock === "register")
          return (
            <Section key={r.title} tone={flip ? "mist" : "white"}>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
                <SectionHeading title={r.title} lead={r.text} />
                <div>
                  <ul className="flex flex-col gap-3">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                        <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link href={r.link.href} className="mt-8 link-action">
                    {r.link.label} <ArrowRightIcon className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <Reveal className="mt-12 min-w-0">
                <ProductMock k={r.mock} />
              </Reveal>
            </Section>
          )
        return (
          <Section key={r.title} tone={flip ? "mist" : "white"}>
            <div className={cn("grid items-center gap-12 lg:gap-16", flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
              <div className={cn("min-w-0", flip && "lg:order-2")}>
                <SectionHeading title={r.title} lead={r.text} />
                <ul className="mt-8 flex flex-col gap-3">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={r.link.href} className="mt-8 link-action">
                  {r.link.label} <ArrowRightIcon className="size-4" aria-hidden />
                </Link>
              </div>
              <Reveal className={cn("min-w-0", flip && "lg:order-1")}>
                <ProductMock k={r.mock} />
              </Reveal>
            </div>
          </Section>
        )
      })}

      <Section id="perbandingan">
        <SectionHeading
          title="Perbandingan dengan cara kerja yang umum dipakai"
          lead="Kebutuhan kearsipan organisasi teregulasi, dibandingkan dengan folder bersama dan aplikasi dokumen umum. Kami membandingkan kategori solusi, bukan produk tertentu."
        />
        {/* Phones: one card per need, with this platform's answer first so the conclusion never scrolls out of view. */}
        <ul className="mt-10 flex flex-col gap-3 md:hidden">
          {comparison.map((row) => (
            <li key={row.need} className="overflow-hidden rounded-xl border border-border">
              <p className="bg-mist px-4 py-3 font-semibold text-navy">{row.need}</p>
              <dl className="divide-y divide-border text-[0.9375rem]">
                {([["src", row.src], ["manual", row.manual], ["dms", row.dms]] as const).map(([key, cell]) => (
                  <div key={key} className={cn("px-4 py-3", key === "src" && "bg-brand-wash")}>
                    <dt className={cn("text-[13px] font-semibold", key === "src" ? "text-brand" : "text-muted-foreground")}>{columns.find((c) => c.key === key)!.label}</dt>
                    <dd className="mt-1">
                      <span className={cn("flex items-center gap-1.5 font-semibold", key === "src" ? "text-brand" : "text-navy")}>
                        {cell.level === "native" && <CheckIcon className="size-4 shrink-0" aria-hidden />}
                        {cell.label}
                      </span>
                      <span className={cn("mt-0.5 block text-[13.5px] leading-snug", key === "src" ? "text-navy" : "text-muted-foreground")}>{cell.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <div className="mt-12 hidden overflow-x-auto rounded-xl border border-border md:block">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.9375rem]">
            <caption className="sr-only">Perbandingan kemampuan kearsipan antara proses manual, aplikasi dokumen umum, dan Smart Records Center</caption>
            <thead>
              <tr className="border-b border-border bg-mist">
                <th scope="col" className="w-[22%] px-4 py-3 text-sm font-semibold text-navy">
                  Kebutuhan
                </th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={cn("px-4 py-3 text-sm font-semibold text-navy", c.key === "src" && "bg-brand-wash text-brand")}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.need} className="border-b border-border last:border-b-0">
                  <th scope="row" className="px-4 py-4 align-top font-semibold text-navy">
                    {row.need}
                  </th>
                  <CompareCell cell={row.manual} />
                  <CompareCell cell={row.dms} />
                  <CompareCell cell={row.src} highlight />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-muted-foreground">
          Kemampuan aplikasi dokumen umum berbeda antarproduk dan konfigurasi. Kolom tengah menggambarkan kondisi yang lazim tanpa kustomisasi khusus kearsipan.
        </p>

        <div className="mt-16 grid gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h3 className="text-xl font-bold tracking-[-0.01em]">Batas yang perlu Anda ketahui sejak awal</h3>
          <ul className="flex flex-col gap-3">
            {limits.map((l) => (
              <li key={l} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-navy/50" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        photo={{ src: "/images/team-meeting.webp", alt: "Tim kantor berdiskusi di sekitar meja rapat" }}
        title="Lihat sendiri perbedaannya dalam demo"
        lead="Kami jalankan satu seri arsip contoh dari klasifikasi sampai berita acara, lengkap dengan jejak audit yang dapat Anda verifikasi sendiri. Anda tidak perlu mengirim dokumen rahasia."
      />
    </>
  )
}
