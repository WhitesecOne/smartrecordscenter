"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="border-b border-border bg-mist">
      <div className="container-page py-16 lg:py-24">
        <h1 className="display text-[clamp(2.25rem,4.4vw,3.5rem)]">Halaman ini gagal dimuat</h1>
        <p className="lead mt-6 max-w-[60ch] text-body">
          Terjadi kesalahan saat menyiapkan halaman. Coba muat ulang. Jika masalah berlanjut, kembali ke beranda atau hubungi kami.
        </p>
        {error.digest && <p className="code mt-4 text-sm text-muted-foreground">Kode referensi: {error.digest}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => retry()}>
            Coba Lagi
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/" />} nativeButton={false}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </section>
  )
}
