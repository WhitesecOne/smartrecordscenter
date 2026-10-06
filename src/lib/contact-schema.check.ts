// Run: node src/lib/contact-schema.check.ts
import assert from "node:assert/strict"

import { parseContact } from "./contact-schema.ts"

const form = (over: Record<string, string> = {}) => {
  const fd = new FormData()
  const base: Record<string, string> = {
    nama: "  Rina Kusuma ",
    organisasi: "Dinas Kearsipan",
    jabatan: "Arsiparis",
    email: "rina@contoh.go.id",
    telepon: "0812-3456-7890",
    sektor: "Instansi Pemerintah",
    kebutuhan: "Kami ingin menata arsip inaktif.",
    persetujuan: "on",
    ...over,
  }
  for (const [k, v] of Object.entries(base)) if (v !== "__omit") fd.set(k, v)
  return fd
}

// Valid input passes, trimmed and normalised.
const ok = parseContact(form())
assert.ok("data" in ok)
assert.equal(ok.data.nama, "Rina Kusuma")
assert.equal(ok.data.telepon, "081234567890")

// Phone is optional; +62 works; foreign or too-short numbers do not.
assert.ok("data" in parseContact(form({ telepon: "" })))
assert.ok("data" in parseContact(form({ telepon: "+62 21 555 0100" })))
for (const bad of ["+1 202 555 0100", "0812", "8123456789"]) {
  const r = parseContact(form({ telepon: bad }))
  assert.ok("errors" in r && r.errors.telepon, `telepon ${bad} should fail`)
}

// Every required field reports its own Indonesian message, and values come back for re-render.
const empty = parseContact(
  form({ nama: " ", organisasi: "", jabatan: "", email: "bukan-email", sektor: "Lain", kebutuhan: "pendek", persetujuan: "__omit" }),
)
assert.ok("errors" in empty)
assert.deepEqual(Object.keys(empty.errors).sort(), ["email", "jabatan", "kebutuhan", "nama", "organisasi", "persetujuan", "sektor"])
assert.equal(empty.errors.email, "Format email belum valid. Contoh: nama@organisasi.co.id.")
assert.equal(empty.errors.persetujuan, "Centang persetujuan kebijakan privasi untuk melanjutkan.")
assert.equal(empty.values.kebutuhan, "pendek")
assert.equal(empty.values.persetujuan, "")

// Empty email gets the "missing" message, not the "format" one.
const noMail = parseContact(form({ email: "" }))
assert.ok("errors" in noMail)
assert.equal(noMail.errors.email, "Masukkan email kerja Anda.")

// Length limits.
const long = parseContact(form({ kebutuhan: "x".repeat(2001) }))
assert.ok("errors" in long && long.errors.kebutuhan === "Kebutuhan maksimal 2.000 karakter.")

console.log("contact-schema: ok")
