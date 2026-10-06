import { ArrowRightIcon, CheckIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { PlatformDiagram } from "@/components/platform-diagram"
import { ProductMock } from "@/components/product/mocks"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { Button } from "@/components/ui/button"
import { modules } from "@/lib/modules"
import { ogBase } from "@/lib/site"
import { cn } from "@/lib/utils"

const description =
  "Tujuh modul Smart Records Center: Repositori Arsip, Pencarian & Temu Kembali, Manajemen Metadata, Klasifikasi Arsip, Retensi & Penyusutan, Jejak Audit, dan Pelaporan."

export const metadata: Metadata = {
  title: "Modul Tata Kelola Arsip Digital",
  description,
  alternates: { canonical: "/modul" },
  openGraph: { ...ogBase, url: "/modul", title: "Modul Tata Kelola Arsip Digital", description },
}

export default function ModulesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Modul" }]}
        title="Tujuh modul untuk tata kelola arsip digital"
        lead="Setiap modul menangani satu tanggung jawab dan berbagi data yang sama. Organisasi dapat memulai dari modul yang paling mendesak, lalu menambah modul lain secara bertahap."
        actions={
          <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-primary-cta>
            <Button size="lg" render={<Link href="/kontak" />} nativeButton={false}>
              Minta Demo
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#perbandingan" />} nativeButton={false}>
              Bandingkan Modul
            </Button>
          </div>
        }
        visual={<ModuleIndex />}
      />

      <Section>
        <SectionHeading
          title="Bagaimana ketujuh modul saling terhubung"
          lead="Arsip melewati tiga lapisan: diterima dan ditata, dipakai dan dijaga, lalu dibuktikan. Ketujuh modul berdiri di atas satu sumber data."
        />
        <Reveal className="mt-12">
          <PlatformDiagram />
        </Reveal>
      </Section>

      <Section tone="mist" id="perbandingan">
        <SectionHeading title="Perbandingan modul" lead="Fungsi utama dan peran AI setiap modul dalam satu tabel." />
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-white">
          <div aria-hidden className="hidden grid-cols-[15rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-border bg-mist px-5 py-3 text-sm font-semibold text-navy lg:grid">
            <span>Modul</span>
            <span>Fungsi utama</span>
            <span>Peran AI</span>
          </div>
          <ul>
            {modules.map((m) => (
              <li key={m.slug} className="grid gap-3 border-b border-border px-5 py-5 last:border-b-0 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
                <Link href={`#${m.slug}`} className="inline-flex items-start gap-2.5 font-semibold text-navy hover:text-brand hover:underline">
                  <m.icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  {m.name}
                </Link>
                <p className="text-[0.9375rem] leading-relaxed">
                  <span className="font-semibold text-navy lg:sr-only">Fungsi utama: </span>
                  {m.short}
                </p>
                <p className="text-[0.9375rem] leading-relaxed">
                  <span className="font-semibold text-navy lg:sr-only">Peran AI: </span>
                  {m.ai}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {modules.map((m, i) => (
        <section key={m.slug} id={m.slug} className={cn("scroll-mt-32 py-16 lg:py-24", i % 2 === 1 && "bg-mist")}>
          <div className={cn("container-page grid items-center gap-10 lg:gap-16", i % 2 === 1 ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <span className="flex size-12 items-center justify-center rounded-lg bg-brand text-white">
                <m.icon className="size-6" aria-hidden />
              </span>
              <h2 className="h2 mt-6">{m.name}</h2>
              <p className="lead mt-4 text-body">{m.lead}</p>
              <ul className="mt-6 grid gap-2 text-[0.9375rem]">
                {m.features.map((f) => (
                  <li key={f.id} className="flex gap-2.5">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    <Link href={`/modul/${m.slug}#${f.id}`} className="text-navy hover:text-brand hover:underline">
                      {f.name}
                      {f.ai && <span className="ml-2 inline-flex h-5 items-center rounded-[5px] bg-brand-wash px-1.5 align-middle text-[11px] font-semibold text-brand-ink">AI</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/modul/${m.slug}`} className="link-action mt-7">
                Pelajari modul {m.name} <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </div>
            <Reveal className={cn("min-w-0", i % 2 === 1 && "lg:order-1")}>
              <ProductMock k={m.heroMock} />
            </Reveal>
          </div>
        </section>
      ))}

      <CtaBand photo={{ src: "/images/analytics-laptop.webp", alt: "Grafik analitik di layar laptop" }} />
    </>
  )
}

/** Hero index for this page: every module once, each jumping to its section below. */
function ModuleIndex() {
  return (
    <nav aria-label="Daftar modul" className="rounded-xl border border-border bg-white p-2 shadow-product">
      <ul className="grid gap-1 sm:grid-cols-2">
        {modules.map((m) => (
          <li key={m.slug}>
            <Link href={`#${m.slug}`} className="group flex items-center gap-3 rounded-lg p-3 hover:bg-mist">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-wash text-brand">
                <m.icon className="size-5" aria-hidden />
              </span>
              <span className="font-heading font-bold text-navy group-hover:text-brand">{m.name}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link href="#perbandingan" className="flex h-full min-h-16 items-center gap-2 rounded-lg p-3 text-sm font-semibold text-brand hover:bg-mist hover:underline">
            Lihat tabel perbandingan
          </Link>
        </li>
      </ul>
    </nav>
  )
}
