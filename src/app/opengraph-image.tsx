import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { sampleRecords, statusLabel, type Status } from "@/lib/sample"

export const alt = "Smart Records Center: platform tata kelola arsip digital"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const statusColor: Record<Status, string> = {
  active: "#0e7c7b",
  inactive: "#64748b",
  permanent: "#0b2447",
  pending: "#9a5b00",
  disposed: "#64748b",
}

const rows = sampleRecords.filter((r) => ["KEU-2026-000123", "HKM-2021-000014", "KEU-2024-000017", "PRC-2014-000001"].includes(r.no))

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"))
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0b2447", padding: 72, gap: 56, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={56} height={56} alt="" style={{ borderRadius: 14, border: "2px solid rgba(255,255,255,0.35)" }} />
          <div style={{ display: "flex", color: "#fff", fontSize: 30, letterSpacing: "-0.02em" }}>Smart Records Center</div>
        </div>
        <div style={{ display: "flex", marginTop: 56, color: "#fff", fontSize: 60, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
          Tata kelola arsip digital yang tertib, patuh, dan siap diaudit
        </div>
        <div style={{ display: "flex", marginTop: 28, color: "rgba(255,255,255,0.8)", fontSize: 26, lineHeight: 1.45 }}>
          Repositori, pencarian, metadata, klasifikasi, retensi, jejak audit, dan pelaporan dalam satu platform.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: 440, background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", color: "#0b2447", fontSize: 22 }}>Daftar arsip</div>
          <div style={{ display: "flex", color: "#526179", fontSize: 15 }}>Data contoh</div>
        </div>
        <div style={{ display: "flex", marginTop: 18, paddingBottom: 10, borderBottom: "1px solid #e2e8f0", color: "#526179", fontSize: 15 }}>
          <div style={{ display: "flex", width: 190 }}>No. arsip</div>
          <div style={{ display: "flex", width: 90 }}>Kode</div>
          <div style={{ display: "flex" }}>Status</div>
        </div>
        {rows.map((r) => (
          <div key={r.no} style={{ display: "flex", alignItems: "center", paddingTop: 14, paddingBottom: 14, borderBottom: "1px solid #e2e8f0", fontSize: 16, color: "#0b2447" }}>
            <div style={{ display: "flex", width: 190 }}>{r.no}</div>
            <div style={{ display: "flex", width: 90, color: "#3b4a5e" }}>{r.code}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: statusColor[r.status] }}>
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: statusColor[r.status] }} />
              {statusLabel[r.status]}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}
