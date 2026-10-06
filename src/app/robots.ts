import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

// AI search and answer engines are named explicitly so a future blanket rule cannot shut them out by accident.
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot", "Applebot-Extended"]

export default function robots(): MetadataRoute.Robots {
  // No production URL configured means preview or staging: keep every crawler out.
  if (!process.env.NEXT_PUBLIC_SITE_URL) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/terima-kasih"] },
      { userAgent: aiCrawlers, allow: "/", disallow: ["/terima-kasih"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
