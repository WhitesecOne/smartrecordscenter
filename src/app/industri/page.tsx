import { ArrowDownIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { ProductMock } from "@/components/product/mocks"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { moduleBySlug, type MockKey, type Module } from "@/lib/modules"
import { ogBase, sectors as sectorMeta } from "@/lib/site"
import { cn } from "@/lib/utils"

const title = "Solusi per Industri"
const description =
  "Tata kelola arsip digital untuk instansi pemerintah, BUMN dan BUMD, perbankan dan keuangan, serta korporasi: klasifikasi, retensi dan penyusutan, pencarian, jejak audit, dan pelaporan."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/industri" },
  openGraph: { ...ogBase, url: "/industri", title, description },
}

type Help = { slug: Module["slug"]; id: string; text: string }
type Sector = { id: string; name: string; lead: string; needs: string[]; help: Help[]; mock: MockKey }

const sectors: Sector[] = [
  {
    id: "pemerintah",
    name: "Instansi Pemerintah",
    lead: "Arsip dinamis instansi dikelola menurut klasifikasi arsip dan JRA yang ditetapkan, lalu disusutkan lewat persetujuan pejabat berwenang dengan berita acara.",
    needs: [
      "Klasifikasi arsip dan JRA instansi diterapkan seragam di semua unit pengolah.",
      "Penyusutan memerlukan daftar usulan, persetujuan pejabat berwenang, dan berita acara.",
      "Arsip vital dan arsip bernilai guna permanen terlindung dari pemusnahan.",
      "Akses dibatasi menurut tingkat keamanan arsip: Biasa, Terbatas, Rahasia, dan Sangat Rahasia.",
    ],
    help: [
      { slug: "retensi-penyusutan", id: "mesin-aturan", text: "Tanggal pindah ke inaktif dan jatuh tempo dihitung dari penutupan berkas, sehingga daftar arsip yang akan jatuh tempo tersedia jauh hari." },
      { slug: "retensi-penyusutan", id: "alur-penyusutan", text: "Arsip jatuh tempo tersusun menjadi batch usulan. Pengusul dan penyetuju harus orang yang berbeda, dan berita acara digital memuat hash setiap berkas." },
      { slug: "retensi-penyusutan", id: "penyerahan", text: "Arsip bernilai guna permanen disiapkan dalam paket penyerahan ke lembaga kearsipan, lengkap dengan daftar arsip, metadata, dan hash berkas." },
      { slug: "repositori-arsip", id: "keutuhan", text: "Keutuhan arsip permanen diperiksa secara terjadwal dengan SHA-256 dan disimpan di media write-once." },
    ],
    mock: "disposition",
  },
  {
    id: "bumn",
    name: "BUMN & BUMD",
    lead: "Perusahaan milik negara dan daerah mengelola arsip korporasi sekaligus arsip penugasan pemerintah, sering tersebar di banyak unit, cabang, dan anak perusahaan.",
    needs: [
      "Arsip dari banyak unit dan cabang memerlukan satu pola penomoran dan satu skema klasifikasi.",
      "Arsip korporasi dan arsip penugasan pemerintah dapat memiliki aturan retensi yang berbeda.",
      "Anak perusahaan perlu ruang data sendiri, tetapi induk tetap memerlukan laporan kepatuhan gabungan.",
      "Pemeriksaan internal dan eksternal meminta bukti siapa membuat, meminjam, atau memusnahkan arsip.",
      "Arsip inaktif dipindahkan ke unit kearsipan tepat waktu, bukan menunggu ruang penyimpanan penuh.",
    ],
    help: [
      { slug: "repositori-arsip", id: "pemisahan-organisasi", text: "Induk dan anak perusahaan dapat dikelola sebagai organisasi terpisah di satu platform, masing-masing dengan data, pengguna, dan kunci enkripsinya sendiri." },
      { slug: "klasifikasi-arsip", id: "taksonomi", text: "Kode klasifikasi hierarkis mengikuti klasifikasi arsip organisasi Anda, dan setiap kode membawa aturan retensinya sendiri." },
      { slug: "repositori-arsip", id: "status", text: "Arsip berpindah dari aktif ke inaktif pada tanggal hasil hitungan. Arsip inaktif hanya bisa dibaca, dan peminjamannya dicatat." },
      { slug: "jejak-audit", id: "log-immutable", text: "Setiap aksi pada arsip tercatat di log audit berantai hash yang tidak dapat diubah, termasuk oleh administrator." },
    ],
    mock: "tenants",
  },
  {
    id: "keuangan",
    name: "Perbankan & Keuangan",
    lead: "Lembaga keuangan menyimpan dokumen nasabah, kredit, dan transaksi dalam jumlah besar, dengan kewajiban retensi dari regulator sektor dan kewajiban pelindungan data pribadi.",
    needs: [
      "Retensi dokumen nasabah dan transaksi mengikuti ketentuan regulator sektor dan kebijakan internal.",
      "Dokumen memuat NIK, NPWP, dan nomor rekening yang wajib dilindungi sesuai UU 27/2022.",
      "Pemeriksaan regulator dan auditor meminta bukti yang dapat diperiksa di luar sistem.",
      "Arsip yang terkait sengketa atau pemeriksaan tidak boleh ikut dimusnahkan.",
    ],
    help: [
      { slug: "retensi-penyusutan", id: "deteksi-risiko", text: "AI menandai NIK, NPWP, dan nomor rekening, yang selalu ditampilkan tersamar. Arsip bertanda risiko ditahan dari penyusutan sampai direview." },
      { slug: "pencarian-temu-kembali", id: "hak-akses", text: "Hasil pencarian disaring hak akses sebelum ditampilkan, dan pencarian atas arsip rahasia tercatat di jejak audit." },
      { slug: "jejak-audit", id: "paket-bukti", text: "Arsip, metadata, riwayat, dan potongan log diekspor dalam satu paket yang keutuhannya dapat diverifikasi penerima." },
      { slug: "pelaporan", id: "laporan-regulator", text: "Laporan berkala untuk regulator dan pemeriksa disusun dari data yang sama, lengkap dengan hash dan tanggal pembuatan." },
    ],
    mock: "risk",
  },
  {
    id: "korporasi",
    name: "Korporasi",
    lead: "Perusahaan besar mengelola kontrak, dokumen SDM, dan keuangan di banyak divisi. Tanpa aturan bersama, dokumen penting tersimpan di folder bersama dan kotak surat pribadi.",
    needs: [
      "Kontrak, dokumen SDM, dan keuangan tersebar di folder bersama, email, dan aplikasi unit.",
      "Dokumen SDM dan keuangan hanya boleh dibuka oleh unit dan peran tertentu.",
      "Masa simpan berbeda per jenis dokumen dan sering terlewat karena dihitung manual.",
      "Salinan ganda dari pindaian ulang dan lampiran email menyulitkan pencarian versi yang benar.",
    ],
    help: [
      { slug: "pencarian-temu-kembali", id: "pencarian-makna", text: "Karyawan mencari dengan kalimat biasa, misalnya kontrak yang habis tahun ini, dan hanya melihat arsip yang boleh mereka buka." },
      { slug: "klasifikasi-arsip", id: "usulan-ai", text: "AI mengusulkan kode klasifikasi dari isi dokumen. Usulan berlaku setelah dikonfirmasi arsiparis." },
      { slug: "repositori-arsip", id: "duplikat", text: "Berkas identik dan yang hampir sama ditautkan, tidak pernah dihapus otomatis. Arsiparis memilih arsip utama." },
      { slug: "retensi-penyusutan", id: "mesin-aturan", text: "Setiap jenis dokumen membawa masa retensi dan nasib akhirnya sendiri, sehingga jatuh tempo tidak lagi bergantung pada ingatan." },
    ],
    mock: "semantic",
  },
]

/** Resolves a module feature from modules.ts, so a renamed or removed feature fails loudly instead of shipping a dead link. */
function feature({ slug, id }: Help) {
  const m = moduleBySlug(slug)
  const f = m?.features.find((x) => x.id === id)
  if (!m || !f) throw new Error(`Fitur modul tidak ditemukan: ${slug}#${id}`)
  return { href: `/modul/${slug}#${id}`, name: f.name, module: m.name }
}

const photoOf = (id: string) => sectorMeta.find((x) => x.id === id)!.photo

export default function IndustriPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industri" }]}
        title="Satu tata kelola arsip, disesuaikan dengan kewajiban sektor Anda"
        lead="Instansi pemerintah, BUMN, lembaga keuangan, dan korporasi memiliki kewajiban kearsipan yang berbeda. Smart Records Center menjalankan aturan dasar yang sama pada setiap arsip, lalu menyesuaikan klasifikasi, retensi, dan hak aksesnya dengan kebutuhan sektor Anda."
        photo={{ src: "/images/jakarta-aerial.webp", alt: "Pemandangan Jakarta dari ketinggian dengan gedung perkantoran di kejauhan" }}
      />

      <nav aria-label="Pilih industri" className="border-b border-border bg-white">
        <ul className="container-page grid grid-cols-2 md:grid-cols-4">
          {sectors.map((s) => (
            <li key={s.id} className="border-border odd:border-r [&:nth-child(-n+2)]:border-b md:border-r md:last:border-r-0 md:[&:nth-child(-n+2)]:border-b-0">
              <a
                href={`#${s.id}`}
                className="flex min-h-14 items-center justify-between gap-2 px-3 py-3 text-[0.9375rem] font-semibold text-navy hover:bg-mist hover:text-brand sm:px-5"
              >
                {s.name}
                <ArrowDownIcon className="size-4 shrink-0 text-brand" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sectors.map((s, i) => {
        const flip = i % 2 === 1
        const text = flip ? "lg:col-start-2" : "lg:col-start-1"
        const visual = flip ? "lg:col-start-1" : "lg:col-start-2"
        return (
          <Section key={s.id} id={s.id} tone={flip ? "mist" : "white"}>
            <div
              className={cn(
                "grid gap-x-16 gap-y-10 lg:gap-y-16",
                flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
              )}
            >
              <div className={cn("min-w-0 lg:row-start-1", text)}>
                <SectionHeading title={s.name} lead={s.lead} />
                <h3 className="mt-10 text-lg font-bold">Kebutuhan khas sektor</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {s.needs.map((n) => (
                    <li key={n} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-navy/50" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={cn("relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl lg:row-start-1 lg:aspect-auto lg:min-h-80", visual)}>
                <Image src={photoOf(s.id).src} alt={photoOf(s.id).alt} fill sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>

              <div className={cn("min-w-0 lg:row-start-2", text)}>
                <h3 className="text-lg font-bold">Bagaimana Smart Records Center membantu</h3>
                <ul className="mt-2">
                  {s.help.map((h) => {
                    const f = feature(h)
                    return (
                      <li key={f.href} className="border-b border-border py-4 last:border-b-0">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <Link href={f.href} className="font-semibold text-brand underline-offset-4 hover:text-brand-ink hover:underline">
                            {f.name}
                          </Link>
                          <span className="text-[13px] text-muted-foreground">Modul {f.module}</span>
                        </p>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed">{h.text}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <Reveal className={cn("min-w-0 lg:row-start-2 lg:self-center", visual)}>
                <ProductMock k={s.mock} />
              </Reveal>
            </div>
          </Section>
        )
      })}

      <CtaBand
        photo={{ src: "/images/glass-dusk.webp", alt: "Fasad gedung kaca saat senja" }}
        title="Bahas kebutuhan kearsipan sektor Anda"
        lead="Kami tunjukkan bagaimana satu seri arsip dari sektor Anda diklasifikasikan, diberi retensi dan hak akses, lalu dicatat jejak auditnya. Anda tidak perlu mengirim dokumen rahasia."
      />
    </>
  )
}
