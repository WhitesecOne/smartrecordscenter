import { ArrowRightIcon, CheckIcon, ShieldCheckIcon } from "lucide-react"
import * as motion from "motion/react-client"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LifecycleTimeline } from "@/components/lifecycle"
import { DashboardMock } from "@/components/product/dashboard"
import { JsonLd } from "@/components/json-ld"
import { ExtractionMock } from "@/components/product/extraction"
import { ProductMock } from "@/components/product/mocks"
import { RegisterVerifier } from "@/components/product/register"
import { Confidence, SampleTag } from "@/components/product/ui"
import { Reveal } from "@/components/reveal"
import { CtaBand, Section, SectionHeading } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { faq } from "@/lib/faq"
import { modules } from "@/lib/modules"
import { homeGraph } from "@/lib/seo"
import { ogBase, references, sectors, site } from "@/lib/site"

const title = "Smart Records Center: Platform Tata Kelola Arsip Digital"
const description =
  "Platform tata kelola arsip digital: repositori multi-organisasi, pencarian teks lengkap, metadata Dublin Core dan ISO 23081, klasifikasi, retensi dan penyusutan, jejak audit, serta pelaporan kepatuhan."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { ...ogBase, url: "/", title, description: site.description },
}

const ease = [0.16, 1, 0.3, 1] as const

const challenges = [
  {
    problem: "Arsip tersebar di folder bersama, email, dan lemari unit.",
    answer: "Repositori terstruktur di ruang data organisasi sendiri. Setiap arsip punya nomor, kode klasifikasi, unit pengolah, dan tingkat keamanan.",
    module: "repositori-arsip",
  },
  {
    problem: "Arsip yang diminta pimpinan atau auditor sulit ditemukan.",
    answer: "Pencarian teks lengkap dan metadata, termasuk isi pindaian, dengan hasil yang selalu disaring hak akses.",
    module: "pencarian-temu-kembali",
  },
  {
    problem: "Retensi dan penyusutan dihitung manual dan sering terlambat.",
    answer: "Mesin aturan menghitung tanggal dari JRA dan menyusun usulan penyusutan yang menunggu persetujuan berjenjang.",
    module: "retensi-penyusutan",
  },
  {
    problem: "Kepatuhan sulit dibuktikan saat pemeriksaan.",
    answer: "Jejak audit yang tidak dapat diubah, ditambah dasbor kepatuhan yang setiap angkanya dapat ditelusuri ke arsipnya.",
    module: "jejak-audit",
  },
]

const controls = [
  "Log audit append-only berantai hash",
  "Data dan kunci enkripsi terpisah per organisasi",
  "Akses menurut peran, unit kerja, dan tingkat keamanan",
  "Enkripsi saat transit dan saat disimpan",
  "Media write-once untuk arsip permanen",
  "Legal hold dan persetujuan penyusutan berjenjang",
]

const reasons = [
  { title: "Alur kearsipan Indonesia sejak awal", text: "Klasifikasi arsip, JRA, penyusutan, dan berita acara menjadi bagian inti sistem, bukan kolom tambahan di aplikasi dokumen umum." },
  { title: "Metadata yang dapat dipertukarkan", text: "Skema mengikuti Dublin Core yang diperluas dan ISO 23081, sehingga arsip tetap terbaca oleh sistem dan pemeriksa lain." },
  { title: "AI dengan kendali manusia", text: "Setiap usulan AI menampilkan sumber dan skor keyakinannya, lalu menunggu konfirmasi arsiparis sebelum berlaku." },
  { title: "Bukti yang dapat diverifikasi", text: "Auditor memeriksa keutuhan jejak audit dan paket bukti secara mandiri, tanpa bergantung pada pernyataan vendor." },
]

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      {/* Hero: the promise on navy beside the product itself, the screen an archivist opens every morning. */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="container-page grid items-center gap-12 pt-14 pb-16 md:pb-36 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pt-20 lg:pb-40">
          <motion.div initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }}>
            <h1 className="display text-[clamp(2.5rem,4.6vw,3.75rem)] text-white">Tata kelola arsip digital yang tertib, patuh, dan siap diaudit.</h1>
            <p className="lead mt-6 max-w-[54ch] text-white/85">
              Smart Records Center menyimpan, mencari, mengklasifikasikan, meretensi, dan menyusutkan arsip digital organisasi Anda dalam satu platform. Setiap tindakan
              tercatat di jejak audit yang tidak dapat diubah, dan setiap usulan AI ditinjau arsiparis sebelum berlaku.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-primary-cta>
              <Button size="lg" render={<Link href="/kontak" />} nativeButton={false}>
                Minta Demo
              </Button>
              <Button size="lg" variant="outline-inverse" render={<Link href="#modul" />} nativeButton={false}>
                Lihat Tujuh Modul
              </Button>
            </div>
            <p className="mt-10 max-w-[56ch] border-t border-white/20 pt-5 text-[13px] leading-relaxed text-white/70">
              Dirancang mengacu pada{" "}
              {references.map((r, i) => (
                <span key={r.code}>
                  <span className="font-semibold text-white/90">{r.code}</span>
                  {i < references.length - 1 ? ", " : ". "}
                </span>
              ))}
              Referensi rancangan, bukan klaim sertifikasi.
            </p>
          </motion.div>
          <HeroDashboard />
        </div>
      </section>

      {/* Module index: the seven modules as a bar that overlaps the photograph's lower edge. */}
      <nav aria-label="Tujuh modul" className="relative z-10 hidden md:block">
        <div className="container-page -mt-20">
          <ul className="grid grid-cols-4 overflow-hidden rounded-xl border border-border bg-white shadow-product lg:grid-cols-7">
            {modules.map((m) => (
              <li key={m.slug} className="border-border not-last:border-r max-lg:nth-[4]:border-r-0 max-lg:nth-[n+5]:border-t">
                <Link href={`/modul/${m.slug}`} className="group flex h-full flex-col gap-3 p-4 hover:bg-mist lg:p-5">
                  <m.icon className="size-6 text-brand" aria-hidden />
                  <span className="text-[0.9375rem] leading-snug font-semibold text-navy group-hover:text-brand">{m.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* On a phone the same index becomes a strip that scrolls sideways under the hero. */}
      <nav aria-label="Tujuh modul" className="border-b border-border bg-white md:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {modules.map((m) => (
            <li key={m.slug} className="shrink-0">
              <Link href={`/modul/${m.slug}`} className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold whitespace-nowrap text-navy">
                <m.icon className="size-4 text-brand" aria-hidden />
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* The problem, in the reader's own words, answered module by module. */}
      <Section className="lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionHeading
              title="Arsip terus bertambah. Aturannya tidak boleh tertinggal."
              lead="Organisasi teregulasi wajib menyimpan, menemukan kembali, menyusutkan, dan membuktikan pengelolaan arsipnya. Tanpa sistem, pekerjaan itu bergantung pada ingatan dan tabel manual."
            />
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-xl">
              <Image src="/images/analytics-laptop.webp" alt="Grafik dan indikator data di layar laptop" fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
            </div>
          </div>
          <ol className="flex flex-col">
            {challenges.map((c) => {
              const m = modules.find((x) => x.slug === c.module)!
              return (
                <li key={c.problem} className="grid gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-2 sm:gap-8">
                  <p className="font-heading text-xl leading-snug font-bold text-navy">{c.problem}</p>
                  <div>
                    <p className="flex gap-3 text-[0.9375rem] leading-relaxed text-body">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                      {c.answer}
                    </p>
                    <Link href={`/modul/${m.slug}`} className="link-action mt-3 ml-7 text-sm">
                      Modul {m.name}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Section>

      {/* Signature: choose a module, see its own screen. */}
      <Section tone="mist" id="modul" className="scroll-mt-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title="Tujuh modul untuk seluruh tata kelola arsip digital"
            lead="Setiap modul punya layar kerjanya sendiri dan dapat diterapkan bertahap. Semuanya bekerja pada arsip, aturan, dan jejak audit yang sama."
          />
          <Link href="/modul" className="link-action shrink-0">
            Bandingkan semua modul <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <Tabs defaultValue={modules[0].slug} orientation="vertical" className="mt-12 flex-col gap-8 lg:flex-row lg:gap-10">
          <TabsList variant="line" className="w-full shrink-0 items-stretch gap-1 lg:w-[22rem]">
            {modules.map((m) => (
              <TabsTrigger
                key={m.slug}
                value={m.slug}
                className="group/tab h-auto items-start gap-3.5 rounded-lg border border-transparent px-3.5 py-3 text-left whitespace-normal text-body after:hidden hover:bg-white/70 data-active:border-border data-active:bg-white data-active:shadow-[0_1px_2px_rgb(11_36_71/0.06)]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-navy ring-1 ring-border group-data-active/tab:bg-brand group-data-active/tab:text-white group-data-active/tab:ring-brand [&_svg]:size-[1.125rem]!">
                  <m.icon aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-navy">{m.name}</span>
                  <span className="text-[13.5px] leading-snug font-normal text-muted-foreground">{m.short}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {modules.map((m) => (
            <TabsContent key={m.slug} value={m.slug} className="min-w-0 animate-in text-base duration-500 fade-in-0 slide-in-from-bottom-2">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-10">
                <div>
                  <h3 className="h3 text-2xl">{m.title}</h3>
                  <p className="mt-3 leading-relaxed text-body">{m.lead}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="rounded-lg border border-brand/20 bg-brand-wash/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-navy">
                    <span className="font-semibold text-brand-ink">Peran AI: </span>
                    {m.ai}
                  </p>
                  <Link href={`/modul/${m.slug}`} className="link-action">
                    Pelajari modul {m.name} <ArrowRightIcon className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="mt-8">
                <ProductMock k={m.heroMock} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      {/* One record's life across the modules. */}
      <Section id="siklus">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title="Satu arsip, dari diterima sampai nasib akhirnya"
            lead="Status arsip tidak diubah tangan. Tanggal pindah dan jatuh tempo dihitung dari penutupan berkas dan aturan retensi pada kode klasifikasinya."
          />
          <Link href="/platform/cara-kerja" className="link-action shrink-0">
            Lihat cara kerja lengkap <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <LifecycleTimeline className="mt-14" />
      </Section>

      {/* AI under human control, shown on a real extraction screen and module by module. */}
      <Section tone="mist" id="ai">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              title="AI di setiap modul. Keputusan tetap di tangan arsiparis."
              lead="Model membaca dokumen, mengusulkan, dan menandai. Setiap usulan menampilkan sumber dan skor keyakinannya, lalu menunggu konfirmasi sebelum berlaku."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Usulan tidak berlaku otomatis. Konfirmasi manusia tetap diperlukan.",
                "Keyakinan di bawah 0,90 ditandai wajib review.",
                "Model, versi, skor, dan peninjau tercatat di jejak audit.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <ExtractionMock />
          </Reveal>
        </div>
        <div className="mt-16 overflow-hidden rounded-xl border border-border bg-white">
          <h3 className="border-b border-border px-5 py-4 font-heading text-lg font-bold text-navy">Peran AI di ketujuh modul</h3>
          <dl>
            {modules.map((m) => (
              <div key={m.slug} className="grid gap-1.5 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-6">
                <dt>
                  <Link href={`/modul/${m.slug}`} className="inline-flex items-center gap-2.5 font-semibold text-navy hover:text-brand hover:underline">
                    <m.icon className="size-4 text-brand" aria-hidden />
                    {m.name}
                  </Link>
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed">{m.ai}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Security and audit: the page's navy anchoring band. */}
      <section id="keamanan" className="relative isolate overflow-hidden bg-navy py-20 text-white lg:py-28">
        <Image src="/images/data-center.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-60" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-navy/90" />
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
            <SectionHeading
              inverse
              title="Jejak audit yang dapat Anda periksa sendiri"
              lead="Setiap entri log menyimpan hash entri sebelumnya. Ubah satu baris, dan rantai putus tepat di baris itu. Coba di bawah ini."
            />
            <div>
              <ul className="grid gap-3 text-[0.9375rem] text-white/85 sm:grid-cols-2">
                {controls.map((c) => (
                  <li key={c} className="flex gap-3">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-brand-soft" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/platform/keamanan" className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline">
                  Keamanan &amp; kepatuhan <ArrowRightIcon className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
          <Reveal className="mt-12">
            <RegisterVerifier />
            <p className="mt-3 text-[13px] text-white/70">Verifikasi ini berjalan di browser Anda dengan SHA-256 sungguhan, atas log contoh.</p>
          </Reveal>
        </div>
      </section>

      {/* Sectors: four peers, so four equal photographs. */}
      <Section id="industri">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading title="Untuk organisasi dengan kewajiban kearsipan" lead="Kebutuhan tiap sektor berbeda. Aturan dasarnya sama: arsip harus tertata, patuh, dan dapat dibuktikan." />
          <Link href="/industri" className="link-action shrink-0">
            Semua industri <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s) => (
            <li key={s.id}>
              <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-product">
                <span className="relative aspect-[4/3] overflow-hidden bg-mist">
                  <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-heading text-lg font-bold text-navy group-hover:text-brand">{s.label}</span>
                  <span className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-body">{s.desc}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    Lihat solusi <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Why us, with the standards the design follows. */}
      <Section tone="mist" id="mengapa">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading title="Dibangun untuk cara kerja kearsipan di Indonesia" />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {references.map((r) => (
                <li key={r.code} className="flex items-baseline gap-4 py-3.5">
                  <span className="w-28 shrink-0 font-heading font-bold text-navy">{r.code}</span>
                  <span className="text-[0.9375rem] text-body">{r.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] text-muted-foreground">Acuan rancangan, bukan klaim sertifikasi.</p>
          </div>
          <div>
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title} className="border-t-2 border-navy pt-5">
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
            <Link href="/mengapa-kami" className="link-action mt-10">
              Selengkapnya: Mengapa Kami <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      {/* Questions buyers and auditors ask, answered in full on the page so search engines and AI assistants can quote them. */}
      <Section id="tanya-jawab">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionHeading title="Pertanyaan yang sering diajukan" lead="Jawaban singkat untuk pertanyaan yang biasanya muncul dari arsiparis, auditor, dan tim TI sebelum demo." />
            <Link href="/kontak" className="link-action mt-8">
              Tanyakan hal lain kepada tim kami <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {faq.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-heading text-lg leading-snug font-bold text-navy">{f.q}</dt>
                <dd className="mt-2.5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-body">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}

/** The overview screen with two answers lifted out of it: an AI proposal waiting for review and the audit chain status. */
function HeroDashboard() {
  return (
    <div className="relative min-w-0 lg:pl-4">
      {/* A lighter navy plate behind the screen: it separates the white frame from the navy field without a glow. */}
      <div aria-hidden className="absolute -inset-x-3 top-6 -bottom-6 rounded-2xl border border-white/10 bg-navy-2/70 lg:-right-10 lg:left-10" />
      <motion.div className="relative" initial={{ y: 28 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
        <DashboardMock title="Smart Records Center · Ringkasan" />
      </motion.div>
      <motion.figure
        className="absolute -bottom-10 -left-6 hidden w-[17rem] rounded-xl border border-border bg-white p-4 text-body shadow-product sm:block"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.35 }}
      >
        <figcaption className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
          Usulan klasifikasi AI
          <SampleTag />
        </figcaption>
        <p className="mt-2 text-sm font-semibold text-navy">Laporan Keuangan Tahunan 2025</p>
        <p className="mt-2 flex items-center justify-between text-[13px]">
          <span className="code text-navy">KU.01.02</span>
          <Confidence value={0.97} />
        </p>
        <p className="mt-3 text-[12px] leading-snug text-muted-foreground">Menunggu konfirmasi arsiparis. Retensi aktif 2 th, inaktif 8 th, permanen.</p>
      </motion.figure>
      <motion.p
        className="absolute right-4 -bottom-7 hidden items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 text-[13px] font-semibold text-teal-ink shadow-product sm:flex"
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.5 }}
      >
        <ShieldCheckIcon className="size-4 shrink-0" aria-hidden />
        Rantai jejak audit utuh
        <span className="code font-normal text-muted-foreground">48.385 entri</span>
      </motion.p>
    </div>
  )
}
