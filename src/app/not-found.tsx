import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
  description: "Alamat yang Anda buka tidak ada di situs Smart Records Center. Lanjutkan ke beranda, platform, modul, atau kontak.",
}

const suggestions = [
  { href: "/", label: "Beranda", desc: "Ringkasan Smart Records Center." },
  { href: "/platform", label: "Platform", desc: "Tujuh modul di atas satu sumber data dan satu jejak audit." },
  { href: "/modul", label: "Modul", desc: "Tujuh modul tata kelola arsip digital, dari repositori sampai pelaporan." },
  { href: "/industri", label: "Industri", desc: "Pemerintah, BUMN dan BUMD, perbankan, dan korporasi." },
  { href: "/kontak", label: "Kontak", desc: "Minta demo atau hubungi kami langsung." },
]

export default function NotFound() {
  return (
    <section className="border-b border-border bg-mist">
      <div className="container-page py-16 lg:py-24">
        <h1 className="display text-[clamp(2.25rem,4.4vw,3.5rem)]">Halaman tidak ditemukan</h1>
        <p className="lead mt-6 max-w-[60ch] text-body">
          Alamat yang Anda buka tidak ada atau sudah dipindahkan. Periksa kembali ejaan alamatnya, atau lanjutkan dari salah satu halaman berikut.
        </p>
        <ul className="mt-10 grid max-w-4xl gap-x-10 border-t border-border sm:grid-cols-2">
          {suggestions.map((s) => (
            <li key={s.href} className="border-b border-border">
              <Link href={s.href} className="group flex min-h-11 items-start justify-between gap-4 py-5">
                <span>
                  <span className="block font-semibold text-navy group-hover:text-brand group-hover:underline">{s.label}</span>
                  <span className="mt-1 block text-[0.9375rem] text-muted-foreground">{s.desc}</span>
                </span>
                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
