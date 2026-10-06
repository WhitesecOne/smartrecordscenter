"use client"

// Replaces the root layout when it fails, so no globals.css or fonts: inline styles only.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#f5f7fa", color: "#3b4a5e", fontFamily: "system-ui, sans-serif" }}>
        <title>Terjadi kesalahan | Smart Records Center</title>
        <main style={{ maxWidth: 560, padding: "48px 16px" }}>
          <h1 style={{ margin: 0, color: "#0b2447", fontSize: 32, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Situs gagal dimuat</h1>
          <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.6 }}>
            Terjadi kesalahan pada Smart Records Center. Coba muat ulang halaman ini dalam beberapa saat.
          </p>
          {error.digest && <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, color: "#526179" }}>Kode referensi: {error.digest}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ minHeight: 48, padding: "0 24px", border: 0, borderRadius: 8, background: "#0e7c7b", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            >
              Coba Lagi
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload is the point here */}
            <a
              href="/"
              style={{ display: "inline-flex", alignItems: "center", minHeight: 48, padding: "0 24px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#0b2447", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
            >
              Kembali ke Beranda
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
