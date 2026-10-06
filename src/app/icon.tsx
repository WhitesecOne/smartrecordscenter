import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

// PNG sizes for the web manifest. icon.svg stays the browser favicon.
export function generateImageMetadata() {
  return [192, 512].map((n) => ({ id: String(n), size: { width: n, height: n }, contentType: "image/png" }))
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const n = Number(await id)
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"))
  return new ImageResponse(
    // eslint-disable-next-line jsx-a11y/alt-text -- Satori image, not a page element
    <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={n} height={n} />,
    { width: n, height: n },
  )
}
