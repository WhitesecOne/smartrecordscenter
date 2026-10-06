"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Records one generate_lead per form submission token. Without consent there is no gtag, so nothing is sent.
export function ConversionPing({ token }: { token?: string }) {
  useEffect(() => {
    if (!token || !window.gtag) return
    const key = `src-lead:${token}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, "1")
    } catch {
      return // Storage blocked: skip rather than risk counting a reload twice.
    }
    window.gtag("event", "generate_lead")
  }, [token])

  return null
}
