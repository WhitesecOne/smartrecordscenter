// Run: node scripts/chain.check.mjs
import assert from "node:assert/strict"

import { chain, firstBreak } from "../src/lib/chain.ts"

const entries = [0, 1, 2, 3].map((seq) => ({
  seq,
  at: `2026-01-0${seq + 1}T08:00:00Z`,
  actor: "arsiparis",
  action: "ubah",
  target: `ARS-${seq}`,
  detail: "cek",
}))

const chained = await chain(entries)
assert.equal(await firstBreak(chained), -1)

const tampered = chained.map((e) => ({ ...e }))
tampered[2].detail = "diubah"
assert.equal(await firstBreak(tampered), 2)

console.log("chain: ok")
