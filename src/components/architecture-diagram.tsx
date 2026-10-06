import { cn } from "@/lib/utils"

function Box({ title, desc, tone = "white", className }: { title: string; desc: string; tone?: "white" | "navy" | "brand"; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        tone === "white" && "border-border bg-white",
        tone === "navy" && "border-navy bg-navy text-white",
        tone === "brand" && "border-brand/30 bg-brand-wash",
        className
      )}
    >
      <p className={cn("font-bold", tone === "navy" ? "text-white" : "text-navy")}>{title}</p>
      <p className={cn("mt-1 text-[13px] leading-snug", tone === "navy" ? "text-white/75" : "text-muted-foreground")}>{desc}</p>
    </div>
  )
}

const Down = () => <span aria-hidden className="mx-auto block h-6 w-px bg-navy/30" />

function Group({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-dashed border-navy/25 p-3 pt-2", className)}>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

/** Target architecture from docs/ARCHITECTURE.md, simplified for decision makers. */
export function ArchitectureDiagram() {
  return (
    <figure className="rounded-2xl border border-border bg-mist p-4 sm:p-6">
      <Group label="Klien">
        <div className="grid gap-3 sm:grid-cols-2">
          <Box title="Browser pengguna" desc="Arsiparis, unit pengolah, auditor" />
          <Box title="Sistem integrasi" desc="Aplikasi lain melalui API dan webhook" />
        </div>
      </Group>
      <Down />
      <Box title="Reverse proxy" desc="TLS, pembatasan laju permintaan" className="mx-auto max-w-md text-center" />
      <Down />
      <div className="grid gap-3 sm:grid-cols-2">
        <Box tone="navy" title="Aplikasi web" desc="Situs publik dan antarmuka aplikasi, tanpa akses langsung ke database" />
        <Box tone="navy" title="Layanan API" desc="Mesin aturan retensi, hak akses, pemisahan organisasi, penulisan log audit" />
      </div>
      <Down />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Group label="Data, hanya diakses layanan API">
          <div className="grid gap-3 sm:grid-cols-3">
            <Box title="PostgreSQL" desc="Data arsip per organisasi, metadata, indeks pencarian, log audit" />
            <Box title="Object storage" desc="Berkas terenkripsi; storage write-once untuk arsip permanen" />
            <Box title="KMS / HSM" desc="Kunci enkripsi per organisasi dan kunci tanda tangan" />
          </div>
        </Group>
        <Group label="Worker terisolasi, memproses isi dokumen">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Box tone="brand" title="Worker AI" desc="OCR, usulan klasifikasi, ekstraksi metadata, duplikat, risiko, anomali akses" />
            <Box tone="brand" title="Worker keutuhan berkas" desc="Pemeriksaan hash terjadwal, identifikasi format, konversi PDF/A" />
          </div>
        </Group>
      </div>
      <figcaption className="mt-4 text-[13px] text-muted-foreground">
        Arsitektur target. Aplikasi web publik sudah berjalan; komponen lainnya dalam pengembangan bertahap.
      </figcaption>
    </figure>
  )
}
