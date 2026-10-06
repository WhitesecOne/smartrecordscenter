import { cn } from "@/lib/utils"

// "Arsip Tersimpan": a system frame whose last corner is filled by one record block, the record filed and locked in.
// This is the small-size cut (heavier frame, larger block), since the site only draws the mark at 20 to 40 px.
// Masters for print and large sizes live in public/brand/.
const FRAME =
  "M220 130V80A44 44 0 0 0 176 36H80A44 44 0 0 0 36 80V176A44 44 0 0 0 80 220H130V190H80A14 14 0 0 1 66 176V80A14 14 0 0 1 80 66H176A14 14 0 0 1 190 80V130Z"

export function LogoMark({ className, inverse }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden className={cn("size-8 shrink-0", className)}>
      <path d={FRAME} fill={inverse ? "#fff" : "var(--navy)"} />
      <rect x="156" y="156" width="64" height="64" rx="14" fill={inverse ? "var(--brand-soft)" : "var(--brand)"} />
    </svg>
  )
}

export function Logo({ className, inverse }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark inverse={inverse} />
      <span className={cn("font-heading text-[1.0625rem] leading-none font-bold tracking-[-0.015em]", inverse ? "text-white" : "text-navy")}>
        Smart Records Center
      </span>
    </span>
  )
}
