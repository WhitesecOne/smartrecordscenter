import { ArchiveIcon, CalendarClockIcon, FileSearchIcon, LayoutGridIcon, ScaleIcon, ScrollTextIcon, SearchIcon } from "lucide-react"

import { MockFrame, StatusBadge } from "@/components/product/ui"
import { sampleRecords } from "@/lib/sample"
import { cn } from "@/lib/utils"

const nav = [
  { icon: LayoutGridIcon, label: "Ringkasan", on: true },
  { icon: ArchiveIcon, label: "Arsip" },
  { icon: CalendarClockIcon, label: "Jadwal Retensi" },
  { icon: ScaleIcon, label: "Penyusutan" },
  { icon: FileSearchIcon, label: "Review AI" },
  { icon: ScrollTextIcon, label: "Jejak Audit" },
]

const tiles = [
  { label: "Aktif", value: "1.284", cls: "border-t-teal" },
  { label: "Inaktif", value: "3.906", cls: "border-t-st-inactive" },
  { label: "Permanen", value: "412", cls: "border-t-navy" },
  { label: "Menunggu penyusutan", value: "37", cls: "border-t-st-pending" },
]

/** Hero "screenshot": the overview screen of the records application. */
export function DashboardMock({ className, title = "Pelaporan · Ringkasan Operasional" }: { className?: string; title?: string }) {
  const rows = sampleRecords.slice(0, 5)
  return (
    <MockFrame title={title} className={className}>
      <div className="flex text-[13px]">
        <nav aria-hidden className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-border bg-mist/60 p-3 sm:flex">
          {nav.map(({ icon: Icon, label, on }) => (
            <span key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-2 font-medium text-body", on && "bg-white text-navy shadow-[0_1px_2px_rgb(11_36_71/0.08)]")}>
              <Icon className={cn("size-4", on ? "text-brand" : "text-muted-foreground")} />
              {label}
            </span>
          ))}
        </nav>
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border px-3 text-muted-foreground">
              <SearchIcon className="size-4" aria-hidden />
              <span className="truncate">Cari arsip, kode klasifikasi, atau isi dokumen</span>
            </div>
            <span className="hidden rounded-md bg-brand-wash px-2.5 py-2 text-xs font-semibold text-brand-ink md:inline">Unit: Semua</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.label} className={cn("rounded-md border border-border border-t-[3px] bg-white px-3 py-2.5", t.cls)}>
                <p className="truncate text-[11.5px] font-medium text-muted-foreground">{t.label}</p>
                <p className="mt-1 text-lg font-bold text-navy tabular-nums">{t.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="min-w-0 overflow-hidden rounded-md border border-border">
              <p className="border-b border-border px-3 py-2 text-xs font-semibold text-navy">Arsip terbaru</p>
              <ul>
                {rows.map((r) => (
                  <li key={r.no} className="border-b border-border px-3 py-2 last:border-0">
                    <p className="truncate font-medium text-navy">{r.title}</p>
                    <p className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="code min-w-0 truncate text-[11.5px] text-muted-foreground">
                        {r.no} · {r.code}
                      </span>
                      <span className="shrink-0">
                        <StatusBadge status={r.status} short />
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden flex-col gap-3 lg:flex">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold text-navy">Jatuh tempo 90 hari</p>
                <ul className="mt-2 flex flex-col gap-2 text-[12px]">
                  <li className="flex justify-between gap-2"><span className="truncate">Kontrak pemeliharaan</span><span className="code text-muted-foreground">31 Des</span></li>
                  <li className="flex justify-between gap-2"><span className="truncate">Bukti perjalanan dinas</span><span className="code text-muted-foreground">30 Des</span></li>
                  <li className="flex justify-between gap-2"><span className="truncate">Log akses Q3</span><span className="code text-muted-foreground">30 Sep</span></li>
                </ul>
              </div>
              <div className="rounded-md border border-st-pending/25 bg-st-pending-wash/60 p-3">
                <p className="text-xs font-semibold text-st-pending">Perlu review</p>
                <p className="mt-1 text-[12px] leading-snug text-body">6 usulan AI di bawah ambang keyakinan menunggu arsiparis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockFrame>
  )
}
