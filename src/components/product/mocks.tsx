import { CheckIcon, FileTextIcon, KeyRoundIcon, LockIcon, SearchIcon, ShieldAlertIcon } from "lucide-react"

import { DashboardMock } from "@/components/product/dashboard"
import { ExtractionMock } from "@/components/product/extraction"
import { RegisterVerifier } from "@/components/product/register"
import { Code, Confidence, MockFrame, MockPanel, MockTable, SampleTag, StatusBadge } from "@/components/product/ui"
import { Badge } from "@/components/ui/badge"
import { sha256Hex } from "@/lib/chain"
import type { MockKey } from "@/lib/modules"
import { sampleClasses, sampleRecords, securityLabel } from "@/lib/sample"
import { cn } from "@/lib/utils"

// Controls inside a product picture are part of the picture, so they are spans, never live buttons.
const Fake = ({ children, primary }: { children: React.ReactNode; primary?: boolean }) => (
  <span aria-hidden className={cn("inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold", primary ? "border-brand bg-brand text-white" : "border-border bg-white text-navy")}>
    {children}
  </span>
)

// Marks a value or a queue that a model produced and a person still has to confirm.
const AiTag = ({ children = "Usulan AI" }: { children?: React.ReactNode }) => (
  <span className="inline-flex h-5 items-center rounded-[5px] bg-brand-wash px-1.5 text-[11px] font-semibold text-brand-ink">{children}</span>
)

// Amber is reserved for "Menunggu penyusutan"; a destroy outcome reads as struck grey.
const finalVariant = { Permanen: "permanent", Musnah: "disposed", "Dinilai kembali": "inactive" } as const

/* Repositori Arsip */

function TenantsMock() {
  const rows = [
    { org: "Instansi A", kind: "Pemerintah", space: "tn-0001", key: "kms/tn-0001/v4", users: 412 },
    { org: "BUMN B", kind: "BUMN", space: "tn-0002", key: "kms/tn-0002/v2", users: 1_180 },
    { org: "Bank C", kind: "Keuangan", space: "tn-0003", key: "kms/tn-0003/v7", users: 2_306 },
    { org: "Korporasi D", kind: "Korporasi", space: "tn-0004", key: "kms/tn-0004/v1", users: 96 },
  ]
  return (
    <MockFrame title="Repositori Arsip · Organisasi">
      <MockTable
        minWidth="38rem"
        rows={rows}
        cols={[
          { label: "Organisasi", cell: (r) => (
            <span className="flex flex-col">
              <span className="font-medium text-navy">{r.org}</span>
              <span className="text-[11.5px] text-muted-foreground">{r.kind}</span>
            </span>
          ) },
          { label: "Ruang data", cell: (r) => <Code>{r.space}</Code> },
          { label: "Kunci enkripsi", cell: (r) => (
            <span className="inline-flex items-center gap-1.5">
              <KeyRoundIcon className="size-3.5 text-muted-foreground" aria-hidden />
              <Code>{r.key}</Code>
            </span>
          ) },
          { label: "Pengguna", cell: (r) => r.users.toLocaleString("id-ID"), className: "tabular-nums" },
          { label: "Isolasi", cell: () => <Badge variant="active">Terpisah</Badge> },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        Setiap kueri dibatasi oleh <span className="code text-navy">tenant_id</span> milik pengguna sebelum menyentuh data.
      </p>
    </MockFrame>
  )
}

export function RecordsMock() {
  const filters = ["Semua", "Aktif", "Inaktif", "Permanen", "Menunggu penyusutan"]
  return (
    <MockFrame title="Repositori Arsip · Daftar Arsip">
      <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2.5 text-xs font-semibold">
        {filters.map((f, i) => (
          <span key={f} className={cn("rounded-md px-2.5 py-1.5", i === 0 ? "bg-navy text-white" : "text-body")}>{f}</span>
        ))}
      </div>
      <MockTable
        minWidth="40rem"
        rows={sampleRecords.slice(0, 7)}
        cols={[
          { label: "Nomor", cell: (r) => <Code>{r.no}</Code> },
          { label: "Judul", cell: (r) => <span className="font-medium text-navy">{r.title}</span> },
          { label: "Keamanan", cell: (r) => securityLabel[r.security] },
          { label: "Status", cell: (r) => (
            <span className="inline-flex items-center gap-1.5">
              <StatusBadge status={r.status} />
              {r.hold && <Badge variant="outline">Legal hold</Badge>}
            </span>
          ) },
        ]}
      />
    </MockFrame>
  )
}

function LifecycleMock() {
  const steps = [
    { d: "12 Mar 2026", t: "Diregistrasi", done: true },
    { d: "30 Apr 2026", t: "Berkas ditutup", done: true },
    { d: "30 Apr 2028", t: "Pindah ke inaktif" },
    { d: "30 Apr 2036", t: "Jatuh tempo" },
    { d: "", t: "Permanen" },
  ]
  return (
    <MockFrame title="Repositori Arsip · KEU-2026-000123">
      <div className="p-4 text-[13px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-navy">Laporan Keuangan Tahunan 2025</p>
            <p className="code text-[11.5px] text-muted-foreground">KU.01.02 · aktif 2 th · inaktif 8 th · permanen</p>
          </div>
          <StatusBadge status="active" />
        </div>
        <ol className="mt-5 grid grid-cols-5 gap-1">
          {steps.map((s, i) => (
            <li key={s.t} className="flex flex-col gap-2">
              <span className={cn("h-1.5 rounded-full", s.done ? "bg-teal" : i === 4 ? "bg-navy" : "bg-secondary")} />
              <span className="text-[11.5px] leading-tight font-semibold text-navy">{s.t}</span>
              <span className="code text-[11px] text-muted-foreground">{s.d || "tanpa batas"}</span>
            </li>
          ))}
        </ol>
      </div>
    </MockFrame>
  )
}

async function FixityMock() {
  const rows = [
    { f: "Rencana Strategis 2010-2014.pdf", copies: "3/3", ok: true },
    { f: "Laporan Keuangan Tahunan 2012.pdf", copies: "3/3", ok: true },
    { f: "Struktur Organisasi 2018.pdf", copies: "3/3", ok: true },
    { f: "Perjanjian Kerja Sama Penelitian.pdf", copies: "2/3", ok: false },
  ]
  const hashes = await Promise.all(rows.map((r) => sha256Hex(r.f)))
  return (
    <MockFrame title="Repositori Arsip · Pemeriksaan Keutuhan 1 Jul 2026">
      <MockTable
        minWidth="38rem"
        rows={rows.map((r, i) => ({ ...r, h: hashes[i] }))}
        cols={[
          { label: "Berkas", cell: (r) => <span className="font-medium text-navy">{r.f}</span> },
          { label: "SHA-256", cell: (r) => <span className="code text-[12px] text-muted-foreground">{r.h.slice(0, 12)}…</span> },
          { label: "Salinan", cell: (r) => r.copies, className: "tabular-nums" },
          { label: "Hasil", cell: (r) => (r.ok ? <Badge variant="active">Cocok</Badge> : <Badge variant="review">Dipulihkan dari salinan B</Badge>) },
        ]}
      />
    </MockFrame>
  )
}

function DuplicateMock() {
  const docs = [
    { no: "UMM-2026-000233", name: "Undangan Rapat Koordinasi", fmt: "PDF · 2 hlm", main: true },
    { no: "UMM-2026-000234", name: "Undangan Rapat Koordinasi (pindaian ulang)", fmt: "TIFF · 2 hlm" },
  ]
  return (
    <MockFrame title="Repositori Arsip · Deteksi Duplikat">
      <div className="p-4 text-[13px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <div key={d.no} className={cn("rounded-md border p-3", d.main ? "border-brand/60 bg-brand-wash/60" : "border-border")}>
              <div className="flex h-20 items-center justify-center rounded-[4px] border border-dashed border-border bg-white text-muted-foreground">
                <FileTextIcon className="size-6" aria-hidden />
              </div>
              <p className="mt-2 font-semibold text-navy">{d.name}</p>
              <p className="code text-[11.5px] text-muted-foreground">{d.no} · {d.fmt}</p>
              {d.main && <Badge variant="permanent" className="mt-2">Arsip utama</Badge>}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-mist px-3 py-2">
          <span className="inline-flex items-center gap-2">
            <AiTag>AI</AiTag> Kemiripan isi <b className="text-navy">0,96</b> · hash berbeda
          </span>
          <Fake primary>Tautkan sebagai duplikat</Fake>
        </div>
      </div>
    </MockFrame>
  )
}

/* Pencarian & Temu Kembali */

function SearchMock() {
  const hits = [
    { title: "Kontrak Pemeliharaan Gedung 2019-2021", no: "HKM-2021-000014", text: ["… ruang lingkup ", "pemeliharaan gedung", " kantor pusat meliputi sistem kelistrikan …"] },
    { title: "Addendum Perpanjangan Kontrak Pemeliharaan", no: "HKM-2021-000015", text: ["… jangka waktu ", "pemeliharaan gedung", " diperpanjang sampai 31 Desember 2021 …"] },
  ]
  return (
    <MockFrame title="Pencarian & Temu Kembali · Hasil Pencarian">
      <div className="p-4 text-[13px]">
        <div className="flex h-10 items-center gap-2 rounded-md border border-brand px-3 text-navy ring-3 ring-brand/15">
          <SearchIcon className="size-4 text-brand" aria-hidden />
          &quot;pemeliharaan gedung&quot; kode:HK.02.*
        </div>
        <p className="mt-2 text-xs text-muted-foreground">2 hasil · teks lengkap · 1 hasil disembunyikan sesuai hak akses</p>
        <ul className="mt-3 flex flex-col gap-2">
          {hits.map((h) => (
            <li key={h.no} className="rounded-md border border-border p-3">
              <p className="flex items-center gap-2 font-semibold text-navy">
                <FileTextIcon className="size-4 text-muted-foreground" aria-hidden />
                {h.title}
              </p>
              <p className="mt-1 text-body">
                {h.text[0]}
                <mark className="rounded-[3px] bg-brand-wash px-0.5 text-brand-ink">{h.text[1]}</mark>
                {h.text[2]}
              </p>
              <p className="code mt-1 text-[11.5px] text-muted-foreground">{h.no} · halaman 2</p>
            </li>
          ))}
        </ul>
      </div>
    </MockFrame>
  )
}

function FacetsMock() {
  const facets: [string, [string, number, boolean?][]][] = [
    ["Status", [["Aktif", 128, true], ["Inaktif", 342], ["Permanen", 17]]],
    ["Unit pengolah", [["Keuangan", 211, true], ["Hukum", 96], ["Pengadaan", 180]]],
    ["Tahun", [["2024 s.d. 2026", 205], ["2019 s.d. 2023", 282]]],
  ]
  const results = sampleRecords.filter((r) => r.unit === "Keuangan")
  return (
    <MockFrame title="Pencarian & Temu Kembali · Filter Metadata" bodyClassName="grid text-[13px] sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-4 border-b border-border bg-mist/60 p-4 sm:border-r sm:border-b-0">
        {facets.map(([name, opts]) => (
          <div key={name}>
            <p className="text-xs font-semibold text-navy">{name}</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {opts.map(([o, n, on]) => (
                <li key={o} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className={cn("flex size-3.5 items-center justify-center rounded-[3px] border", on ? "border-brand bg-brand text-white" : "border-input bg-white")}>
                      {on && <CheckIcon className="size-2.5" />}
                    </span>
                    {o}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="min-w-0 p-4">
        <p className="text-xs text-muted-foreground">
          <b className="text-navy">Status: Aktif</b> dan <b className="text-navy">Unit: Keuangan</b> · 2 dari 128 arsip ditampilkan
        </p>
        <ul className="mt-3 flex flex-col divide-y divide-border rounded-md border border-border">
          {results.map((r) => (
            <li key={r.no} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate font-medium text-navy">{r.title}</span>
                <span className="code text-[11.5px] text-muted-foreground">{r.no} · {r.code}</span>
              </span>
              <StatusBadge status={r.status} short />
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-end gap-2">
          <Fake>Simpan pencarian</Fake>
          <Fake>Ekspor daftar</Fake>
        </p>
      </div>
    </MockFrame>
  )
}

function SemanticMock() {
  const hits = [
    { title: "Perjanjian Sewa Ruang Kantor Cabang Medan", no: "HKM-2023-000041", why: "jangka waktu sewa berakhir 31 Desember 2026", conf: 0.94 },
    { title: "Kontrak Sewa Gudang Arsip Cikarang", no: "HKM-2024-000007", why: "masa berlaku sampai 30 November 2026", conf: 0.91 },
    { title: "Pindaian Addendum Sewa Gedung 2021", no: "HKM-2021-000052", why: "OCR halaman 3 kurang jelas, perlu diperiksa", conf: 0.72 },
  ]
  return (
    <MockFrame title="Pencarian & Temu Kembali · Pencarian Makna">
      <div className="p-4 text-[13px]">
        <div className="flex h-10 items-center gap-2 rounded-md border border-brand px-3 text-navy ring-3 ring-brand/15">
          <SearchIcon className="size-4 text-brand" aria-hidden />
          <span className="truncate">kontrak sewa gedung yang habis tahun ini</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <AiTag>AI</AiTag> pencarian makna dan kata kunci · disaring hak akses
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {hits.map((h) => (
            <li key={h.no} className="rounded-md border border-border p-3">
              <p className="flex items-start justify-between gap-3">
                <span className="font-semibold text-navy">{h.title}</span>
                <Confidence value={h.conf} />
              </p>
              <p className="mt-1 text-body">
                Cocok karena: <span className="text-navy">{h.why}</span>
              </p>
              <p className="code mt-1 text-[11.5px] text-muted-foreground">{h.no}</p>
            </li>
          ))}
        </ul>
      </div>
    </MockFrame>
  )
}

function AccessMock() {
  const levels = ["Biasa", "Terbatas", "Rahasia", "Sangat Rahasia"]
  const roles: [string, ("rw" | "r" | "x")[]][] = [
    ["Arsiparis", ["rw", "rw", "rw", "r"]],
    ["Unit Keuangan", ["rw", "rw", "r", "x"]],
    ["Unit Pengadaan", ["r", "r", "x", "x"]],
    ["Auditor", ["r", "r", "r", "r"]],
  ]
  const cell = { rw: ["Baca + unduh", CheckIcon, "text-teal-ink"], r: ["Baca", CheckIcon, "text-body"], x: ["Tidak", LockIcon, "text-muted-foreground"] } as const
  return (
    <MockFrame title="Pencarian & Temu Kembali · Matriks Hak Akses">
      <MockTable
        rows={roles}
        cols={[
          { label: "Peran", cell: (r) => <span className="font-medium text-navy">{r[0]}</span> },
          ...levels.map((l, i) => ({
            label: l,
            cell: (r: (typeof roles)[number]) => {
              const [label, Icon, cls] = cell[r[1][i]]
              return (
                <span className={cn("inline-flex items-center gap-1.5", cls)}>
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </span>
              )
            },
          })),
        ]}
      />
    </MockFrame>
  )
}

/* Manajemen Metadata */

function MetadataMock() {
  const rows = [
    { el: "Judul", dc: "dc:title", req: true, val: "Laporan Keuangan Tahunan 2025" },
    { el: "Pencipta", dc: "dc:creator", req: true, val: "Bagian Akuntansi" },
    { el: "Tanggal", dc: "dc:date", req: true, val: "2026-03-12" },
    { el: "Format", dc: "dc:format", req: true, val: "application/pdf; PDF/A-2b" },
    { el: "Kode klasifikasi", dc: "perluasan", req: true, val: "KU.01.02" },
    { el: "Tingkat keamanan", dc: "perluasan", req: true, val: "Terbatas" },
    { el: "Hubungan", dc: "dc:relation", req: false, val: "KEU-2025-000098 (draf)" },
  ]
  return (
    <MockFrame title="Manajemen Metadata · Skema Arsip Keuangan">
      <MockTable
        minWidth="36rem"
        rows={rows}
        cols={[
          { label: "Elemen", cell: (r) => (
            <span className="font-medium text-navy">
              {r.el}
              {r.req && <span className="ml-1 text-destructive" aria-label="wajib">*</span>}
            </span>
          ) },
          { label: "Pemetaan", cell: (r) => (r.dc === "perluasan" ? <Badge variant="outline">Perluasan</Badge> : <Code>{r.dc}</Code>) },
          { label: "Nilai", cell: (r) => <span className="text-body">{r.val}</span> },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        Dublin Core diperluas · metadata manajemen arsip mengacu ISO 23081 · skema v2
      </p>
    </MockFrame>
  )
}

function ValidationMock() {
  const rows = [
    { no: "UMM-2026-000301", title: "Surat Masuk Kementerian 0921", miss: "Kode klasifikasi", src: "Unggahan email" },
    { no: "KEU-2026-000412", title: "Bukti Transfer Vendor Agustus", miss: "Pencipta, tanggal", src: "Pemindai lantai 3" },
    { no: "HKM-2026-000077", title: "Draf Nota Kesepahaman", miss: "Tingkat keamanan", src: "Unggahan manual" },
  ]
  return (
    <MockFrame title="Manajemen Metadata · Antrean Kelengkapan">
      <MockTable
        minWidth="36rem"
        rows={rows}
        cols={[
          { label: "Arsip", cell: (r) => (
            <span className="flex flex-col">
              <span className="font-medium text-navy">{r.title}</span>
              <Code>{r.no}</Code>
            </span>
          ) },
          { label: "Field wajib kosong", cell: (r) => <Badge variant="review">{r.miss}</Badge> },
          { label: "Sumber", cell: (r) => r.src },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        Arsip di antrean ini belum dapat ditetapkan sebagai arsip final.
      </p>
    </MockFrame>
  )
}

function HistoryMock() {
  const rows = [
    { at: "12 Mar 2026 09.14", field: "Pencipta", from: "(kosong)", to: "Bagian Akuntansi", by: "ai/ekstraksi-v3", why: "Ekstraksi, keyakinan 0,96" },
    { at: "12 Mar 2026 10.02", field: "Pencipta", from: "Bagian Akuntansi", to: "Divisi Akuntansi", by: "arsiparis#12", why: "Nama unit sesuai SOTK 2026" },
    { at: "30 Apr 2026 16.40", field: "Status berkas", from: "Terbuka", to: "Ditutup", by: "keuangan#07", why: "Laporan disahkan" },
  ]
  return (
    <MockFrame title="Manajemen Metadata · Riwayat KEU-2026-000123">
      <MockTable
        minWidth="42rem"
        rows={rows}
        cols={[
          { label: "Waktu", cell: (r) => <span className="code text-[12px] whitespace-nowrap text-muted-foreground">{r.at}</span> },
          { label: "Field", cell: (r) => <span className="font-medium text-navy">{r.field}</span> },
          { label: "Perubahan", cell: (r) => (
            <span>
              <span className="text-muted-foreground line-through">{r.from}</span> <span aria-hidden>→</span> <span className="text-navy">{r.to}</span>
            </span>
          ) },
          { label: "Oleh", cell: (r) => <Code>{r.by}</Code> },
          { label: "Alasan", cell: (r) => r.why },
        ]}
      />
    </MockFrame>
  )
}

/* Klasifikasi Arsip */

function BcsMock() {
  const tree = [
    { code: "KU", name: "Keuangan", depth: 0 },
    { code: "KU.01", name: "Pelaporan keuangan", depth: 1 },
    { code: "KU.01.02", name: "Laporan keuangan tahunan", depth: 2, on: true },
    { code: "KU.02", name: "Pembayaran", depth: 1 },
    { code: "KU.02.01", name: "Bukti pembayaran", depth: 2 },
    { code: "HK", name: "Hukum", depth: 0 },
    { code: "HK.02.01", name: "Kontrak dan perjanjian", depth: 2 },
  ]
  return (
    <MockFrame title="Klasifikasi Arsip · Skema Klasifikasi">
      <div className="grid text-[13px] sm:grid-cols-[minmax(0,1fr)_14rem]">
        <ul className="border-b border-border p-3 sm:border-r sm:border-b-0">
          {tree.map((t) => (
            <li key={t.code} className={cn("flex items-center gap-2 rounded-md py-1.5 pr-2", t.on && "bg-brand-wash")} style={{ paddingLeft: `${0.5 + t.depth * 1.1}rem` }}>
              <Code>{t.code}</Code>
              <span className={cn("truncate", t.depth === 0 ? "font-semibold text-navy" : "text-body")}>{t.name}</span>
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 p-4 text-[12.5px] sm:grid-cols-1">
          <div><dt className="text-muted-foreground">Kode</dt><dd><Code>KU.01.02</Code></dd></div>
          <div><dt className="text-muted-foreground">Retensi aktif</dt><dd className="font-semibold text-navy">2 tahun</dd></div>
          <div><dt className="text-muted-foreground">Retensi inaktif</dt><dd className="font-semibold text-navy">8 tahun</dd></div>
          <div><dt className="text-muted-foreground">Nasib akhir</dt><dd><Badge variant="permanent">Permanen</Badge></dd></div>
          <div><dt className="text-muted-foreground">Arsip terkait</dt><dd className="font-semibold text-navy">128</dd></div>
        </dl>
      </div>
    </MockFrame>
  )
}

function VersionsMock() {
  const rows = [
    { v: "v3", from: "1 Jan 2026", change: "4 kode baru, 2 kode digabung", by: "Sekretaris organisasi", st: "Berlaku" },
    { v: "v2", from: "1 Jul 2023", change: "Penyesuaian unit setelah reorganisasi", by: "Sekretaris organisasi", st: "Diganti" },
    { v: "v1", from: "3 Feb 2020", change: "Skema awal, 214 kode", by: "Kepala unit kearsipan", st: "Diganti" },
  ]
  return (
    <MockFrame title="Klasifikasi Arsip · Versi Skema">
      <div className="p-4">
        <MockPanel title="Skema Klasifikasi Arsip" sub="Versi berlaku v3 · 226 kode aktif" action={<Fake>Ajukan perubahan</Fake>}>
          <MockTable
            minWidth="34rem"
            rows={rows}
            cols={[
              { label: "Versi", cell: (r) => <Code>{r.v}</Code> },
              { label: "Berlaku sejak", cell: (r) => <span className="whitespace-nowrap">{r.from}</span> },
              { label: "Perubahan", cell: (r) => r.change },
              { label: "Status", cell: (r) => <Badge variant={r.st === "Berlaku" ? "active" : "inactive"}>{r.st}</Badge> },
            ]}
          />
        </MockPanel>
      </div>
    </MockFrame>
  )
}

function ClassifyMock() {
  const rows = [
    { doc: "Laporan Keuangan Tahunan 2025.pdf", code: "KU.01.02", conf: 0.97 },
    { doc: "Kontrak Jasa Kebersihan 2026.pdf", code: "HK.02.01", conf: 0.93 },
    { doc: "Undangan Rapat Koordinasi.pdf", code: "UM.01.01", conf: 0.78 },
    { doc: "Rekap Gaji Januari 2026.pdf", code: "KU.02.01", conf: 0.64 },
  ]
  return (
    <MockFrame title="Klasifikasi Arsip · Antrean Usulan AI">
      <MockTable
        minWidth="36rem"
        rows={rows}
        cols={[
          { label: "Dokumen", cell: (r) => <span className="font-medium text-navy">{r.doc}</span> },
          { label: "Usulan kode", cell: (r) => <Code>{r.code}</Code> },
          { label: "Keyakinan", cell: (r) => <Confidence value={r.conf} /> },
          { label: "Tindakan", cell: (r) => (r.conf >= 0.9 ? <Fake primary>Konfirmasi</Fake> : <Badge variant="review">Perlu review</Badge>) },
        ]}
      />
    </MockFrame>
  )
}

/* Retensi & Penyusutan */

export function RetentionMock() {
  return (
    <MockFrame title="Retensi & Penyusutan · Jadwal Retensi Arsip">
      <MockTable
        rows={sampleClasses}
        cols={[
          { label: "Kode", cell: (r) => <Code>{r.code}</Code> },
          { label: "Seri arsip", cell: (r) => <span className="font-medium text-navy">{r.series}</span> },
          { label: "Aktif", cell: (r) => `${r.active} th`, className: "tabular-nums" },
          { label: "Inaktif", cell: (r) => `${r.inactive} th`, className: "tabular-nums" },
          { label: "Nasib akhir", cell: (r) => <Badge variant={finalVariant[r.final]}>{r.final}</Badge> },
        ]}
      />
    </MockFrame>
  )
}

function DispositionMock() {
  const items = [
    { no: "PGD-2015-000041", title: "Pengadaan Alat Tulis Kantor 2015", act: "Musnah", ok: true },
    { no: "KEU-2015-000088", title: "Bukti Pembayaran Vendor 2015", act: "Musnah", ok: true },
    { no: "SKR-2022-000512", title: "Korespondensi Umum 2022", act: "Musnah", ok: true },
    { no: "PGD-2014-000033", title: "Pengadaan Kendaraan Operasional 2014", act: "Dikecualikan: legal hold", ok: false },
  ]
  return (
    <MockFrame title="Retensi & Penyusutan · Batch PNY-2026-0007">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 text-[12.5px]">
        <div>
          <p className="font-semibold text-navy">Usulan pemusnahan arsip</p>
          <p className="text-muted-foreground">Pengusul: arsiparis#12 · Penyetuju: kepala unit kearsipan</p>
        </div>
        <Badge variant="pending">Menunggu persetujuan</Badge>
      </div>
      <MockTable
        rows={items}
        cols={[
          { label: "Nomor", cell: (r) => <Code>{r.no}</Code> },
          { label: "Judul", cell: (r) => <span className={cn(!r.ok && "text-muted-foreground")}>{r.title}</span> },
          { label: "Keputusan", cell: (r) => (r.ok ? <Badge variant="outline">{r.act}</Badge> : <Badge variant="inactive">{r.act}</Badge>) },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-mist/60 px-4 py-3 text-[12.5px]">
        <span className="text-muted-foreground">Berita acara dibuat otomatis setelah disetujui.</span>
        <span className="flex gap-2">
          <Fake>Tolak</Fake>
          <Fake primary>Setujui batch</Fake>
        </span>
      </div>
    </MockFrame>
  )
}

function TransferMock() {
  const steps = ["Disiapkan", "Divalidasi", "Dikirim", "Diterima"]
  return (
    <MockFrame title="Retensi & Penyusutan · Paket Penyerahan">
      <div className="p-4 text-[13px]">
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", i < 2 ? "bg-navy text-white" : "border border-border text-muted-foreground")}>
                {i < 2 ? <CheckIcon className="size-3.5" aria-hidden /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-semibold sm:inline", i < 2 ? "text-navy" : "text-muted-foreground")}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>
        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-mist p-3 text-[12.5px]">
          <div><dt className="text-muted-foreground">Arsip</dt><dd className="font-semibold text-navy">24 arsip permanen</dd></div>
          <div><dt className="text-muted-foreground">Berkas</dt><dd className="font-semibold text-navy">318 berkas · PDF/A</dd></div>
          <div><dt className="text-muted-foreground">Manifest</dt><dd><Code>sha256 · 318 entri</Code></dd></div>
          <div><dt className="text-muted-foreground">Penerima</dt><dd className="font-semibold text-navy">Lembaga kearsipan</dd></div>
        </dl>
      </div>
    </MockFrame>
  )
}

function HoldMock() {
  const holds = [
    { no: "PGD-2014-000033", basis: "Pemeriksaan internal pengadaan 2014", by: "hukum#03", since: "5 Agu 2026" },
    { no: "HKM-2016-000021", basis: "Sengketa kontrak pengadaan server", by: "hukum#01", since: "12 Mar 2025" },
  ]
  return (
    <MockFrame title="Retensi & Penyusutan · Legal Hold">
      <MockTable
        minWidth="36rem"
        rows={holds}
        cols={[
          { label: "Arsip", cell: (r) => <Code>{r.no}</Code> },
          { label: "Dasar hold", cell: (r) => <span className="font-medium text-navy">{r.basis}</span> },
          { label: "Pemohon", cell: (r) => <Code>{r.by}</Code> },
          { label: "Sejak", cell: (r) => r.since },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        Arsip dalam hold dikeluarkan dari batch <span className="code text-navy">PNY-2026-0007</span>.
      </p>
    </MockFrame>
  )
}

function RiskMock() {
  const rows = [
    { what: "NIK terdeteksi", val: "3171********0001", doc: "SDM-2011-004512", lvl: "Tinggi" },
    { what: "Nomor rekening", val: "37 nilai tersamar", doc: "KEU-2026-000009", lvl: "Tinggi" },
    { what: "Kemungkinan salah klasifikasi", val: "KU.02.01 → KP.02.03", doc: "KEU-2026-000009", lvl: "Sedang" },
  ]
  return (
    <MockFrame title="Retensi & Penyusutan · Temuan Risiko AI">
      <MockTable
        minWidth="36rem"
        rows={rows}
        cols={[
          { label: "Temuan", cell: (r) => <span className="inline-flex items-center gap-1.5 font-medium text-navy"><ShieldAlertIcon className="size-3.5 text-st-pending" aria-hidden />{r.what}</span> },
          { label: "Nilai", cell: (r) => <Code>{r.val}</Code> },
          { label: "Arsip", cell: (r) => <Code>{r.doc}</Code> },
          { label: "Tingkat", cell: (r) => <Badge variant={r.lvl === "Tinggi" ? "review" : "inactive"}>{r.lvl}</Badge> },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">Arsip bertanda risiko ditahan dari usulan penyusutan sampai direview.</p>
    </MockFrame>
  )
}

/* Jejak Audit */

function EvidenceMock() {
  return (
    <MockFrame title="Jejak Audit · Paket Bukti PKT-2026-0011">
      <div className="p-4 text-[13px]">
        <dl className="grid grid-cols-2 gap-3">
          <div><dt className="text-muted-foreground">Pemohon</dt><dd className="font-semibold text-navy">auditor#02</dd></div>
          <div><dt className="text-muted-foreground">Tujuan</dt><dd className="font-semibold text-navy">Audit internal</dd></div>
          <div><dt className="text-muted-foreground">Isi</dt><dd className="font-semibold text-navy">3 arsip · 42 berkas</dd></div>
          <div><dt className="text-muted-foreground">Log audit</dt><dd className="font-semibold text-navy">Entri 1 sampai 10</dd></div>
        </dl>
        <div className="mt-4 rounded-md bg-mist p-3">
          <p className="text-xs font-semibold text-navy">manifest.json</p>
          <p className="code mt-1 text-[11.5px] leading-relaxed break-all text-muted-foreground">
            arsip/KEU-2021-000017/berkas-01.pdf sha256 5f2c…a91e<br />
            arsip/KEU-2021-000017/metadata.json sha256 0b7d…33c4<br />
            log/entri-001-010.json sha256 e41a…7f02
          </p>
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-ink"><CheckIcon className="size-3.5" aria-hidden />Rantai log terverifikasi</span>
          <Fake primary>Unduh paket</Fake>
        </p>
      </div>
    </MockFrame>
  )
}

function AnomalyMock() {
  const rows = [
    { who: "staf#221", what: "Mengunduh 184 arsip Rahasia pukul 23.10 sampai 23.40", base: "entri 48.201 s.d. 48.385", lvl: "Tinggi", st: "Ditinjau" },
    { who: "staf#087", what: "9 kali akses ditolak ke berkas kepegawaian", base: "entri 47.990 s.d. 48.012", lvl: "Sedang", st: "Baru" },
  ]
  return (
    <MockFrame title="Jejak Audit · Temuan Akses Tidak Wajar">
      <MockTable
        minWidth="40rem"
        rows={rows}
        cols={[
          { label: "Pengguna", cell: (r) => <Code>{r.who}</Code> },
          { label: "Pola", cell: (r) => <span className="text-navy">{r.what}</span> },
          { label: "Dasar", cell: (r) => <span className="code text-[12px] whitespace-nowrap text-muted-foreground">{r.base}</span> },
          { label: "Tingkat", cell: (r) => <Badge variant={r.lvl === "Tinggi" ? "review" : "inactive"}>{r.lvl}</Badge> },
          { label: "Status", cell: (r) => r.st },
        ]}
      />
      <p className="flex items-center gap-2 border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        <AiTag>AI</AiTag> Temuan dikirim ke petugas keamanan. Tidak ada akun yang diblokir otomatis.
      </p>
    </MockFrame>
  )
}

/* Pelaporan */

function Meter({ label, value, target, unit = "%" }: { label: string; value: number; target: number; unit?: string }) {
  const ok = value >= target
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-navy">{label}</span>
        <span className="tabular-nums">
          <b className="text-navy">{value.toLocaleString("id-ID")}{unit}</b>
          <span className="text-[11.5px] text-muted-foreground"> / target {target}{unit}</span>
        </span>
      </p>
      <span aria-hidden className="relative h-1.5 rounded-full bg-secondary">
        <span className={cn("absolute inset-y-0 left-0 rounded-full", ok ? "bg-teal" : "bg-st-pending")} style={{ width: `${value}%` }} />
        <span className="absolute -inset-y-1 w-px bg-navy/50" style={{ left: `${target}%` }} />
      </span>
    </div>
  )
}

function ReportsMock() {
  const units = [
    { u: "Keuangan", c: 98.9, m: 97.2, late: 0 },
    { u: "Hukum", c: 97.1, m: 92.4, late: 4 },
    { u: "Pengadaan", c: 91.8, m: 84.0, late: 33 },
  ]
  return (
    <MockFrame title="Pelaporan · Dasbor Kepatuhan Triwulan III 2026" bodyClassName="grid gap-4 p-4 text-[13px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-3.5">
        <Meter label="Arsip terklasifikasi" value={96.4} target={98} />
        <Meter label="Metadata wajib lengkap" value={91.2} target={95} />
        <Meter label="Perpindahan retensi tepat waktu" value={99.1} target={98} />
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border px-3 py-2">
            <p className="text-[11.5px] text-muted-foreground">Penyusutan tertunda</p>
            <p className="text-base font-bold text-navy tabular-nums">37 arsip</p>
          </div>
          <div className="rounded-md border border-border px-3 py-2">
            <p className="text-[11.5px] text-muted-foreground">Rantai jejak audit</p>
            <p className="inline-flex items-center gap-1 text-base font-bold text-teal-ink"><CheckIcon className="size-4" aria-hidden />Utuh</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 overflow-hidden rounded-md border border-border">
        <p className="border-b border-border px-3 py-2 text-xs font-semibold text-navy">Per unit pengolah</p>
        <table className="w-full text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-mist/70 text-[11px] text-muted-foreground">
              <th scope="col" className="px-3 py-1.5 font-semibold">Unit</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">Klasifikasi</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">Metadata</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">Tertunda</th>
            </tr>
          </thead>
          <tbody>
            {units.map((r) => (
              <tr key={r.u} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-navy">{r.u}</td>
                <td className="px-3 py-2 tabular-nums">{r.c.toLocaleString("id-ID")}%</td>
                <td className={cn("px-3 py-2 tabular-nums", r.m < 90 && "font-semibold text-st-pending")}>{r.m.toLocaleString("id-ID")}%</td>
                <td className="px-3 py-2 tabular-nums">{r.late}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockFrame>
  )
}

function RegulatorMock() {
  const rows = [
    { name: "Laporan Penyusutan Arsip Semester I", to: "Lembaga pembina kearsipan", per: "Jan s.d. Jun 2026", st: "Terkirim" },
    { name: "Daftar Arsip Vital", to: "Pimpinan organisasi", per: "Per 30 Sep 2026", st: "Draf" },
    { name: "Rekap Jejak Audit Akses Rahasia", to: "Satuan pemeriksa internal", per: "Triwulan III 2026", st: "Terjadwal" },
  ]
  const variant = { Terkirim: "active", Draf: "review", Terjadwal: "inactive" } as const
  return (
    <MockFrame title="Pelaporan · Laporan Berkala">
      <MockTable
        minWidth="40rem"
        rows={rows}
        cols={[
          { label: "Laporan", cell: (r) => <span className="font-medium text-navy">{r.name}</span> },
          { label: "Penerima", cell: (r) => r.to },
          { label: "Periode", cell: (r) => <span className="whitespace-nowrap">{r.per}</span> },
          { label: "Status", cell: (r) => <Badge variant={variant[r.st as keyof typeof variant]}>{r.st}</Badge> },
        ]}
      />
      <p className="border-t border-border bg-mist/60 px-4 py-2.5 text-[12.5px] text-muted-foreground">
        Setiap laporan menyimpan hash dan waktu pembuatan. Templat menyesuaikan format penerima.
      </p>
    </MockFrame>
  )
}

function SummaryMock() {
  return (
    <MockFrame title="Pelaporan · Draf Ringkasan Triwulan III">
      <div className="p-4 text-[13px]">
        <p className="flex items-center justify-between gap-3">
          <AiTag>Draf AI · menunggu tinjauan</AiTag>
          <span className="text-[11.5px] text-muted-foreground">ai/ringkasan-v1 · 1 Okt 2026</span>
        </p>
        <div className="mt-3 flex flex-col gap-2.5 rounded-md border border-border p-3 leading-relaxed text-body">
          <p>
            Kelengkapan metadata wajib turun menjadi 91,2% <sup className="font-semibold text-brand">[1]</sup>, terutama di Unit Pengadaan (84,0%) <sup className="font-semibold text-brand">[2]</sup>.
          </p>
          <p>
            33 dari 37 arsip yang tertunda penyusutannya berasal dari unit yang sama <sup className="font-semibold text-brand">[3]</sup>. Rantai jejak audit terverifikasi utuh pada 30 September <sup className="font-semibold text-brand">[4]</sup>.
          </p>
        </div>
        <ol className="code mt-2 flex flex-col gap-0.5 text-[11.5px] text-muted-foreground">
          <li>[1] indikator.metadata_wajib · TW III</li>
          <li>[2] indikator.metadata_wajib · unit=Pengadaan</li>
          <li>[3] penyusutan.tertunda · unit=Pengadaan</li>
          <li>[4] verifikasi.rantai · 2026-09-30</li>
        </ol>
        <p className="mt-3 flex justify-end gap-2">
          <Fake>Ubah</Fake>
          <Fake primary>Setujui dan lampirkan</Fake>
        </p>
      </div>
    </MockFrame>
  )
}

const registry: Record<MockKey, () => React.ReactNode | Promise<React.ReactNode>> = {
  tenants: TenantsMock,
  records: RecordsMock,
  lifecycle: LifecycleMock,
  fixity: FixityMock,
  duplicate: DuplicateMock,
  search: SearchMock,
  facets: FacetsMock,
  semantic: SemanticMock,
  access: AccessMock,
  metadata: MetadataMock,
  validation: ValidationMock,
  history: HistoryMock,
  extraction: () => <ExtractionMock />,
  bcs: BcsMock,
  versions: VersionsMock,
  classify: ClassifyMock,
  retention: RetentionMock,
  disposition: DispositionMock,
  transfer: TransferMock,
  hold: HoldMock,
  risk: RiskMock,
  register: () => <RegisterVerifier />,
  evidence: EvidenceMock,
  anomaly: AnomalyMock,
  reports: ReportsMock,
  dashboard: () => <DashboardMock />,
  regulator: RegulatorMock,
  summary: SummaryMock,
}

export function ProductMock({ k }: { k: MockKey }) {
  const M = registry[k]
  return <M />
}

export { SampleTag }
