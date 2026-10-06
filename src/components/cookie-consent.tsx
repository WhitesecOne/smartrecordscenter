"use client"

import Link from "next/link"
import Script from "next/script"
import { useEffect, useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

type Consent = "granted" | "denied"

const KEY = "src-consent"
const REOPEN = "src:cookie-settings"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

function read(): Consent | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb)
  return () => window.removeEventListener("storage", cb)
}

export function CookieConsent() {
  // Server snapshot "denied": analytics stays off and the banner hidden until the browser knows.
  const stored = useSyncExternalStore(subscribe, read, () => "denied" as Consent)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const open = () => setEditing(true)
    window.addEventListener(REOPEN, open)
    return () => window.removeEventListener(REOPEN, open)
  }, [])

  function choose(value: Consent) {
    try {
      localStorage.setItem(KEY, value)
    } catch {}
    setEditing(false)
    window.dispatchEvent(new StorageEvent("storage"))
    // Revoking after the analytics script loaded needs a reload to drop it.
    if (value === "denied" && stored === "granted") window.location.reload()
  }

  return (
    <>
      {GA_ID && stored === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {(editing || stored === null) && (
        <section
          role="region"
          aria-label="Persetujuan cookie"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-white p-4 shadow-product sm:inset-x-6 sm:p-5 mb-[env(safe-area-inset-bottom)]"
        >
          <p className="font-semibold text-navy">Pengaturan cookie</p>
          <p className="mt-1 text-[0.9375rem] text-body">
            Kami ingin memakai cookie analitik untuk memahami halaman mana yang dibaca. Tanpa persetujuan Anda, tidak ada skrip analitik yang dimuat.{" "}
            <Link href="/kebijakan-privasi" className="font-medium text-brand underline">
              Baca kebijakan privasi
            </Link>
            .
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <Button variant="outline" onClick={() => choose("denied")}>
              Tolak
            </Button>
            <Button variant="outline" onClick={() => choose("granted")}>
              Izinkan
            </Button>
          </div>
        </section>
      )}
    </>
  )
}

export function OpenCookieSettings({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(REOPEN))} className={className}>
      Pengaturan cookie
    </button>
  )
}
