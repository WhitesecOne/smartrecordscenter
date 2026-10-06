import { cn } from "@/lib/utils"

// Provisional mark until the owner supplies a logo: stacked record sheets, the top one filed.
export function LogoMark({ className, inverse }: { className?: string; inverse?: boolean }) {
  const bg = inverse ? "#fff" : "var(--navy)"
  const fg = inverse ? "var(--navy)" : "#fff"
  // The filed sheet: brand blue on white, a lighter blue on navy so it still reads as blue.
  const accent = inverse ? "var(--brand)" : "#9bb8ff"
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="7" fill={bg} />
      <rect x="8" y="9" width="16" height="3" rx="1" fill={fg} opacity="0.45" />
      <rect x="8" y="14.5" width="16" height="3" rx="1" fill={fg} opacity="0.7" />
      <rect x="8" y="20" width="10" height="3" rx="1" fill={accent} />
      <rect x="20" y="19" width="5" height="5" rx="1" fill={fg} />
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
