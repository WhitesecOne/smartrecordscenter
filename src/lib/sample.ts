// Synthetic sample data for the product UI shown on the website.
// Every surface that renders it carries a visible "Data contoh" label.
import type { Entry } from "./chain.ts"

export type Status = "active" | "inactive" | "permanent" | "pending" | "disposed"
export type Security = "biasa" | "terbatas" | "rahasia" | "sangat-rahasia"

export const statusLabel: Record<Status, string> = {
  active: "Aktif",
  inactive: "Inaktif",
  permanent: "Permanen",
  pending: "Menunggu penyusutan",
  disposed: "Musnah",
}

export const securityLabel: Record<Security, string> = {
  biasa: "Biasa",
  terbatas: "Terbatas",
  rahasia: "Rahasia",
  "sangat-rahasia": "Sangat Rahasia",
}

export type SampleRecord = {
  no: string
  title: string
  code: string
  unit: string
  status: Status
  security: Security
  due: string
  hold?: boolean
}

export const sampleRecords: SampleRecord[] = [
  { no: "KEU-2026-000123", title: "Laporan Keuangan Tahunan 2025", code: "KU.01.02", unit: "Keuangan", status: "active", security: "terbatas", due: "2028-04-30" },
  { no: "HKM-2021-000014", title: "Kontrak Pemeliharaan Gedung 2019-2021", code: "HK.02.01", unit: "Hukum", status: "active", security: "terbatas", due: "2026-12-31" },
  { no: "KEU-2024-000017", title: "Bukti Pembayaran Vendor Triwulan I 2024", code: "KU.02.01", unit: "Keuangan", status: "inactive", security: "terbatas", due: "2034-04-05" },
  { no: "SDM-2011-004512", title: "Berkas Kepegawaian No. Induk 04512", code: "KP.03.01", unit: "SDM", status: "active", security: "rahasia", due: "Ditutup saat pensiun" },
  { no: "PGD-2014-000033", title: "Pengadaan Kendaraan Operasional 2014", code: "PL.01.03", unit: "Pengadaan", status: "pending", security: "terbatas", due: "2024-12-15", hold: true },
  { no: "PGD-2015-000041", title: "Pengadaan Alat Tulis Kantor 2015", code: "PL.01.03", unit: "Pengadaan", status: "pending", security: "biasa", due: "2025-11-20" },
  { no: "PRC-2014-000001", title: "Rencana Strategis 2010-2014", code: "PR.02.01", unit: "Perencanaan", status: "permanent", security: "biasa", due: "Permanen" },
  { no: "SKR-2020-000468", title: "Korespondensi Umum 2020", code: "UM.01.01", unit: "Sekretariat", status: "disposed", security: "biasa", due: "PNY-2024-0003" },
]

export type SampleClass = { code: string; series: string; active: number; inactive: number; final: "Permanen" | "Musnah" | "Dinilai kembali" }

export const sampleClasses: SampleClass[] = [
  { code: "KU.01.02", series: "Laporan keuangan tahunan", active: 2, inactive: 8, final: "Permanen" },
  { code: "KU.02.01", series: "Bukti pembayaran", active: 2, inactive: 8, final: "Musnah" },
  { code: "KP.03.01", series: "Berkas kepegawaian", active: 5, inactive: 20, final: "Dinilai kembali" },
  { code: "HK.02.01", series: "Kontrak dan perjanjian", active: 5, inactive: 10, final: "Permanen" },
  { code: "PL.01.03", series: "Pengadaan barang dan jasa", active: 2, inactive: 8, final: "Musnah" },
  { code: "UM.01.01", series: "Korespondensi umum", active: 1, inactive: 2, final: "Musnah" },
]

export const registerEntries: Entry[] = [
  { seq: 1, at: "2026-06-02T01:12:44Z", actor: "sistem", action: "arsip.diterima", target: "UMM-2026-000233", detail: "halaman=2 format=PDF sumber=email" },
  { seq: 2, at: "2026-06-02T01:12:51Z", actor: "ai/klasifikasi-v2", action: "ai.usulan", target: "UMM-2026-000233", detail: "kode=UM.01.01 keyakinan=0.78 review=wajib" },
  { seq: 3, at: "2026-06-03T03:40:09Z", actor: "arsiparis#12", action: "ai.dikonfirmasi", target: "UMM-2026-000233", detail: "kode=UM.01.01" },
  { seq: 4, at: "2026-06-14T07:02:18Z", actor: "sistem", action: "arsip.status", target: "KEU-2024-000017", detail: "aktif->inaktif aturan=KU.02.01 kebijakan=v3" },
  { seq: 5, at: "2026-07-01T02:00:00Z", actor: "sistem", action: "fixity.cek", target: "PRC-2014-000001", detail: "sha256=cocok salinan=2/2" },
  { seq: 6, at: "2026-07-09T04:25:37Z", actor: "ai/risiko-v1", action: "risiko.temuan", target: "KEU-2026-000009", detail: "jenis=nomor_rekening jumlah=37 keamanan=terbatas->rahasia" },
  { seq: 7, at: "2026-07-22T06:48:10Z", actor: "staf#221", action: "akses.ditolak", target: "SDM-2011-004512", detail: "unit=Pengadaan wajib=SDM keamanan=rahasia" },
  { seq: 8, at: "2026-08-05T02:31:55Z", actor: "hukum#03", action: "hold.dipasang", target: "PGD-2014-000033", detail: "dasar=pemeriksaan-internal" },
  { seq: 9, at: "2026-09-01T01:00:00Z", actor: "sistem", action: "penyusutan.usulan", target: "PNY-2026-0007", detail: "item=4 dikecualikan_hold=1" },
  { seq: 10, at: "2026-09-18T08:14:03Z", actor: "auditor#02", action: "bukti.ekspor", target: "PKT-2026-0011", detail: "arsip=3 tujuan=audit-internal" },
]
