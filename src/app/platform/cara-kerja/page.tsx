import { CheckIcon } from "lucide-react"
import type { Metadata } from "next"

import { LifecycleTimeline } from "@/components/lifecycle"
import { ProductMock } from "@/components/product/mocks"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import Link from "next/link"

import { moduleBySlug, type MockKey, type Module } from "@/lib/modules"
import { cn } from "@/lib/utils"
import { ogBase } from "@/lib/site"

const description =
  "Cara kerja Smart Records Center: perjalanan satu arsip dari registrasi, aktif, inaktif, sampai permanen atau musnah, dengan aturan dan bukti di setiap tahap."

export const metadata: Metadata = {
  title: "Cara Kerja: Siklus Hidup Arsip",
  description,
  alternates: { canonical: "/platform/cara-kerja" },
  openGraph: { ...ogBase, url: "/platform/cara-kerja", title: "Cara Kerja: Siklus Hidup Arsip", description },
}

const stages: { name: string; lead: string; who: string; rules: string[]; proof: string; mock: MockKey; modules: Module["slug"][] }[] = [
  {
    name: "Diterima, dilengkapi, dan diklasifikasikan",
    lead: "Arsip masuk dari unggahan, email, pemindai, atau API ke ruang data organisasi. Sistem membuat nomor arsip dan mencatat hash berkas, lalu AI mengisi metadata dan mengusulkan kode klasifikasi.",
    who: "Unit pengolah dan arsiparis",
    rules: ["Berkas lolos pemindaian keamanan sebelum masuk repositori", "Usulan AI menunggu konfirmasi; di bawah 0,90 wajib direview", "Arsip final wajib memiliki metadata wajib dan kode klasifikasi"],
    proof: "Hash berkas, usulan AI beserta skornya, dan siapa yang mengonfirmasi",
    mock: "classify",
    modules: ["repositori-arsip", "manajemen-metadata", "klasifikasi-arsip"],
  },
  {
    name: "Aktif",
    lead: "Arsip dipakai unit pengolah sehari-hari dan ditemukan kembali lewat pencarian. Setelah berkas ditutup, masa retensi aktif mulai dihitung dari JRA.",
    who: "Unit pengolah",
    rules: ["Versi baru boleh ditambahkan selama berkas aktif", "Akses mengikuti peran, unit, dan tingkat keamanan", "Tanggal pindah dihitung sistem, bukan diisi manual"],
    proof: "Riwayat versi, tanggal penutupan, dan log akses",
    mock: "semantic",
    modules: ["pencarian-temu-kembali", "jejak-audit"],
  },
  {
    name: "Inaktif",
    lead: "Pada tanggalnya, arsip berpindah ke pengelolaan unit kearsipan secara otomatis dan menjadi hanya baca.",
    who: "Unit kearsipan",
    rules: ["Perubahan isi ditolak", "Peminjaman memakai izin berbatas waktu", "Daftar jatuh tempo tersedia jauh hari sebelumnya"],
    proof: "Catatan pemindahan dan setiap peminjaman",
    mock: "lifecycle",
    modules: ["retensi-penyusutan", "repositori-arsip"],
  },
  {
    name: "Permanen atau musnah",
    lead: "Saat jatuh tempo, nasib akhir di JRA menentukan langkahnya: arsip permanen disimpan di media write-once dan disiapkan untuk penyerahan, arsip lainnya masuk usulan pemusnahan.",
    who: "Arsiparis, pejabat penyetuju, bagian hukum",
    rules: ["Arsip vital dan arsip dalam legal hold tidak pernah dimusnahkan", "Pengusul dan penyetuju batch harus berbeda", "Berita acara dibuat otomatis"],
    proof: "Paket penyerahan atau berita acara pemusnahan dengan hash setiap berkas",
    mock: "transfer",
    modules: ["retensi-penyusutan", "pelaporan"],
  },
]

const disposal = [
  { name: "Usulan batch", text: "Sistem menyusun arsip yang jatuh tempo menjadi batch usulan." },
  { name: "Cek legal hold", text: "Arsip dalam hold dan arsip vital dikeluarkan otomatis." },
  { name: "Persetujuan", text: "Pejabat yang berwenang menyetujui atau menolak, bukan pengusul." },
  { name: "Eksekusi", text: "Berkas dimusnahkan secara kriptografis; hash tetap disimpan sebagai bukti." },
  { name: "Berita acara", text: "Dokumen resmi dibuat dan disimpan sebagai arsip tersendiri." },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/platform", label: "Platform" }, { label: "Cara Kerja" }]}
        title="Perjalanan satu arsip, dari diterima sampai nasib akhir"
        lead="Setiap tahap punya aturan yang dijaga sistem, modul yang mengerjakannya, dan bukti yang tercatat. Tidak ada tahap yang bergantung pada ingatan seseorang."
        photo={{ src: "/images/laptop-dark.webp", alt: "Laptop menampilkan dasbor bertema gelap" }}
      />

      <Section tone="mist">
        <SectionHeading title="Empat tahap siklus hidup arsip" />
        <LifecycleTimeline className="mt-10" />
      </Section>

      {stages.map((s, i) => (
        <section key={s.name} className={cn("py-16 lg:py-24", i % 2 === 1 && "bg-mist")}>
          <div className={cn("container-page grid items-center gap-10 lg:gap-16", i % 2 === 1 ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <span className="flex size-10 items-center justify-center rounded-full bg-navy font-bold text-white">{i + 1}</span>
              <h2 className="h2 mt-5">{s.name}</h2>
              <p className="lead mt-4 text-body">{s.lead}</p>
              <dl className="mt-6 grid gap-4 text-[0.9375rem]">
                <div>
                  <dt className="font-semibold text-navy">Yang terlibat</dt>
                  <dd className="mt-1">{s.who}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Aturan yang dijaga</dt>
                  <dd>
                    <ul className="mt-2 flex flex-col gap-2">
                      {s.rules.map((r) => (
                        <li key={r} className="flex gap-2.5">
                          <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Bukti yang dicatat</dt>
                  <dd className="mt-1">{s.proof}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Modul yang bekerja</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {s.modules.map((slug) => {
                      const m = moduleBySlug(slug)!
                      return (
                        <Link key={slug} href={`/modul/${slug}`} className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-navy hover:border-brand/40 hover:text-brand">
                          <m.icon className="size-4 text-brand" aria-hidden />
                          {m.name}
                        </Link>
                      )
                    })}
                  </dd>
                </div>
              </dl>
            </div>
            <Reveal className={cn("min-w-0", i % 2 === 1 && "lg:order-1")}>
              <ProductMock k={s.mock} />
            </Reveal>
          </div>
        </section>
      ))}

      <Section tone="mist">
        <SectionHeading
          title="Penyusutan dengan persetujuan berjenjang"
          lead="Pemusnahan adalah keputusan yang tidak bisa dibatalkan. Karena itu setiap langkahnya dijaga dan dicatat."
        />
        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {disposal.map((d, i) => (
            <li key={d.name} className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-bold">
                <span className="text-brand">{i + 1}.</span> {d.name}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{d.text}</p>
            </li>
          ))}
        </ol>
        <Reveal className="mt-10">
          <ProductMock k="disposition" />
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
