"use client"

import { CheckCircle2Icon, ShieldXIcon } from "lucide-react"
import { useState } from "react"

import { MockFrame } from "@/components/product/ui"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { firstBreak, type ChainedEntry } from "@/lib/chain"
import { cn } from "@/lib/utils"

type Result = { state: "idle" } | { state: "checking" } | { state: "ok" } | { state: "broken"; seq: number }

const EDITED = 7

export function RegisterVerifierClient({ entries }: { entries: ChainedEntry[] }) {
  const [tampered, setTampered] = useState(false)
  const [result, setResult] = useState<Result>({ state: "idle" })

  // Simulated tampering: a denied access is rewritten to look allowed, the stored hash stays.
  const list = tampered
    ? entries.map((e) => (e.seq === EDITED ? { ...e, action: "akses.diizinkan", detail: "unit=SDM wajib=SDM keamanan=rahasia" } : e))
    : entries

  async function verify() {
    setResult({ state: "checking" })
    const at = await firstBreak(list)
    await new Promise((r) => setTimeout(r, 400))
    setResult(at === -1 ? { state: "ok" } : { state: "broken", seq: list[at].seq })
  }

  const last = list[list.length - 1]
  const message =
    result.state === "ok"
      ? `Rantai utuh. ${list.length} entri cocok, hash terakhir ${last.hash.slice(0, 12)}…`
      : result.state === "broken"
        ? `Rantai putus di entri ${result.seq}. Isinya tidak lagi cocok dengan hash yang tersimpan, jadi perubahan terdeteksi.`
        : result.state === "checking"
          ? "Menghitung ulang SHA-256 setiap entri…"
          : tampered
            ? `Entri ${EDITED} sudah diubah: penolakan akses ditulis ulang agar terlihat diizinkan. Jalankan verifikasi.`
            : "Tekan Verifikasi. Browser Anda menghitung ulang SHA-256 setiap entri dan mencocokkannya dengan hash yang tersimpan."

  return (
    <MockFrame title="Jejak Audit · Log Audit Berantai Hash">
      <ol className="divide-y divide-border sm:hidden">
        {list.map((e) => {
          const broken = result.state === "broken" && result.seq === e.seq
          const edited = tampered && e.seq === EDITED
          return (
            <li key={e.seq} className={cn("px-4 py-3 text-[12.5px]", broken && "bg-red-50", edited && !broken && "bg-st-pending-wash/60")}>
              <p className="flex items-baseline justify-between gap-3">
                <span className={cn("code font-semibold text-navy", edited && "text-st-pending")}>
                  {e.seq}. {e.action}
                </span>
                <span className="code text-muted-foreground">{e.at.slice(0, 10)}</span>
              </p>
              <p className="code mt-0.5 truncate text-body">{e.target}</p>
              <p className="code mt-1 text-muted-foreground">
                {e.prev.slice(0, 8)}… → <span className={cn("text-navy", broken && "text-destructive line-through")}>{e.hash.slice(0, 8)}…</span>
              </p>
            </li>
          )
        })}
      </ol>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[46rem] border-collapse text-left text-[12.5px] whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-mist/70">
              {["No.", "Waktu (UTC)", "Pelaku", "Kejadian", "Objek", "Hash sebelumnya → hash"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((e) => {
              const broken = result.state === "broken" && result.seq === e.seq
              const edited = tampered && e.seq === EDITED
              return (
                <tr key={e.seq} className={cn("border-b border-border last:border-b-0", broken && "bg-red-50", edited && !broken && "bg-st-pending-wash/60")}>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{e.seq}</td>
                  <td className="code px-3 py-2 whitespace-nowrap text-muted-foreground">{e.at.slice(0, 16).replace("T", " ")}</td>
                  <td className="code px-3 py-2 text-navy">{e.actor}</td>
                  <td className={cn("code px-3 py-2 font-semibold text-navy", edited && "text-st-pending")}>{e.action}</td>
                  <td className="code px-3 py-2 text-body">{e.target}</td>
                  <td className="code px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {e.prev.slice(0, 6)}… → <span className={cn("text-navy", broken && "text-destructive line-through")}>{e.hash.slice(0, 8)}…</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-border bg-mist/60 p-4 lg:flex-row lg:items-center lg:justify-between">
        <p
          aria-live="polite"
          className={cn(
            "flex max-w-[60ch] items-start gap-2 text-[13.5px]",
            result.state === "ok" && "font-semibold text-teal-ink",
            result.state === "broken" && "font-semibold text-destructive"
          )}
        >
          {result.state === "ok" && <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" aria-hidden />}
          {result.state === "broken" && <ShieldXIcon className="mt-0.5 size-4 shrink-0" aria-hidden />}
          {message}
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              setTampered((v) => !v)
              setResult({ state: "idle" })
            }}
            disabled={result.state === "checking"}
          >
            {tampered ? "Pulihkan log" : `Ubah entri ${EDITED} (simulasi)`}
          </Button>
          <Button onClick={verify} disabled={result.state === "checking"}>
            {result.state === "checking" && <Spinner data-icon="inline-start" />}
            Verifikasi rantai
          </Button>
        </div>
      </div>
    </MockFrame>
  )
}
