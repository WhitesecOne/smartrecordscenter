"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const HIDDEN_ON = ["/kontak", "/terima-kasih"]

// Mobile-only bar; steps aside while an on-page CTA marked data-primary-cta is on screen.
export function StickyCta() {
  const pathname = usePathname()
  const [visibleOn, setVisibleOn] = useState<string | null>(null)
  const ctaVisible = visibleOn === pathname

  useEffect(() => {
    const seen = new Set<Element>()
    // Counts only a fully visible CTA group; one peeking at the bottom edge cannot be tapped comfortably.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.99) seen.add(e.target)
          else seen.delete(e.target)
        }
        setVisibleOn(seen.size > 0 ? pathname : null)
      },
      { threshold: [0, 0.99] }
    )
    document.querySelectorAll("[data-primary-cta]").forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [pathname])

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null

  return (
    <>
      <div aria-hidden className="h-[calc(4.75rem+env(safe-area-inset-bottom))] md:hidden" />
      <div
        data-hidden={ctaVisible}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_rgb(11_36_71/0.25)] transition-transform duration-200 ease-out data-[hidden=true]:translate-y-full md:hidden"
      >
        <Button size="lg" className="w-full" render={<Link href="/kontak" />} nativeButton={false} tabIndex={ctaVisible ? -1 : undefined}>
          Minta Demo
        </Button>
      </div>
    </>
  )
}
