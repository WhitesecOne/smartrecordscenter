import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// iOS masks the corners itself, so the mark sits on a full navy square.
export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"))
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0b2447" }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Satori image, not a page element */}
      <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={180} height={180} />
    </div>,
    size,
  )
}
