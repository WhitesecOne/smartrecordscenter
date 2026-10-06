"use client"

import { useState } from "react"

import { Confidence, MockFrame } from "@/components/product/ui"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Key = "number" | "date" | "sender" | "subject" | "code"

const fields: { key: Key; label: string; value: string; conf: number }[] = [
  { key: "number", label: "Nomor surat", value: "UM.01.01/2026/233", conf: 0.99 },
  { key: "date", label: "Tanggal", value: "4 Mei 2026", conf: 0.98 },
  { key: "sender", label: "Pengirim", value: "Sekretariat", conf: 0.95 },
  { key: "subject", label: "Perihal", value: "Rapat Koordinasi Pengelolaan Arsip", conf: 0.93 },
  { key: "code", label: "Kode klasifikasi", value: "UM.01.01", conf: 0.78 },
]

/** A scanned letter beside its extracted fields; hovering a field shows where its value came from. */
export function ExtractionMock() {
  const [active, setActive] = useState<Key | null>("code")
  const mark = (k: Key | Key[]) => cn("rounded-[3px] transition-colors", ([] as Key[]).concat(k).includes(active as Key) && "bg-brand-wash ring-2 ring-brand")

  return (
    <MockFrame title="Manajemen Metadata · Ekstraksi AI" bodyClassName="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="border-b border-border bg-mist/70 p-4 md:border-r md:border-b-0">
        <div className="rounded-md border border-border bg-white p-4 font-serif text-[12.5px] leading-relaxed text-navy shadow-[0_1px_3px_rgb(11_36_71/0.08)]">
          <div className="border-b-2 border-double border-navy pb-2 text-center font-sans">
            <p className="text-[12px] font-bold tracking-wide uppercase">Organisasi Contoh</p>
            <p className={cn("text-[11px] text-muted-foreground", mark("sender"))}>Sekretariat</p>
          </div>
          <div className="mt-3 grid grid-cols-[4.25rem_minmax(0,1fr)] gap-y-0.5">
            <span>Nomor</span>
            <span>: <span className={mark("number")}>UM.01.01/2026/233</span></span>
            <span>Perihal</span>
            <span>: <span className={mark(["subject", "code"])}>Undangan Rapat Koordinasi Pengelolaan Arsip</span></span>
          </div>
          <p className="mt-2 text-right"><span className={mark("date")}>4 Mei 2026</span></p>
          <p className="mt-2">Yth. Kepala Unit,</p>
          <p className="mt-2">
            Kami <span className={mark("code")}>mengundang</span> Bapak/Ibu menghadiri rapat koordinasi pengelolaan arsip pada Selasa, 12 Mei 2026, pukul
            09.00 WIB.
          </p>
          <p className="mt-3 text-right"><span className={mark("sender")}>Sekretaris</span></p>
        </div>
      </div>
      <div>
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-mist/70">
              {["Field", "Nilai", "Keyakinan"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr
                key={f.key}
                tabIndex={0}
                data-active={active === f.key}
                onMouseEnter={() => setActive(f.key)}
                onFocus={() => setActive(f.key)}
                onClick={() => setActive(f.key)}
                className={cn("cursor-default border-b border-border outline-none last:border-b-0 focus-visible:bg-brand-wash", active === f.key && "bg-brand-wash")}
              >
                <th scope="row" className="px-3 py-2.5 font-medium text-navy">{f.label}</th>
                <td className="px-3 py-2.5">
                  <span className="block">{f.value}</span>
                  {f.conf < 0.9 && <Badge variant="review" className="mt-1">Perlu review</Badge>}
                </td>
                <td className="px-3 py-2.5"><Confidence value={f.conf} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-border px-3 py-2.5 text-[12px] text-muted-foreground">Pilih baris untuk melihat sumber nilainya di dokumen.</p>
      </div>
    </MockFrame>
  )
}
