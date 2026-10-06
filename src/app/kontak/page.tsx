import { CheckIcon, ShieldAlertIcon } from "lucide-react"
import type { Metadata } from "next"

import { PageHero, Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { ogBase, site } from "@/lib/site"

import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: "Minta Demo",
  description:
    "Minta demo Smart Records Center. Kami tunjukkan repositori, pencarian, metadata, klasifikasi, retensi dan penyusutan, jejak audit, serta pelaporan memakai skenario arsip organisasi Anda.",
  alternates: { canonical: "/kontak" },
  openGraph: { ...ogBase, url: "/kontak", title: "Minta demo Smart Records Center" },
}

const agenda = [
  "Alur satu seri arsip Anda: diterima, dilengkapi metadatanya, diklasifikasikan, dan diberi jadwal retensi sesuai JRA.",
  "Pencarian teks lengkap dan metadata, serta usulan AI beserta skor dan sumbernya.",
  "Jejak audit berantai hash dan cara auditor memverifikasinya secara mandiri.",
  "Dasbor kepatuhan dan contoh laporan untuk pimpinan dan regulator.",
  "Opsi penerapan dan integrasi dengan sistem yang sudah Anda pakai.",
]

export default function KontakPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Kontak" }]}
        title="Minta demo Smart Records Center"
        lead="Ceritakan kebutuhan arsip organisasi Anda. Kami siapkan demo yang mengikuti alur kerja Anda, bukan presentasi umum."
        actions={
          <Button size="lg" className="mt-8 w-full sm:w-auto lg:hidden" render={<a href="#formulir" />} nativeButton={false}>
            Isi formulir permintaan demo
          </Button>
        }
      />

      <Section className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">Yang kita bahas dalam demo</h2>
              <ul className="mt-5 flex flex-col gap-3.5">
                {agenda.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="flex gap-3 rounded-lg bg-mist p-4 text-[0.9375rem] leading-relaxed">
              <ShieldAlertIcon className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
              <span>
                <strong className="font-semibold text-navy">Jangan kirim dokumen rahasia melalui formulir ini.</strong> Cukup jelaskan jenis arsip dan
                kebutuhannya secara umum.
              </span>
            </p>

            <div id="kontak-langsung" className="border-t border-border pt-8">
              <h2 className="text-xl font-bold tracking-[-0.02em]">Kontak langsung</h2>
              <dl className="mt-5 grid gap-4 text-[0.9375rem]">
                <div>
                  <dt className="text-sm text-muted-foreground">Alamat</dt>
                  <dd className="mt-0.5 font-medium text-navy">{site.address}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center font-medium text-brand underline">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Telepon</dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center font-medium text-brand underline">
                      {site.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div id="formulir" className="order-first scroll-mt-24 rounded-xl border border-border bg-white p-5 sm:p-8 lg:order-none lg:self-start">
            <h2 className="text-xl font-bold tracking-[-0.02em]">Formulir permintaan demo</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
