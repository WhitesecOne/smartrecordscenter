import Link from "next/link"

import { modules, type Module } from "@/lib/modules"
import { cn } from "@/lib/utils"

const bySlug = (s: Module["slug"]) => modules.find((m) => m.slug === s)!

// Three layers in the order a record meets them: it arrives and is put in order, it is used and kept, it is proven.
const layers: { name: string; desc: string; slugs: Module["slug"][] }[] = [
  { name: "Diterima dan ditata", desc: "Arsip masuk, diberi metadata, dan diklasifikasikan.", slugs: ["repositori-arsip", "manajemen-metadata", "klasifikasi-arsip"] },
  { name: "Dipakai dan dijaga", desc: "Arsip ditemukan kembali dan dikelola sesuai retensinya.", slugs: ["pencarian-temu-kembali", "retensi-penyusutan"] },
  { name: "Dibuktikan", desc: "Setiap aksi tercatat dan dilaporkan.", slugs: ["jejak-audit", "pelaporan"] },
]

function Node({ m }: { m: Module }) {
  return (
    <Link
      href={`/modul/${m.slug}`}
      className="group flex items-start gap-3 rounded-lg border border-border bg-white p-4 shadow-[0_1px_2px_rgb(11_36_71/0.06)] transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-product"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-wash text-brand">
        <m.icon className="size-[1.125rem]" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block font-heading font-bold text-navy group-hover:text-brand">{m.name}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{m.short}</span>
      </span>
    </Link>
  )
}

/** The seven modules as three layers over one shared base of data, rules and audit log. */
export function PlatformDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-6xl", className)}>
      <ol className="flex flex-col gap-3">
        {layers.map((l) => (
          <li key={l.name} className="grid gap-3 rounded-xl border border-border bg-mist/70 p-3 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-center lg:gap-5 lg:p-4">
            <div className="px-1">
              <p className="font-heading font-bold text-navy">{l.name}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{l.desc}</p>
            </div>
            <div className={cn("grid gap-3 sm:grid-cols-2", l.slugs.length === 3 && "lg:grid-cols-3")}>
              {l.slugs.map((s) => (
                <Node key={s} m={bySlug(s)} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 rounded-xl bg-navy p-5 text-white sm:grid-cols-2 lg:p-6">
        <p>
          <span className="block font-heading font-bold">Satu sumber data</span>
          <span className="mt-1 block text-[0.9375rem] leading-relaxed text-white/80">Arsip, metadata, aturan retensi, dan hak akses yang sama dipakai oleh ketujuh modul.</span>
        </p>
        <p>
          <span className="block font-heading font-bold">AI dengan konfirmasi manusia</span>
          <span className="mt-1 block text-[0.9375rem] leading-relaxed text-white/80">Setiap modul memakai AI untuk mengusulkan. Keputusan dan peninjaunya tercatat di jejak audit.</span>
        </p>
      </div>
    </div>
  )
}
