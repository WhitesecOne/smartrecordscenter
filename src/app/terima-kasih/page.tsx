import type { Metadata } from "next"
import Link from "next/link"

import { PageHero, Section, SectionHeading } from "@/components/section"
import { Button } from "@/components/ui/button"

import { ConversionPing } from "./conversion-ping"

export const metadata: Metadata = {
  title: "Terima Kasih",
  description: "Permintaan demo Smart Records Center sudah kami terima. Lihat langkah berikutnya setelah formulir terkirim.",
  robots: { index: false, follow: false },
}

const steps = [
  { title: "Kami membaca kebutuhan Anda", text: "Tim kami mempelajari sektor dan kebutuhan yang Anda tulis di formulir." },
  { title: "Kami menghubungi Anda", text: "Kami menghubungi Anda melalui email kerja untuk menyepakati jadwal dan peserta demo." },
  { title: "Demo sesuai alur kerja Anda", text: "Demo memakai skenario arsip yang relevan dengan organisasi Anda, tanpa perlu mengirim dokumen rahasia." },
]

export default async function TerimaKasihPage({ searchParams }: { searchParams: Promise<{ t?: string | string[] }> }) {
  const { t } = await searchParams
  return (
    <>
      <ConversionPing token={typeof t === "string" ? t : undefined} />
      <PageHero
        crumbs={[{ href: "/kontak", label: "Kontak" }, { label: "Terima kasih" }]}
        title="Terima kasih, permintaan demo Anda sudah kami terima."
        lead="Sambil menunggu, Anda dapat mempelajari cara kerja platform dan modul yang paling relevan dengan organisasi Anda."
        actions={
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/platform" />} nativeButton={false}>
              Pelajari Platform
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/" />} nativeButton={false}>
              Kembali ke Beranda
            </Button>
          </div>
        }
      />
      <Section>
        <SectionHeading title="Langkah berikutnya" />
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-border pt-6">
              <h3 className="flex gap-3 text-lg font-bold">
                <span className="text-brand tabular-nums" aria-hidden>
                  {i + 1}
                </span>
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
