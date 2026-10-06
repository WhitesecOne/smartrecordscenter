// Hash-chained audit register. Web Crypto runs in both Node and the browser,
// so the server builds the chain and the visitor's browser re-verifies it.

export type Entry = { seq: number; at: string; actor: string; action: string; target: string; detail: string }
export type ChainedEntry = Entry & { prev: string; hash: string }

export const GENESIS = "0".repeat(64)

const input = (e: Entry, prev: string) => [prev, e.seq, e.at, e.actor, e.action, e.target, e.detail].join("|")

export async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function chain(entries: Entry[]): Promise<ChainedEntry[]> {
  const out: ChainedEntry[] = []
  let prev = GENESIS
  for (const e of entries) {
    const hash = await sha256Hex(input(e, prev))
    out.push({ ...e, prev, hash })
    prev = hash
  }
  return out
}

/** Returns the index of the first entry that no longer matches, or -1 when the chain is intact. */
export async function firstBreak(entries: ChainedEntry[]): Promise<number> {
  let prev = GENESIS
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    if (e.prev !== prev || (await sha256Hex(input(e, e.prev))) !== e.hash) return i
    prev = e.hash
  }
  return -1
}
