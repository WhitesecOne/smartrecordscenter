"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const stages = [
  {
    year: "12 Mar 2026",
    name: "Diterima",
    desc: "Arsip masuk ke ruang data organisasi, diberi nomor, metadatanya diisi dan divalidasi, lalu diklasifikasikan.",
    modules: "Repositori · Metadata · Klasifikasi",
    tone: "bg-white text-navy border-navy/30",
  },
  {
    year: "2026 s.d. 2028",
    name: "Aktif",
    desc: "Dipakai unit pengolah dan ditemukan lewat pencarian. Masa aktif 2 tahun dihitung sejak berkas ditutup.",
    modules: "Pencarian · Jejak Audit",
    tone: "bg-brand text-white border-brand",
  },
  {
    year: "2028 s.d. 2036",
    name: "Inaktif",
    desc: "Pindah ke unit kearsipan pada tanggal hitungan mesin aturan. Hanya baca, setiap peminjaman dicatat.",
    modules: "Retensi · Jejak Audit",
    tone: "bg-navy-2 text-white border-navy-2",
  },
  {
    year: "2036",
    name: "Permanen atau musnah",
    desc: "Sesuai nasib akhir di JRA: diserahkan sebagai arsip permanen, atau dimusnahkan lewat persetujuan berjenjang.",
    modules: "Penyusutan · Pelaporan",
    tone: "bg-navy text-white border-navy",
  },
]

/** One record's life on a year scale; the connecting line draws itself once when it scrolls into view. */
export function LifecycleTimeline({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <p className="mb-8 text-sm text-muted-foreground">
        Contoh: <span className="font-semibold text-navy">Laporan keuangan tahunan</span> · kode <span className="code">KU.01.02</span> · aktif 2 tahun, inaktif 8 tahun,
        nasib akhir permanen.
      </p>
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        <motion.span
          aria-hidden
          className="absolute top-[1.375rem] right-[12.5%] left-[12.5%] hidden h-0.5 origin-left bg-navy/20 md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {stages.map((s, i) => (
          <li key={s.name} className="relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
            <span className={cn("relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold", s.tone)}>{i + 1}</span>
            <div className="md:mt-5">
              <h3 className="text-lg font-bold">{s.name}</h3>
              <p className="code mt-0.5 text-xs font-semibold text-muted-foreground">{s.year}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{s.desc}</p>
              <p className="mt-3 text-[13px] font-semibold text-brand-ink">{s.modules}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
