import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  // No production URL configured means preview or staging: keep every crawler out.
  if (!process.env.NEXT_PUBLIC_SITE_URL) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/terima-kasih"] },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
