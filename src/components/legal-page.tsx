import { ChevronDownIcon } from "lucide-react"

import { PageHero } from "@/components/section"
import { site } from "@/lib/site"

export type LegalSection = { id: string; title: string; body: React.ReactNode }

/** Numbered legal document: effective date, table of contents (side column on desktop, collapsible on mobile), 70ch reading column. */
export function LegalPage({ crumb, title, lead, sections }: { crumb: string; title: string; lead: string; sections: LegalSection[] }) {
  const toc = (
    <ol className="flex flex-col border-l border-border text-[0.9375rem]">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="-ml-px flex min-h-9 items-baseline gap-2 border-l-2 border-transparent py-1.5 pl-4 text-body hover:border-brand hover:text-navy">
            <span className="w-5 shrink-0 text-muted-foreground tabular-nums">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <PageHero crumbs={[{ label: crumb }]} title={title} lead={lead} actions={false} />

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <nav aria-label="Daftar isi" className="hidden lg:sticky lg:top-32 lg:block lg:max-h-[calc(100dvh-10rem)] lg:self-start lg:overflow-y-auto">
          <p className="mb-3 text-sm font-semibold text-navy">Daftar isi</p>
          {toc}
        </nav>

        <article className="min-w-0 max-w-[70ch]">
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Tanggal berlaku:</dt>
              <dd className="font-medium text-navy">6 Oktober 2026</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Penyelenggara:</dt>
              <dd className="font-medium text-navy">{site.entity}</dd>
            </div>
          </dl>

          <details className="group mt-8 rounded-lg border border-border lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-semibold text-navy [&::-webkit-details-marker]:hidden">
              Daftar isi
              <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <nav aria-label="Daftar isi" className="px-4 pb-4">
              {toc}
            </nav>
          </details>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-judul`} className="mt-12 border-t border-border pt-10 first-of-type:mt-10">
              <h2 id={`${s.id}-judul`} className="text-2xl leading-tight font-bold tracking-[-0.02em]">
                <span className="tabular-nums">{i + 1}.</span> {s.title}
              </h2>
              <div className="mt-4 leading-relaxed [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:hover:text-navy [&_li]:mt-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:pl-5 [&>*+*]:mt-4">
                {s.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  )
}
