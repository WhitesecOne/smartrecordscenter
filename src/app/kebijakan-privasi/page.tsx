import type { Metadata } from "next"
import Link from "next/link"

import { OpenCookieSettings } from "@/components/cookie-consent"
import { LegalPage, type LegalSection } from "@/components/legal-page"
import { site } from "@/lib/site"

const title = "Kebijakan Privasi"
const description =
  "Cara Smart Records Center memproses data pribadi dari form kontak dan cookie analitik di situs ini, dasar pemrosesan menurut UU 27/2022, serta hak Anda."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kebijakan-privasi" },
  openGraph: { url: "/kebijakan-privasi", title: `${title} | ${site.name}`, description, siteName: site.name, locale: "id_ID", type: "website" },
}

const sections: LegalSection[] = [
  {
    id: "ruang-lingkup",
    title: "Ruang lingkup",
    body: (
      <>
        <p>
          Kebijakan ini menjelaskan cara {site.entity} (&ldquo;kami&rdquo;), selaku penyelenggara situs {site.name}, memproses data pribadi pengunjung situs ini sebagai
          pengendali data pribadi.
        </p>
        <p>
          Kebijakan ini hanya berlaku untuk situs publik. Pemrosesan data di dalam platform {site.name} yang digunakan pelanggan diatur dalam perjanjian tersendiri
          dengan masing-masing pelanggan.
        </p>
      </>
    ),
  },
  {
    id: "data-yang-dikumpulkan",
    title: "Data yang kami kumpulkan",
    body: (
      <>
        <p>Saat Anda mengisi form kontak atau permintaan demo, kami menerima data yang Anda berikan:</p>
        <ul>
          <li>nama;</li>
          <li>nama organisasi;</li>
          <li>jabatan;</li>
          <li>alamat email;</li>
          <li>nomor telepon;</li>
          <li>sektor organisasi;</li>
          <li>isi pesan.</li>
        </ul>
        <p>
          Server kami juga menerima data teknis yang dikirim peramban secara otomatis, seperti alamat IP dan jenis peramban. Data ini dipakai untuk keamanan situs dan
          pembatasan jumlah kiriman form.
        </p>
        <p>
          Kami tidak meminta data pribadi yang bersifat spesifik, seperti data kesehatan, biometrik, atau keuangan pribadi. Mohon tidak mencantumkannya di kolom pesan.
        </p>
      </>
    ),
  },
  {
    id: "tujuan",
    title: "Tujuan pemrosesan",
    body: (
      <>
        <p>Kami memproses data pribadi Anda untuk:</p>
        <ul>
          <li>menanggapi permintaan demo, konsultasi, atau pertanyaan yang Anda kirim;</li>
          <li>menghubungi Anda terkait permintaan tersebut;</li>
          <li>menjaga keamanan situs, termasuk mencegah spam dan penyalahgunaan form;</li>
          <li>memahami halaman yang dibaca pengunjung, hanya jika Anda menyetujui cookie analitik.</li>
        </ul>
        <p>Kami tidak menjual data pribadi Anda dan tidak memakainya untuk pemasaran pihak lain.</p>
      </>
    ),
  },
  {
    id: "dasar-pemrosesan",
    title: "Dasar pemrosesan",
    body: (
      <>
        <p>Kami memproses data pribadi berdasarkan dasar pemrosesan yang diatur dalam Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi:</p>
        <ul>
          <li>data form kontak: pemenuhan permintaan Anda sebelum kemungkinan perjanjian, dan persetujuan yang Anda berikan saat mengirim form;</li>
          <li>cookie analitik: persetujuan eksplisit melalui banner cookie, yang dapat Anda tarik kapan saja;</li>
          <li>data teknis untuk keamanan situs: kepentingan yang sah untuk melindungi situs dan penggunanya.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookie",
    title: "Cookie dan analitik",
    body: (
      <>
        <p>
          Situs ini tidak memuat skrip analitik sebelum Anda memberi persetujuan melalui banner cookie. Tombol Izinkan dan Tolak ditampilkan setara, dan menolak tidak
          membatasi akses Anda ke isi situs.
        </p>
        <p>
          Pilihan Anda disimpan di penyimpanan lokal peramban Anda agar banner tidak muncul di setiap halaman. Jika Anda mengizinkan, penyedia analitik dapat memasang
          cookie untuk mencatat halaman yang dikunjungi, jenis perangkat, dan perkiraan lokasi.
        </p>
        <p>Penyedia analitik: Google Analytics 4 dari Google LLC. Data analitik dapat diproses di pusat data Google di luar Indonesia.</p>
        <p>
          Anda dapat mengubah pilihan kapan saja melalui tombol &ldquo;Pengaturan cookie&rdquo; di bagian bawah setiap halaman, atau melalui tombol berikut. Jika Anda
          menarik persetujuan, halaman dimuat ulang agar skrip analitik berhenti.
        </p>
        <p>
          <OpenCookieSettings className="inline-flex min-h-11 items-center rounded-md border border-input bg-white px-4 font-semibold text-navy hover:border-navy/40 hover:bg-mist" />
        </p>
      </>
    ),
  },
  {
    id: "penyimpanan",
    title: "Penyimpanan dan masa simpan data",
    body: (
      <>
        <p>Data dari form kontak dikirim sebagai email ke alamat {site.email} melalui layanan pengiriman email Resend.</p>
        <p>
          Data tersebut kami simpan paling lama 2 tahun sejak komunikasi terakhir dengan Anda. Setelah masa simpan berakhir, data dihapus atau dianonimkan, kecuali
          peraturan perundang-undangan mewajibkan penyimpanan lebih lama.
        </p>
        <p>
          Log teknis server di penyedia hosting mencatat status dan metadata teknis. Bila pengiriman email sedang tidak tersedia, isi permintaan Anda dicatat sementara di
          log tersebut agar tetap dapat kami tindak lanjuti, lalu terhapus sesuai masa simpan log penyedia hosting.
        </p>
      </>
    ),
  },
  {
    id: "pihak-lain",
    title: "Pengungkapan kepada pihak lain",
    body: (
      <>
        <p>
          Kami hanya membagikan data pribadi kepada penyedia layanan yang membantu kami menyelenggarakan situs, seperti penyedia hosting, email, dan analitik. Mereka
          memproses data atas instruksi kami dan terikat kewajiban kerahasiaan.
        </p>
        <p>
          Daftar penyedia layanan: Vercel Inc. (hosting situs), Resend (pengiriman email form kontak), dan Google LLC (analitik, hanya bila Anda memberi persetujuan
          cookie).
        </p>
        <p>
          Jika data pribadi diproses di luar wilayah hukum Negara Republik Indonesia, kami memastikan ketentuan transfer data pribadi dalam UU 27/2022 dipenuhi. Kami juga
          dapat mengungkapkan data pribadi bila diwajibkan oleh peraturan perundang-undangan atau perintah otoritas yang berwenang.
        </p>
      </>
    ),
  },
  {
    id: "hak-anda",
    title: "Hak Anda sebagai subjek data pribadi",
    body: (
      <>
        <p>Sesuai UU 27/2022, Anda berhak untuk:</p>
        <ul>
          <li>mendapatkan informasi tentang pemrosesan data pribadi Anda;</li>
          <li>melengkapi, memperbarui, atau memperbaiki data pribadi Anda;</li>
          <li>mengakses dan memperoleh salinan data pribadi Anda;</li>
          <li>mengakhiri pemrosesan serta meminta penghapusan atau pemusnahan data pribadi Anda;</li>
          <li>menarik kembali persetujuan yang telah Anda berikan;</li>
          <li>menunda atau membatasi pemrosesan data pribadi Anda;</li>
          <li>mengajukan keberatan atas keputusan yang semata-mata didasarkan pada pemrosesan otomatis;</li>
          <li>mengajukan gugatan dan menerima ganti rugi atas pelanggaran pemrosesan data pribadi Anda.</li>
        </ul>
        <p>
          Kirim permintaan Anda melalui kontak di bagian terakhir kebijakan ini. Kami dapat meminta informasi tambahan untuk memastikan identitas Anda, dan kami menanggapi
          dalam jangka waktu yang ditetapkan peraturan perundang-undangan.
        </p>
      </>
    ),
  },
  {
    id: "keamanan",
    title: "Keamanan data",
    body: (
      <>
        <p>Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data pribadi Anda, antara lain:</p>
        <ul>
          <li>koneksi terenkripsi antara peramban Anda dan situs;</li>
          <li>akses ke data form yang dibatasi pada personel yang memerlukannya;</li>
          <li>pembatasan jumlah kiriman dan perlindungan form dari spam;</li>
          <li>log teknis tanpa isi pesan dan tanpa data pribadi yang tidak diperlukan.</li>
        </ul>
        <p>
          Jika terjadi kegagalan pelindungan data pribadi, kami memberitahukannya kepada Anda dan lembaga yang berwenang sesuai ketentuan UU 27/2022.
        </p>
      </>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan kebijakan",
    body: (
      <p>
        Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Versi terbaru selalu tersedia di halaman ini dengan tanggal berlaku di bagian atas. Perubahan yang
        berdampak besar akan kami sampaikan secara jelas di situs ini. Lihat juga <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link> penggunaan situs.
      </p>
    ),
  },
  {
    id: "kontak",
    title: "Kontak pengendali data",
    body: (
      <>
        <p>Pertanyaan dan permintaan terkait data pribadi dapat dikirim kepada:</p>
        <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-border bg-mist p-5 text-[0.9375rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">Pengendali data</dt>
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

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage
      crumb="Kebijakan Privasi"
      title="Kebijakan Privasi"
      lead={`Kebijakan ini menjelaskan data pribadi apa yang dikumpulkan situs ${site.name}, untuk apa data itu dipakai, berapa lama disimpan, dan hak Anda atas data tersebut.`}
      sections={sections}
    />
  )
}
