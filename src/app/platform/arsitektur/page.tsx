import { CheckIcon } from "lucide-react"
import type { Metadata } from "next"

import { ArchitectureDiagram } from "@/components/architecture-diagram"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { ogBase } from "@/lib/site"

const description =
  "Arsitektur Smart Records Center: pemisahan data per organisasi, layanan API, PostgreSQL, object storage write-once, worker AI terisolasi, serta integrasi melalui API dan webhook."

export const metadata: Metadata = {
  title: "Arsitektur & Integrasi",
  description,
  alternates: { canonical: "/platform/arsitektur" },
  openGraph: { ...ogBase, url: "/platform/arsitektur", title: "Arsitektur & Integrasi", description },
}

const principles = [
  { title: "Satu pintu ke data", text: "Hanya layanan API yang memegang akses ke database, storage, dan kunci enkripsi. Aturan kearsipan dan penulisan audit ada di satu tempat." },
  { title: "Terpisah per organisasi", text: "Setiap baris data membawa penanda organisasi dan setiap kueri dibatasi olehnya. Berkas dienkripsi dengan kunci milik organisasi masing-masing." },
  { title: "Isi dokumen diperlakukan tidak tepercaya", text: "Worker AI dan worker keutuhan berkas berjalan terisolasi, tanpa akses database dan tanpa kunci, dengan batas waktu dan sumber daya." },
  { title: "Tidak ada penghapusan diam-diam", text: "Tidak ada endpoint hapus arsip. Arsip hanya keluar lewat batch penyusutan yang disetujui." },
  { title: "Bukti di luar jangkauan admin", text: "Checkpoint log audit ditandatangani dan disimpan di storage write-once." },
]

const integrations = [
  { name: "Single sign-on (OIDC)", text: "Masuk memakai penyedia identitas organisasi." },
  { name: "API REST", text: "Membuat arsip, mengunggah berkas, dan membaca status dari sistem lain." },
  { name: "Webhook", text: "Memberi tahu sistem lain saat arsip berpindah status atau batch disetujui." },
  { name: "Email masuk", text: "Surat dan lampiran dari alamat khusus langsung menjadi arsip." },
  { name: "Pemindai dokumen", text: "Hasil pindaian masuk ke antrean OCR dan klasifikasi." },
  { name: "Ekspor paket bukti", text: "Paket berisi arsip, metadata, dan potongan log audit untuk pemeriksa." },
]

const request = `POST /api/v1/records
Idempotency-Key: 5c0e1c2a-7b1f-4a44-9d6e-2f8a3b1c9d07

{
  "title": "Surat Perintah Membayar Termin 2",
  "unit_id": "01926f3a-1111-7000-8000-00000000a001",
  "record_date": "2026-09-15",
  "security_level": "internal"
}`

const response = `201 Created

{
  "record_number": "KEU-2026-000123",
  "status": "active",
  "security_level": "internal",
  "legal_hold": false,
  "classification": null,
  "active_until": null
}`

export default function ArchitecturePage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/platform", label: "Platform" }, { label: "Arsitektur & Integrasi" }]}
        title="Arsitektur yang menjaga aturan dan bukti di satu tempat"
        lead="Platform dirancang berlapis: aplikasi web di depan, satu layanan API yang menegakkan aturan kearsipan dan pemisahan organisasi, data terenkripsi di belakangnya, dan worker terisolasi untuk memproses isi dokumen."
        photo={{ src: "/images/operator-desk.webp", alt: "Pegawai bekerja di depan komputer di ruang kantor berdinding kaca" }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <SectionHeading title="Lapisan sistem" lead="Gambaran arsitektur target untuk tim TI dan keamanan informasi." />
            <ul className="mt-8 flex flex-col gap-6">
              {principles.map((p) => (
                <li key={p.title}>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <ArchitectureDiagram />
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading title="Opsi penerapan" lead="Model hosting menentukan lokasi data, pengelolaan kunci, dan pembagian peran menurut UU PDP. Pilihan ini ditetapkan bersama organisasi Anda." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Cloud", "Dikelola penyedia layanan. Lokasi pusat data dan penyedia: [DATA ASLI]."],
            ["On-premise", "Dipasang di pusat data organisasi, dengan kunci enkripsi di HSM milik organisasi."],
            ["Hibrida", "Aplikasi dikelola, sementara data dan kunci tetap di lingkungan organisasi."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{t}</h3>
                <Badge variant="inactive">Sedang ditetapkan</Badge>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading title="Titik integrasi" lead="Integrasi berikut direncanakan dalam peta jalan produk. Ketersediaan per fase dibahas saat demo." />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {integrations.map((i) => (
                <li key={i.name} className="flex gap-3">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  <span>
                    <span className="font-semibold text-navy">{i.name}</span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-relaxed">{i.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold text-navy">Contoh: membuat arsip melalui API</p>
            <div className="overflow-hidden rounded-xl border border-navy bg-navy text-white shadow-product">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-white/70">
                <span>REST · JSON · /api/v1</span>
                <span>Contoh</span>
              </div>
              <pre className="code overflow-x-auto p-4 text-[12.5px] leading-relaxed text-white/90">{request}</pre>
              <pre className="code overflow-x-auto border-t border-white/10 p-4 text-[12.5px] leading-relaxed text-brand-soft">{response}</pre>
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">Tidak ada endpoint untuk menghapus arsip. Nomor arsip dibuat otomatis.</p>
          </div>
        </div>
      </Section>

      <CtaBand photo={{ src: "/images/data-center.webp", alt: "Lorong ruang server di pusat data" }} title="Diskusikan arsitektur dengan tim TI Anda" lead="Kami siapkan sesi teknis tentang lokasi data, integrasi identitas, dan pengelolaan kunci sesuai kebijakan organisasi Anda." />
    </>
  )
}
