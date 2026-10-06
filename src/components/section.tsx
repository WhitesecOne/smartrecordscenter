import { ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import type { Photo } from "@/lib/modules"
import { breadcrumbGraph } from "@/lib/seo"
import { cn } from "@/lib/utils"

export function Section({
  id,
  tone = "white",
  className,
  children,
}: {
  id?: string
  tone?: "white" | "mist"
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("py-20 lg:py-28", tone === "mist" && "bg-mist", className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export function SectionHeading({
  title,
  lead,
  align = "left",
  className,
  inverse,
  as: H = "h2",
}: {
  title: React.ReactNode
  lead?: React.ReactNode
  align?: "left" | "center"
  className?: string
  inverse?: boolean
  as?: "h2" | "h3"
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <H className={cn("h2", inverse && "text-white")}>{title}</H>
      {lead && <p className={cn("lead mt-5", inverse ? "text-white/80" : "text-body", align === "center" && "mx-auto")}>{lead}</p>}
    </div>
  )
}

export type Crumb = { href?: string; label: string }

export function Breadcrumb({ items, inverse }: { items: Crumb[]; inverse?: boolean }) {
  const link = inverse ? "hover:text-white hover:underline" : "hover:text-navy hover:underline"
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", inverse ? "text-white/70" : "text-muted-foreground")}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className={link}>
            Beranda
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3.5" aria-hidden />
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className={link}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("font-medium", inverse ? "text-white" : "text-navy")}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function HeroActions({ inverse }: { inverse?: boolean }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-primary-cta>
      <Button size="lg" render={<Link href="/kontak" />} nativeButton={false}>
        Minta Demo
      </Button>
      <Button size="lg" variant={inverse ? "outline-inverse" : "outline"} render={<Link href="/modul" />} nativeButton={false}>
        Lihat Tujuh Modul
      </Button>
    </div>
  )
}

/**
 * Inner-page opening. With a photo it is a navy-veiled photographic banner (the corporate register of the site);
 * without one it is a calm mist band that can carry a product visual on the right.
 */
export function PageHero({
  crumbs,
  title,
  lead,
  photo,
  visual,
  tone = "mist",
  actions = true,
  className,
  children,
}: {
  crumbs: Crumb[]
  title: React.ReactNode
  lead: React.ReactNode
  photo?: Photo
  visual?: React.ReactNode
  /** Without a photo: "mist" for reading pages, "navy" for pages whose visual is a product screen. */
  tone?: "mist" | "navy"
  actions?: boolean | React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  if (photo) {
    return (
      <section className={cn("relative isolate overflow-hidden bg-navy text-white", className)}>
        <JsonLd data={breadcrumbGraph(crumbs)} />
        <Image src={photo.src} alt={photo.alt} fill preload sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden className="veil-left absolute inset-0 -z-10" />
        <div className="container-page flex min-h-[26rem] flex-col justify-end pt-36 pb-12 md:pt-14 md:pb-14 lg:min-h-[30rem] lg:pb-20">
          <div className="max-w-3xl">
            <Breadcrumb items={crumbs} inverse />
            <h1 className="display mt-6 text-[clamp(2.25rem,4.4vw,3.5rem)] text-white">{title}</h1>
            <p className="lead mt-6 max-w-[62ch] text-white/85">{lead}</p>
            {actions === true ? <HeroActions inverse /> : actions}
          </div>
          {children}
        </div>
      </section>
    )
  }
  const navy = tone === "navy"
  return (
    <section className={cn("relative overflow-hidden", navy ? "bg-navy text-white" : "border-b border-border bg-mist", className)}>
      <JsonLd data={breadcrumbGraph(crumbs)} />
      <div className={cn("container-page grid grid-cols-[minmax(0,1fr)] gap-12 py-14 lg:py-20", visual && "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center")}>
        <div>
          <Breadcrumb items={crumbs} inverse={navy} />
          <h1 className={cn("display mt-6 text-[clamp(2.25rem,4.4vw,3.5rem)]", navy && "text-white")}>{title}</h1>
          <p className={cn("lead mt-6 max-w-[60ch]", navy ? "text-white/85" : "text-body")}>{lead}</p>
          {actions === true ? <HeroActions inverse={navy} /> : actions}
        </div>
        {visual && <div className="min-w-0">{visual}</div>}
      </div>
    </section>
  )
}

const ctaDefaultPhoto: Photo = { src: "/images/laptop-dashboard.webp", alt: "Laptop menampilkan dasbor data" }

export function CtaBand({
  title = "Lihat bagaimana arsip organisasi Anda dikelola di Smart Records Center",
  lead = "Dalam sesi demo, kami tunjukkan satu seri arsip Anda diklasifikasikan, diberi retensi, dicari, dan dicatat jejak auditnya. Anda tidak perlu mengirim dokumen rahasia.",
  photo = ctaDefaultPhoto,
}: {
  title?: string
  lead?: string
  photo?: Photo
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-2xl bg-navy text-white lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <h2 className="h2 max-w-2xl text-white">{title}</h2>
            <p className="lead mt-5 max-w-[56ch] text-white/80">{lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-primary-cta>
              <Button size="lg" variant="inverse" render={<Link href="/kontak" />} nativeButton={false}>
                Minta Demo
              </Button>
              <Button size="lg" variant="outline-inverse" render={<Link href="/kontak#kontak-langsung" />} nativeButton={false}>
                Hubungi Tim Kami
              </Button>
            </div>
          </div>
          <div className="relative hidden min-h-72 lg:block">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 520px, 40vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
