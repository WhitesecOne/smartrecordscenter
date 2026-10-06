import { ArrowRightIcon, CheckIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductMock } from "@/components/product/mocks"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { moduleBySlug, modules, type Feature, type Photo } from "@/lib/modules"
import { ogBase } from "@/lib/site"
import { cn } from "@/lib/utils"

export const dynamicParams = false

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: PageProps<"/modul/[slug]">): Promise<Metadata> {
  const m = moduleBySlug((await params).slug)
  if (!m) return {}
  const title = `Modul ${m.name}`
  return {
    title,
    description: m.metaDescription,
    alternates: { canonical: `/modul/${m.slug}` },
    openGraph: {
      ...ogBase,
      url: `/modul/${m.slug}`,
      title,
      description: m.metaDescription,
    },
  }
}

// Digital infrastructure only, no people: each module page takes the next one in turn.
const ctaPhotos: Photo[] = [
  { src: "/images/laptop-dashboard.webp", alt: "Laptop menampilkan dasbor data" },
  { src: "/images/server-drives.webp", alt: "Deretan unit penyimpanan server dengan lampu indikator" },
  { src: "/images/laptop-dark.webp", alt: "Laptop menampilkan dasbor bertema gelap" },
  { src: "/images/network-cables.webp", alt: "Kabel jaringan tertata di rak server" },
  { src: "/images/data-center.webp", alt: "Lorong ruang server di pusat data" },
  { src: "/images/server-racks.webp", alt: "Rak server berisi perangkat penyimpanan" },
  { src: "/images/analytics-laptop.webp", alt: "Grafik analitik di layar laptop" },
]

const AiLabel = () => <span className="inline-flex h-6 items-center rounded-[5px] bg-brand-wash px-2 text-xs font-semibold text-brand-ink">Dibantu AI</span>

export default async function ModulePage({ params }: PageProps<"/modul/[slug]">) {
  const m = moduleBySlug((await params).slug)
  if (!m) notFound()
  const related = m.related.map((s) => moduleBySlug(s)!)
  const ctaPhoto = ctaPhotos[modules.indexOf(m) % ctaPhotos.length]

  return (
    <>
      <PageHero crumbs={[{ href: "/modul", label: "Modul" }, { label: m.name }]} title={m.title} lead={m.lead} tone="navy" visual={<ProductMock k={m.heroMock} />} />

      <nav aria-label={`Bagian modul ${m.name}`} className="sticky top-16 z-20 border-b border-border bg-white/95 lg:top-[6.75rem]">
        <div className="container-page">
          <ul className="-mx-1 flex gap-1 overflow-x-auto py-2 text-sm font-semibold whitespace-nowrap">
            {[{ id: "ringkasan", name: "Ringkasan" }, ...m.features, { id: "aturan", name: "Aturan & bukti" }].map((f) => (
              <li key={f.id}>
                <a href={`#${f.id}`} className="inline-flex min-h-10 items-center rounded-md px-3 text-body hover:bg-mist hover:text-navy">
                  {f.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <Section id="ringkasan" className="scroll-mt-40">
        <div>
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <span className="flex size-12 items-center justify-center rounded-lg bg-brand text-white">
                <m.icon className="size-6" aria-hidden />
              </span>
              <h2 className="h2 mt-6">{m.name}</h2>
              <p className="lead mt-4 text-body">{m.short}</p>
            </div>
            <div>
              <ul className="divide-y divide-border border-y border-border">
                {m.features.map((f) => (
                  <li key={f.id}>
                    <a href={`#${f.id}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="flex items-center gap-3 font-semibold text-navy group-hover:text-brand">
                        <CheckIcon className="size-4 shrink-0 text-brand" aria-hidden />
                        {f.name}
                      </span>
                      {f.ai && <AiLabel />}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-8 rounded-lg border border-brand/20 bg-brand-wash/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-navy">
                <span className="font-semibold text-brand-ink">Peran AI: </span>
                {m.ai} Usulan baru berlaku setelah dikonfirmasi petugas yang berwenang.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* The hero screen is shown once in the overview; a feature that points at it shows its points instead. */}
      {m.features.map((f, i) => (
        <FeatureSection key={f.id} f={f} tone={i % 2 === 0 ? "mist" : "white"} flip={i % 2 === 1} inHero={f.mock === m.heroMock} />
      ))}

      <Section id="aturan" className="scroll-mt-40">
        <SectionHeading
          title="Aturan yang ditegakkan dan bukti yang dicatat"
          lead="Setiap bagian modul menjaga satu aturan dan meninggalkan satu jejak. Tabel ini yang biasanya diminta tim kepatuhan dan auditor."
        />
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="bg-mist">
                {["Bagian", "Fungsi", "Aturan yang ditegakkan", "Bukti yang dicatat"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 text-sm font-semibold text-navy">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.rules.map((r) => (
                <tr key={r.part} className="border-t border-border align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-navy">
                    {r.part}
                  </th>
                  <td className="px-5 py-4">{r.does}</td>
                  <td className="px-5 py-4 font-medium text-navy">{r.rule}</td>
                  <td className="px-5 py-4">{r.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading title="Bekerja bersama modul lain" lead="Modul ini memakai arsip, aturan, dan jejak audit yang sama dengan modul berikut." />
          <ul className="divide-y divide-border border-y border-border">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/modul/${r.slug}`} className="group flex items-center gap-5 py-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white text-brand ring-1 ring-border">
                    <r.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading text-xl font-bold text-navy group-hover:text-brand">{r.name}</span>
                    <span className="mt-1 block text-[0.9375rem] text-body">{r.short}</span>
                  </span>
                  <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand title={`Lihat modul ${m.name} bekerja pada arsip Anda`} photo={ctaPhoto} />
    </>
  )
}

function FeatureSection({ f, tone, flip, inHero }: { f: Feature; tone: "mist" | "white"; flip: boolean; inHero: boolean }) {
  // The audit log's hash column is its proof; that screen needs the full row, not the 7/12 column.
  if (f.mock === "register")
    return (
      <section id={f.id} className={cn("scroll-mt-40 py-16 lg:py-24", tone === "mist" && "bg-mist")}>
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="h2">{f.name}</h2>
              <p className="lead mt-5 text-body">{f.desc}</p>
            </div>
            <ul className="flex flex-col gap-3 lg:pt-2">
              {f.points.map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="mt-12 min-w-0">
            <ProductMock k={f.mock} />
          </Reveal>
        </div>
      </section>
    )
  const text = (
    <div>
      <h2 className="h2">{f.name}</h2>
      <p className="lead mt-5 text-body">{f.desc}</p>
      {f.ai && (
        <p className="mt-5 flex flex-wrap items-center gap-2.5 text-[0.9375rem] text-navy">
          <AiLabel /> Usulan AI berlaku setelah dikonfirmasi petugas.
        </p>
      )}
    </div>
  )
  return (
    <section id={f.id} className={cn("scroll-mt-40 py-16 lg:py-24", tone === "mist" && "bg-mist")}>
      <div className="container-page">
        {inHero ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            {text}
            <ul className="self-start divide-y divide-border rounded-xl border border-border bg-white">
              {f.points.map((p) => (
                <li key={p} className="flex gap-3 px-6 py-4 text-[0.9375rem] leading-relaxed">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={cn("grid items-center gap-10 lg:gap-16", flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
            <div className={cn(flip && "lg:order-2")}>
              {text}
              <ul className="mt-8 flex flex-col gap-3">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <Reveal className={cn("min-w-0", flip && "lg:order-1")}>
              <ProductMock k={f.mock} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
