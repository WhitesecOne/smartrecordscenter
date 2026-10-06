import { faq } from "@/lib/faq"
import { modules } from "@/lib/modules"
import { companyNav, platformNav, references, sectors, site } from "@/lib/site"

export const dynamic = "force-static"

const abs = (path: string) => new URL(path, site.url).href

/** llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants, built from the same data the pages render. */
export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Bahasa situs: Indonesia. Layar produk di situs memakai data contoh, bukan data pelanggan.",
    `Kontak: ${site.email}, ${site.phone}, ${site.address}.`,
    "",
    "## Modul",
    ...modules.map((m) => `- [${m.name}](${abs(`/modul/${m.slug}`)}): ${m.short} Peran AI: ${m.ai}`),
    "",
    "## Platform",
    ...platformNav.map((l) => `- [${l.label}](${abs(l.href)}): ${l.desc}`),
    "",
    "## Industri",
    ...sectors.map((s) => `- [${s.label}](${abs(s.href)}): ${s.desc}`),
    "",
    "## Perusahaan",
    ...companyNav.map((l) => `- [${l.label}](${abs(l.href)}): ${l.desc}`),
    `- [Kontak dan permintaan demo](${abs("/kontak")}): formulir permintaan demo dan kontak langsung.`,
    "",
    "## Acuan rancangan (bukan klaim sertifikasi)",
    ...references.map((r) => `- ${r.code} ${r.name}`),
    "",
    "## Tanya jawab",
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ].join("\n")
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
