import Link from "next/link"

import { OpenCookieSettings } from "@/components/cookie-consent"
import { Logo } from "@/components/logo"
import { modules } from "@/lib/modules"
import { companyNav, legalNav, platformNav, references, sectors, site } from "@/lib/site"

const linkCls = "inline-flex min-h-9 items-center text-[0.9375rem] text-white/75 hover:text-white hover:underline"

export function SiteFooter() {
  const cols = [
    { title: "Modul", links: modules.map((m) => ({ href: `/modul/${m.slug}`, label: m.name })) },
    { title: "Platform", links: platformNav },
    { title: "Industri", links: sectors },
    { title: "Perusahaan", links: [...companyNav, { href: "/kontak", label: "Kontak" }] },
  ]
  return (
    <footer className="bg-navy text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-20">
        <div className="flex flex-col gap-6">
          <Logo inverse />
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-white/75">{site.description}</p>
          <dl className="grid gap-2 text-sm">
            {[
              ["Alamat", site.address, undefined],
              ["Email", site.email, `mailto:${site.email}`],
              ["Telepon", site.phone, `tel:${site.phone.replace(/[^\d+]/g, "")}`],
            ].map(([k, v, href]) => (
              <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
                <dt className="text-white/60">{k}</dt>
                <dd className="leading-relaxed text-white/90">
                  {href ? (
                    <a href={href} className="hover:text-white hover:underline">
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-3 text-sm font-semibold text-white">{c.title}</p>
              <ul className="flex flex-col">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-[13px] leading-relaxed text-white/65">
          Dirancang mengacu pada{" "}
          {references.map((r, i) => (
            <span key={r.code}>
              <span className="font-semibold text-white/85">{r.code}</span> {r.name}
              {i < references.length - 1 ? ", " : ". "}
            </span>
          ))}
          Referensi rancangan, bukan klaim sertifikasi.
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.entity}. Hak cipta dilindungi.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <OpenCookieSettings className={linkCls} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
