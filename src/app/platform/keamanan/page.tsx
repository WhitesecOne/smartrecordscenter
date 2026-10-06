import { CheckIcon } from "lucide-react"
import type { Metadata } from "next"

import { ProductMock } from "@/components/product/mocks"
import { RegisterVerifier } from "@/components/product/register"
import { Reveal } from "@/components/reveal"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { site, ogBase } from "@/lib/site"

const description =
  "Keamanan Smart Records Center: kontrol akses berlapis, enkripsi, jejak audit berantai hash, pemisahan data per organisasi, legal hold, keamanan AI, dan referensi regulasi kearsipan."

export const metadata: Metadata = {
  title: "Keamanan & Kepatuhan",
  description,
  alternates: { canonical: "/platform/keamanan" },
  openGraph: { ...ogBase, url: "/platform/keamanan", title: "Keamanan & Kepatuhan", description },
}

type Status = "situs" | "rancangan"
const controls: { name: string; how: string; status: Status }[] = [
  { name: "Jejak audit berantai hash", how: "Setiap entri log menyimpan hash entri sebelumnya; perubahan terdeteksi saat verifikasi.", status: "situs" },
  { name: "Pemisahan data per organisasi", how: "Setiap kueri dibatasi pada organisasi pengguna, dan berkas setiap organisasi dienkripsi dengan kuncinya sendiri.", status: "rancangan" },
  { name: "Kontrol akses berlapis", how: "Peran, unit kerja, dan tingkat keamanan arsip menentukan siapa melihat dan mengunduh apa.", status: "rancangan" },
  { name: "Pemisahan tugas", how: "Pengusul batch penyusutan tidak dapat menyetujui batchnya sendiri.", status: "rancangan" },
  { name: "Enkripsi saat transit", how: "TLS 1.3 diutamakan untuk semua lalu lintas, termasuk antar-layanan.", status: "rancangan" },
  { name: "Enkripsi saat disimpan", how: "Setiap arsip memiliki kunci sendiri yang dibungkus kunci organisasi di KMS atau HSM.", status: "rancangan" },
  { name: "Media write-once", how: "Arsip permanen dan checkpoint audit tidak dapat diubah atau dihapus siapa pun.", status: "rancangan" },
  { name: "Legal hold", how: "Arsip terkait perkara dibekukan dan dikeluarkan dari semua usulan penyusutan.", status: "rancangan" },
  { name: "Pemusnahan kriptografis", how: "Kunci arsip dihancurkan saat pemusnahan; hash berkas tetap disimpan sebagai bukti.", status: "rancangan" },
]

const ai = [
  "Isi dokumen diperlakukan sebagai data, bukan instruksi. Model tidak dapat memicu tindakan apa pun.",
  "Keluaran model divalidasi: kode klasifikasi harus ada dan aktif di skema klasifikasi organisasi.",
  "AI hanya boleh mengusulkan kenaikan tingkat keamanan; penurunan wajib keputusan manusia.",
  "Keputusan penyusutan selalu diambil manusia.",
  "Data organisasi tidak dipakai untuk melatih model tanpa persetujuan tertulis.",
]

const refs = [
  ["UU No. 43 Tahun 2009 tentang Kearsipan", "Arsip dinamis dan statis, arsip vital, JRA, penyusutan, berita acara"],
  ["UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi", "Dasar pemrosesan, minimisasi, hak subjek data, notifikasi kegagalan"],
  ["ISO 15489-1", "Konsep records management, disposisi, dan metadata"],
  ["ISO 16175", "Kebutuhan fungsional sistem pengelolaan arsip digital"],
  ["ISO 23081", "Metadata untuk manajemen arsip"],
  ["ISO 15836 (Dublin Core)", "Elemen metadata untuk pertukaran dan pencarian"],
  ["ISO/IEC 27001", "Kerangka kontrol keamanan informasi"],
]

export default function SecurityPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/platform", label: "Platform" }, { label: "Keamanan & Kepatuhan" }]}
        title="Keamanan yang bisa diperiksa, bukan sekadar dijanjikan"
        lead="Halaman ini menjelaskan kontrol keamanan yang dirancang dalam platform dan menandai dengan jujur mana yang sudah bisa Anda coba di situs ini."
        photo={{ src: "/images/security-lobby.webp", alt: "Lobi gedung kantor dengan gerbang akses keamanan" }}
      />

      <Section>
        <SectionHeading title="Kontrol keamanan" lead="Status ditulis apa adanya. Kontrol berlabel rancangan adalah bagian dari arsitektur yang sedang dibangun." />
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="bg-mist">
                {["Kontrol", "Cara kerja", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 text-sm font-semibold text-navy">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {controls.map((c) => (
                <tr key={c.name} className="border-t border-border align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-navy">
                    {c.name}
                  </th>
                  <td className="px-5 py-4">{c.how}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {c.status === "situs" ? <Badge variant="active">Bisa dicoba di situs ini</Badge> : <Badge variant="inactive">Rancangan</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading title="Siapa melihat apa" lead="Hak akses dihitung dari peran, unit kerja, dan tingkat keamanan arsip, di dalam batas organisasi masing-masing." />
        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <Reveal>
            <ProductMock k="access" />
          </Reveal>
          <Reveal delay={0.08}>
            <ProductMock k="tenants" />
          </Reveal>
        </div>
      </Section>

      <Section id="coba-verifikasi">
        <SectionHeading
          title="Coba verifikasi jejak audit"
          lead="Log di bawah memakai data contoh. Ubah satu entri, lalu verifikasi: browser Anda menghitung ulang SHA-256 dan menunjukkan di mana rantai putus."
        />
        <div className="mt-10">
          <RegisterVerifier />
        </div>
        <p className="mt-4 max-w-[70ch] text-[13px] text-muted-foreground">
          Log ini bersifat tamper-evident: perubahan terdeteksi, bukan dicegah. Checkpoint rantai ditandatangani dan disimpan di media write-once agar penulisan ulang
          seluruh rantai pun tetap terdeteksi.
        </p>
      </Section>

      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title="Keamanan AI" lead="AI membaca dokumen yang isinya tidak selalu bisa dipercaya. Rancangannya membatasi apa yang bisa dilakukan model." />
            <ul className="mt-8 flex flex-col gap-3 text-[0.9375rem]">
              {ai.map((t) => (
                <li key={t} className="flex gap-3 leading-relaxed">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Referensi regulasi dan standar" lead="Dipakai sebagai acuan rancangan. Ini bukan klaim sertifikasi atau kepatuhan formal." />
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {refs.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-6">
                  <dt className="font-semibold text-navy">{k}</dt>
                  <dd className="text-[0.9375rem]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-xl font-bold">Sertifikasi dan hosting</h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed">
              Kami tidak mencantumkan sertifikasi yang belum dimiliki. Model penerapan (cloud, on-premise, atau hibrida) dan lokasi pusat data ditetapkan bersama organisasi
              Anda sejak awal proyek.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-xl font-bold">Pelaporan kerentanan</h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed">
              Temukan celah keamanan? Laporkan ke <span className="font-semibold text-navy">{site.securityEmail}</span> dengan langkah reproduksi dan dampaknya. Mohon jangan mengakses
              data milik orang lain saat menguji.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand photo={{ src: "/images/server-racks.webp", alt: "Rak server berisi perangkat penyimpanan" }} title="Tinjau model keamanan bersama tim kami" lead="Kami siapkan sesi khusus untuk tim keamanan informasi dan kepatuhan Anda, termasuk pembahasan dokumen arsitektur dan model ancaman." />
    </>
  )
}
