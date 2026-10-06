import { HeaderNav, type NavModule } from "@/components/header-nav"
import { modules } from "@/lib/modules"

export function SiteHeader() {
  const navModules: NavModule[] = modules.map((m) => ({
    href: `/modul/${m.slug}`,
    name: m.name,
    short: m.short,
    icon: <m.icon aria-hidden />,
  }))
  return <HeaderNav modules={navModules} />
}
