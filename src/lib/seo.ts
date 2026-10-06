import { faq } from "@/lib/faq"
import { modules } from "@/lib/modules"
import { site } from "@/lib/site"

const abs = (path: string) => new URL(path, site.url).href
const orgId = abs("/#organisasi")

/** Organization and WebSite, emitted once per page from the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.entity,
        url: abs("/"),
        logo: abs("/icon/512"),
        email: site.email,
        telephone: site.phone,
        description: site.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Raya Ceger, Jl. H. Baneng No. 4, RT.6/RW.3, Ceger",
          addressLocality: "Kota Jakarta Timur",
          addressRegion: "DKI Jakarta",
          postalCode: "13880",
          addressCountry: "ID",
        },
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, telephone: site.phone, availableLanguage: ["id"] },
      },
      { "@type": "WebSite", "@id": abs("/#situs"), name: site.name, url: abs("/"), inLanguage: "id-ID", publisher: { "@id": orgId } },
    ],
  }
}

/** The product itself and the visible FAQ on the home page. No price or rating: none exists yet. */
export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: site.name,
        url: abs("/"),
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Tata kelola arsip digital (records management)",
        operatingSystem: "Web",
        inLanguage: "id-ID",
        description: site.description,
        featureList: modules.map((m) => `${m.name}: ${m.short}`),
        provider: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  }
}

/** BreadcrumbList that mirrors the visible breadcrumb: Beranda first, the current page last. */
export function breadcrumbGraph(crumbs: { href?: string; label: string }[], current?: string) {
  const items = [{ label: "Beranda", href: "/" }, ...crumbs]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : current ? { item: abs(current) } : {}),
    })),
  }
}
