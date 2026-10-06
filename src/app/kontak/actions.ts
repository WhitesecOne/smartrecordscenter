"use server"

import { redirect } from "next/navigation"

import { parseContact, type ContactData, type ContactState } from "@/lib/contact-schema"
import { site } from "@/lib/site"

export async function requestDemo(prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: people never see this field, bots fill it. Pretend it worked, without a conversion token.
  if (String(formData.get("website") ?? "") !== "") redirect("/terima-kasih")

  const result = parseContact(formData)
  if ("errors" in result) return { ...result, attempt: (prev.attempt ?? 0) + 1 }

  // ponytail: no rate limit; add one (per IP) if the form starts attracting spam past the honeypot.
  if (!(await deliver(result.data))) {
    const values = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, String(v)]))
    return { values, failed: true, attempt: (prev.attempt ?? 0) + 1 }
  }

  redirect(`/terima-kasih?t=${crypto.randomUUID()}`)
}

/** Emails the request to the owner through Resend. Without RESEND_API_KEY it only logs, so local runs and previews still work. */
async function deliver(d: ContactData): Promise<boolean> {
  const lines = [
    `Nama: ${d.nama}`,
    `Jabatan: ${d.jabatan}`,
    `Organisasi: ${d.organisasi}`,
    `Sektor: ${d.sektor}`,
    `Email: ${d.email}`,
    `Telepon: ${d.telepon || "-"}`,
    "",
    "Kebutuhan:",
    d.kebutuhan,
  ]
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("[kontak] RESEND_API_KEY belum diatur; permintaan demo hanya dicatat di log server.\n" + lines.join("\n"))
    return true
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Smart Records Center <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? site.email],
        reply_to: d.email,
        subject: `Permintaan demo: ${d.organisasi} (${d.nama})`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) console.error(`[kontak] Resend menolak pengiriman: ${res.status} ${await res.text()}`)
    return res.ok
  } catch (e) {
    console.error("[kontak] Gagal menghubungi Resend:", e)
    return false
  }
}
