import type { Metadata, Viewport } from "next"
import { Red_Hat_Display, Red_Hat_Mono, Red_Hat_Text } from "next/font/google"

import { CookieConsent } from "@/components/cookie-consent"
import { JsonLd } from "@/components/json-ld"
import { MotionProvider } from "@/components/motion-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StickyCta } from "@/components/sticky-cta"
import { siteGraph } from "@/lib/seo"
import { site } from "@/lib/site"

import "./globals.css"

// One superfamily drawn for a corporate identity program: a display cut for headings, a text cut tuned for
// small UI sizes inside product screens, and a mono cut for the codes an archivist copies verbatim.
const display = Red_Hat_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const text = Red_Hat_Text({ subsets: ["latin"], variable: "--font-text", display: "swap" })
const mono = Red_Hat_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "id_ID", type: "website" },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = { themeColor: "#ffffff" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <JsonLd data={siteGraph()} />
        <MotionProvider>
          <SiteHeader />
          <main id="konten" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <StickyCta />
        </MotionProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
