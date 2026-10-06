import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { PlatformDiagram } from "@/components/platform-diagram"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { moduleBySlug, type Module } from "@/lib/modules"
import { ogBase, platformNav, references } from "@/lib/site"

const description =
  "Ikhtisar Smart Records Center: tujuh modul tata kelola arsip digital di atas satu sumber data, dari repositori, pencarian, metadata, dan klasifikasi sampai retensi, jejak audit, dan pelaporan."

export const metadata: Metadata = {
  title: "Ikhtisar Platform",
  description,
  alternates: { canonical: "/platform" },
  openGraph: { ...ogBase, url: "/platform", title: "Ikhtisar Platform", description },
}

const flow: { slug: Module["slug"]; name: string; text: string }[] = [
  { slug: "repositori-arsip", name: "Diterima", text: "Arsip masuk dari unggahan, email, pemindai, atau API ke ruang data organisasi. Nomor arsip dibuat dan hash berkas dicatat." },
  { slug: "manajemen-metadata", name: "Dilengkapi", text: "AI mengisi metadata dari isi dokumen, lalu field wajib divalidasi terhadap skema Dublin Core yang diperluas." },
  { slug: "klasifikasi-arsip", name: "Diklasifikasikan", text: "Kode klasifikasi dikonfirmasi arsiparis dan membawa retensi, tingkat keamanan, serta hak akses." },
  { slug: "pencarian-temu-kembali", name: "Ditemukan kembali", text: "Isi dan metadata diindeks. Pengguna menemukan arsip dengan kata kunci, filter, atau kalimat biasa, sesuai hak aksesnya." },
  { slug: "retensi-penyusutan", name: "Diretensi dan disusutkan", text: "Mesin aturan memindahkan arsip ke inaktif dan menyusun usulan penyusutan yang menunggu persetujuan berjenjang." },
  { slug: "jejak-audit", name: "Dibuktikan", text: "Setiap langkah masuk log audit berantai hash, lalu dirangkum di dasbor kepatuhan dan laporan berkala." },
]

const vocab = [
  { term: "Klasifikasi arsip", text: "Kode berdasarkan fungsi, kegiatan, dan transaksi organisasi menjadi alamat tetap setiap arsip." },
  { term: "JRA", text: "Jadwal retensi arsip menentukan masa aktif, masa inaktif, dan nasib akhir." },
  { term: "Penyusutan", text: "Pemindahan, pemusnahan, dan penyerahan arsip melalui batch yang disetujui." },
  { term: "Berita acara", text: "Dibuat otomatis untuk setiap batch pemusnahan, lengkap dengan hash berkas." },
  { term: "Arsip vital", text: "Ditandai terpisah dan tidak pernah masuk usulan pemusnahan." },
  { term: "Tingkat keamanan", text: "Biasa, Terbatas, Rahasia, dan Sangat Rahasia menyaring akses dan pencarian." },
]

export default function PlatformPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/platform", label: "Platform" }, { label: "Ikhtisar" }]}
        title="Satu platform untuk seluruh tata kelola arsip digital"
        lead="Tujuh modul bekerja di atas satu sumber data: arsip, metadata, aturan retensi, hak akses, dan log audit yang sama. Tidak ada lagi arsip yang dikelola di luar aturan."
        photo={{ src: "/images/team-meeting.webp", alt: "Tim kantor berdiskusi di sekitar meja rapat" }}
      />

      <Section>
        <SectionHeading title="Struktur platform" lead="Tujuh modul dalam tiga lapisan. Pilih salah satu untuk melihat layar kerjanya." />
        <Reveal className="mt-12">
          <PlatformDiagram />
        </Reveal>
      </Section>

      <Section tone="mist">
        <SectionHeading title="Perjalanan satu arsip melalui platform" lead="Urutan ini berlaku untuk setiap arsip, dari hari pertama sampai nasib akhirnya." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {flow.map((s, i) => {
            const m = moduleBySlug(s.slug)!
            return (
              <li key={s.name} className="flex flex-col bg-white p-6">
                <span className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                  <m.icon className="size-5 text-brand" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed">{s.text}</p>
                <Link href={`/modul/${m.slug}`} className="link-action mt-4 text-sm">
                  Modul {m.name}
                </Link>
              </li>
            )
          })}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              title="Berbahasa kearsipan Indonesia"
              lead="Istilah yang dipakai arsiparis sehari-hari menjadi bagian inti sistem, bukan kolom tambahan di aplikasi dokumen umum."
            />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {references.map((r) => (
                <li key={r.code} className="flex items-baseline gap-4 py-3">
                  <span className="w-28 shrink-0 font-heading font-bold text-navy">{r.code}</span>
                  <span className="text-[0.9375rem] text-body">{r.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] text-muted-foreground">Referensi rancangan, bukan klaim sertifikasi.</p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {vocab.map((v) => (
              <div key={v.term} className="border-t-2 border-navy pt-4">
                <dt className="font-heading text-lg font-bold text-navy">{v.term}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading title="Pelajari lebih dalam" />
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {platformNav.slice(1).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-center justify-between gap-6 py-6">
                <span>
                  <span className="font-heading text-xl font-bold text-navy group-hover:text-brand">{l.label}</span>
                  <span className="mt-1 block text-[0.9375rem] text-body">{l.desc}</span>
                </span>
                <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand photo={{ src: "/images/office-discussion.webp", alt: "Dua rekan kerja berdiskusi di kantor" }} />
    </>
  )
}
