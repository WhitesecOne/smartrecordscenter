import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage, type LegalSection } from "@/components/legal-page"
import { references, site } from "@/lib/site"

const title = "Syarat & Ketentuan"
const description =
  "Syarat penggunaan situs Smart Records Center: hak kekayaan intelektual, sifat konten demo dan data contoh, batasan tanggung jawab, dan hukum yang berlaku."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/syarat-ketentuan" },
  openGraph: { url: "/syarat-ketentuan", title: `${title} | ${site.name}`, description, siteName: site.name, locale: "id_ID", type: "website" },
}

const sections: LegalSection[] = [
  {
    id: "penerimaan",
    title: "Penerimaan syarat",
    body: (
      <>
        <p>
          Situs {site.name} diselenggarakan oleh {site.entity} (&ldquo;kami&rdquo;). Dengan mengakses dan menggunakan situs ini, Anda menyetujui syarat dan ketentuan
          berikut. Jika Anda tidak menyetujuinya, mohon tidak menggunakan situs ini.
        </p>
        <p>
          Syarat ini hanya mengatur penggunaan situs publik. Penggunaan platform {site.name} oleh pelanggan diatur dalam perjanjian tertulis tersendiri.
        </p>
      </>
    ),
  },
  {
    id: "penggunaan-situs",
    title: "Penggunaan situs",
    body: (
      <>
        <p>Anda boleh menggunakan situs ini untuk mempelajari {site.name} dan menghubungi kami. Saat menggunakan situs, Anda tidak diperkenankan:</p>
        <ul>
          <li>mengganggu, membebani secara berlebihan, atau mencoba menembus keamanan situs;</li>
          <li>mencoba mengakses bagian situs atau sistem yang tidak dibuka untuk umum;</li>
          <li>mengirim spam, kode berbahaya, atau isi yang melanggar hukum melalui form;</li>
          <li>mengirim data pribadi orang lain tanpa dasar yang sah;</li>
          <li>menggunakan situs dengan cara yang melanggar peraturan perundang-undangan.</li>
        </ul>
      </>
    ),
  },
  {
    id: "kekayaan-intelektual",
    title: "Hak kekayaan intelektual",
    body: (
      <>
        <p>
          Nama {site.name}, logo, teks, desain antarmuka, tampilan produk, dan materi lain di situs ini merupakan milik {site.entity} atau pemberi lisensinya, dan
          dilindungi peraturan perundang-undangan tentang hak kekayaan intelektual.
        </p>
        <p>
          Anda boleh mengutip isi situs untuk keperluan evaluasi internal dengan menyebutkan sumbernya. Penggunaan lain, termasuk menyalin, mengubah, atau
          mendistribusikan materi untuk tujuan komersial, memerlukan izin tertulis dari kami.
        </p>
        <p>Foto dan materi pihak ketiga tetap menjadi milik pemegang haknya masing-masing.</p>
      </>
    ),
  },
  {
    id: "konten-demo",
    title: "Konten demo dan data contoh",
    body: (
      <>
        <p>
          Tampilan produk di situs ini, termasuk tabel, nomor arsip, nama unit, kode klasifikasi, masa retensi, skor keyakinan, dan nilai hash yang berlabel &ldquo;Data
          contoh&rdquo;, adalah ilustrasi.
        </p>
        <ul>
          <li>Data contoh tidak mewakili organisasi, orang, atau arsip yang nyata.</li>
          <li>Angka dalam data contoh bukan hasil pengukuran kinerja atau janji tingkat layanan.</li>
          <li>Kode klasifikasi dan masa retensi dalam contoh bukan rekomendasi skema klasifikasi atau JRA untuk organisasi Anda.</li>
        </ul>
      </>
    ),
  },
  {
    id: "bukan-nasihat-hukum",
    title: "Rujukan regulasi, bukan nasihat hukum",
    body: (
      <>
        <p>
          Regulasi dan standar yang disebut di situs ini, seperti {references.map((r) => r.code).join(", ")}, adalah rujukan rancangan. Penyebutan tersebut bukan klaim
          sertifikasi atau kepatuhan, dan bukan nasihat hukum.
        </p>
        <p>
          Penyusunan skema klasifikasi arsip, jadwal retensi arsip, dan kebijakan kearsipan tetap menjadi tanggung jawab organisasi Anda. Untuk kepastian hukum, konsultasikan
          dengan penasihat hukum atau lembaga kearsipan yang berwenang.
        </p>
      </>
    ),
  },
  {
    id: "informasi-produk",
    title: "Informasi produk",
    body: (
      <p>
        Fitur yang dijelaskan di situs ini dapat berbeda menurut tahap penerapan dan dapat berubah sewaktu-waktu. Ketersediaan fitur, harga, dan tingkat layanan hanya
        mengikat bila dicantumkan dalam penawaran dan perjanjian tertulis.
      </p>
    ),
  },
  {
    id: "batasan-tanggung-jawab",
    title: "Batasan tanggung jawab",
    body: (
      <>
        <p>
          Situs ini disediakan sebagaimana adanya. Kami berupaya menjaga isi situs tetap akurat dan tersedia, tetapi tidak menjamin situs selalu bebas dari kesalahan,
          gangguan, atau keterlambatan pembaruan.
        </p>
        <p>
          Sejauh diizinkan peraturan perundang-undangan, kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan situs ini atau dari
          keputusan yang diambil semata-mata berdasarkan informasi di situs ini.
        </p>
      </>
    ),
  },
  {
    id: "tautan-pihak-ketiga",
    title: "Tautan ke situs pihak ketiga",
    body: (
      <p>
        Situs ini dapat memuat tautan ke situs pihak ketiga. Kami tidak mengendalikan dan tidak bertanggung jawab atas isi, keamanan, maupun kebijakan privasi situs
        tersebut. Mengunjungi situs pihak ketiga sepenuhnya menjadi keputusan Anda.
      </p>
    ),
  },
  {
    id: "data-pribadi",
    title: "Data pribadi",
    body: (
      <p>
        Pemrosesan data pribadi yang Anda kirim melalui situs ini, termasuk melalui form kontak dan cookie analitik, diatur dalam{" "}
        <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.
      </p>
    ),
  },
  {
    id: "hukum-yang-berlaku",
    title: "Hukum yang berlaku",
    body: (
      <>
        <p>Syarat dan ketentuan ini tunduk pada hukum Negara Republik Indonesia.</p>
        <p>
          Setiap perselisihan yang timbul akan diselesaikan terlebih dahulu secara musyawarah. Jika musyawarah tidak mencapai kesepakatan, perselisihan diselesaikan
          melalui Pengadilan Negeri Jakarta Timur.
        </p>
      </>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan syarat",
    body: (
      <p>
        Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini dengan tanggal berlaku di bagian atas. Dengan tetap
        menggunakan situs setelah perubahan berlaku, Anda dianggap menyetujui syarat yang telah diperbarui.
      </p>
    ),
  },
  {
    id: "kontak",
    title: "Kontak",
    body: (
      <>
        <p>
          Pertanyaan tentang syarat dan ketentuan ini dapat dikirim melalui <Link href="/kontak">halaman kontak</Link> atau kepada:
        </p>
        <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-border bg-mist p-5 text-[0.9375rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">Penyelenggara</dt>
          <dd className="mb-2 font-medium text-navy sm:mb-0">{site.entity}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="mb-2 font-medium text-navy sm:mb-0">{site.email}</dd>
          <dt className="text-muted-foreground">Alamat</dt>
          <dd className="mb-2 font-medium text-navy sm:mb-0">{site.address}</dd>
        </dl>
      </>
    ),
  },
]

export default function SyaratKetentuanPage() {
  return (
    <LegalPage
      crumb="Syarat & Ketentuan"
      title="Syarat & Ketentuan"
      lead={`Ketentuan penggunaan situs ${site.name}, termasuk sifat konten demo, hak kekayaan intelektual, dan batasan tanggung jawab kami.`}
      sections={sections}
    />
  )
}
