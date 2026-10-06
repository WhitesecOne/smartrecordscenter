---
name: Smart Records Center
description: Formal Indonesian corporate site for records governance; real photography sets the authority, real product screens prove the seven modules.
colors:
  navy: "#0b2447"
  navy-2: "#133a6b"
  brand: "#1d4ed8"
  brand-ink: "#1e40af"
  brand-wash: "#eaf0fd"
  brand-soft: "#9bb8ff"
  white: "#ffffff"
  mist: "#f4f6fa"
  secondary: "#eef2f7"
  body: "#3b4a5e"
  muted-foreground: "#526179"
  border: "#e2e8f0"
  input: "#cbd5e1"
  destructive: "#b42318"
  teal: "#0e7c7b"
  teal-ink: "#0a6463"
  teal-wash: "#e7f3f2"
  st-inactive: "#64748b"
  st-pending: "#9a5b00"
  st-pending-wash: "#fff4e0"
  st-permanent-wash: "#e6ecf5"
typography:
  display:
    fontFamily: "Red Hat Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.028em"
  display-page:
    fontFamily: "Red Hat Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Red Hat Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Red Hat Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Red Hat Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Red Hat Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Red Hat Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.25
  code:
    fontFamily: "Red Hat Mono, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    letterSpacing: "-0.01em"
rounded:
  badge: "5px"
  control: "8px"
  panel: "10px"
  frame: "12px"
  band: "16px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  container: "1280px"
  section: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.brand-ink}"
  button-primary-lg:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.mist}"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    height: "48px"
  button-inverse-hover:
    backgroundColor: "{colors.mist}"
  badge-active:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.teal-ink}"
    rounded: "{rounded.badge}"
    height: "20px"
  badge-pending:
    backgroundColor: "{colors.st-pending-wash}"
    textColor: "{colors.st-pending}"
    rounded: "{rounded.badge}"
    height: "20px"
  badge-permanent:
    backgroundColor: "{colors.st-permanent-wash}"
    textColor: "{colors.navy}"
    rounded: "{rounded.badge}"
    height: "20px"
  product-frame:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.frame}"
  product-frame-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    padding: "8px 14px"
  card-sector:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.frame}"
    padding: "20px"
  cta-band:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.band}"
  nav-utility-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    height: "36px"
  nav-main-bar:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    height: "72px"
---

# Design System: Smart Records Center

## Overview

**Creative North Star: "The State Archive, Daylight Edition"**

A formal Indonesian corporate site in the register of IBM, Microsoft Purview and OpenText. Authority comes from two kinds of evidence, never from decoration: real photographs of archives, institutions and people at work, and real product screens that prove each of the seven modules. Navy owns whole regions (the utility bar, photo veils, the audit band, the CTA band, the footer); white and cool mist carry everything that is read; one corporate blue does all the acting.

The site is light only, by the owner's decision: it is read at a desk in office daylight. Density is calm and documentary: wide sections, left-weighted headings, hairline borders, one soft navy shadow reserved for product frames and floating panels. Photography is real Unsplash-License stock with provenance recorded in `docs/IMAGE-CREDITS.md` and a `.webp.json` sidecar beside every file. Copy is formal Bahasa Indonesia throughout; unknown real data is shown as a visible `[DATA ASLI]` placeholder, never invented.

The world refuses the dark neon AI hero, icon-card mosaics, gradient text, eyebrows above headings, pill shapes, em dashes, and invented proof (statistics, client logos, testimonials, certifications).

**Key Characteristics:**
- Navy fields as structural regions, never as accents.
- One action colour (corporate blue) for buttons, links, active states and icons on white.
- Real photography under a navy veil wherever a page opens on an image.
- Product screens framed by the application's own navy app bar, with status colours living only inside them.
- Red Hat superfamily: Display for headings, Text for reading and UI, Mono for record codes and hashes.
- Quiet geometry: 8px controls, 10px inner panels, 12px frames and cards, 16px CTA band, 5px badges.

## Colors

A navy-and-white corporate palette with a single saturated blue for action and a small, quarantined set of record-status colours.

### Primary
- **Corporate Action Blue** (brand): the only action colour. Primary buttons, text links (`link-action`), active nav rule and text, selected tab tile, focus outline, text selection, check icons on white, module icons.
- **Pressed Ink Blue** (brand-ink): hover state of primary buttons and links; the "Peran AI" label and module tags on light grounds.
- **Blue Wash** (brand-wash): the one tinted surface; AI-role notes, hovered menu icon tiles, icon tiles in the platform diagram, "Dibantu AI" labels.
- **On-Navy Blue** (brand-soft): links and check icons that sit on navy fields, where brand blue would not hold contrast.

### Secondary
- **Archive Navy** (navy): owns the utility bar, photographic hero veils, the security/audit band, the CTA band, the footer, and the product-frame app bar. Also the colour of every heading and the permanent-record status.
- **Second Navy** (navy-2): one step lighter, used for the "Inaktif" stage in the lifecycle timeline.

### Tertiary (product frames only)
- **Record Teal** (teal / teal-ink / teal-wash): survives from the old system solely as the "Aktif"/healthy status: active badges, passed-confidence bars, completed steps, "Rantai utuh" chain checks.
- **Pending Amber** (st-pending / st-pending-wash): review-required and pending status, below-threshold confidence.
- **Inactive Slate** (st-inactive) and **Permanent Wash** (st-permanent-wash): inactive and permanent record badges.
- **Destructive Red** (destructive): form errors and destructive actions.

### Neutral
- **Paper White** (white): default page and card surface.
- **Cool Mist** (mist): alternating section bands, quiet page-hero bands, table header rows, hover fill on outline buttons and menu items.
- **Slate Secondary** (secondary): secondary buttons and empty bar tracks.
- **Body Slate** (body): running text on white and mist.
- **Muted Slate** (muted-foreground): captions, breadcrumbs, table column labels, footnotes.
- **Hairline** (border) and **Input Stroke** (input): 1px borders on cards, frames, panels and dividers; outline-button and field strokes.

### Named Rules
**The Navy Owns Regions Rule.** Navy is applied to whole bands and bars (utility bar, veil, audit band, CTA band, footer, app bar), never as a small decorative accent on a white surface. On navy, text is white at 65 to 90% opacity and links are brand-soft.

**The One Action Colour Rule.** Corporate blue is the only colour that means "act here". No second accent, no teal buttons, no blue used decoratively.

**The Status Quarantine Rule.** Teal, amber, slate and destructive status colours live only inside product frames and product excerpts. Marketing surfaces never borrow them.

## Typography

**Display Font:** Red Hat Display (with ui-sans-serif, system-ui)
**Body Font:** Red Hat Text (with ui-sans-serif, system-ui)
**Label/Mono Font:** Red Hat Mono, for record codes, classification codes, dates in the lifecycle, and hashes.

**Character:** One superfamily drawn for a corporate identity program: a tight, confident display cut for navy headings and a text cut tuned for small UI sizes inside product screens. Headings balance-wrap; paragraphs pretty-wrap.

### Hierarchy
- **Display** (700, clamp(2.5rem, 5.2vw, 4.25rem), 1.06, -0.028em): home hero h1, white on the veil.
- **Display, page** (700, clamp(2.25rem, 4.4vw, 3.5rem), 1.06): inner-page hero h1.
- **Headline** (700, clamp(1.875rem, 3vw, 2.5rem), 1.14, -0.022em): every section h2, via SectionHeading.
- **Title** (700, 1.375rem, 1.25, -0.015em): h3 inside sections; card and list titles run 1.125 to 1.25rem bold in the display face.
- **Lead** (400, 1.125rem, 1.7): the paragraph under a heading, capped at 56 to 62ch.
- **Body** (400, 0.9375rem, relaxed): running text in lists, cards and rows; 1rem in tab content.
- **Label** (600, 0.9375rem): buttons, nav triggers, footer links, `link-action`.
- **Small** (13px): footnotes, reference lines, product table cells. Product table column heads are 11px semibold uppercase with wide tracking; this is product UI convention only.
- **Code** (Red Hat Mono, 12.5px in product, -0.01em): record numbers, codes, hashes.

### Named Rules
**The Heading Is Navy Rule.** Every h1 to h4 is Red Hat Display in navy (white on navy fields). Nothing sits above a heading: no eyebrow, kicker or label line.

**The Mono Means Verbatim Rule.** Red Hat Mono appears only on strings an archivist would copy exactly: codes, record numbers, hashes, dates in the record lifecycle.

## Layout

One container (max 1280px, gutters 16px / 24px from 640px / 32px from 1024px). Sections run 80px vertical padding, 112px from 1024px, alternating white and mist bands, punctuated by navy regions. Section heads are left-aligned with a max width of 48rem; a section-level text link ("Bandingkan semua modul") sits right-aligned on the heading's baseline at desktop.

Asymmetric 5/7 grids carry most two-column sections (sticky heading and photo on the left, content on the right); the CTA band splits 7/5 text to photo. The home hero is about 88svh, left-weighted text over a full-bleed photo, with a white module index bar overlapping its bottom edge at md and up; on phones the index becomes a horizontally scrolling strip of 44px-tall links below the hero. Breakpoints are Tailwind defaults (640, 768, 1024, 1280). Under 768px the photo veil turns vertical, keeping the photo readable at the top and gathering navy behind the text at the bottom. Product tables become stacked label/value records under 640px so the deciding column never scrolls away. Headings get scroll padding of 6.5rem under the sticky header.

## Elevation & Depth

Flat by default, with hairline borders doing the separating. Depth is reserved for things that are objects: product frames, floating menus, and hovered link cards. Navy bands and photo veils provide the page's large-scale contrast instead of shadows.

### Shadow Vocabulary
- **Product** (`box-shadow: 0 1px 2px rgb(11 36 71 / 0.06), 0 12px 24px -8px rgb(11 36 71 / 0.12), 0 32px 64px -24px rgb(11 36 71 / 0.22)`): product frames at rest; sector cards and diagram nodes on hover, together with a 2px lift.
- **Hairline lift** (`box-shadow: 0 1px 2px rgb(11 36 71 / 0.06)`): the selected module tab and resting diagram nodes.
- **Button** (`box-shadow: 0 1px 2px rgb(11 36 71 / 0.12)`): primary button only.
- **Header scrolled** (`box-shadow: 0 6px 20px -12px rgb(11 36 71 / 0.3)`): the sticky header once the page scrolls past 8px.

### Named Rules
**The One Navy Shadow Rule.** All shadows are tinted navy (rgb 11 36 71), never neutral black, and the layered product shadow is the only large one.

## Shapes

Quiet, gently squared corners, stepped by role: badges and sample tags 5px, buttons, inputs, icon tiles and nav chips 8px, inner panels, notes and tab triggers 10px, product frames, cards, photo crops and the platform diagram 12px, the CTA band 16px. Nothing is pill-shaped. Fully round shapes appear only as true circles (numbered step markers in the lifecycle and process lists, list dots) and as thin progress or confidence bars inside product frames. Photographs are cropped with `object-cover` into 12px-radius containers or run full-bleed under a veil; they are never framed with borders.

## Components

### Buttons
Corporate and firm: semibold label, no uppercase, no icons by default.
- **Shape:** gently squared (8px).
- **Primary:** brand blue on white text, 40px tall with 16px side padding; hero and CTA use the 48px size with 24px padding. Hover deepens to brand-ink.
- **Outline:** white with input-stroke border and navy text; hover fills mist and darkens the border.
- **Inverse (on navy):** white with navy text, hover mist. **Outline-inverse:** transparent with a 40%-white border and white text, hover 10% white fill.
- **Focus / Active:** 3px ring at 50% brand plus the global 2px brand outline; active nudges down 1px.
- **Pairing:** "Minta Demo" is always the primary; the second action is outline (or outline-inverse on navy).

### Text Links
- **Action link:** semibold brand blue, hover brand-ink plus underline. A trailing arrow appears only on links that move the reader to another page.
- **On navy:** white at 75% (footer, utility bar) brightening to white with underline on hover; section-level links on navy are white with an arrow.

### Badges (product frames only)
- **Style:** 20px tall, 5px radius, 12px semibold, tinted wash plus ink of the status: Aktif teal, Menunggu/review amber, Inaktif slate, Permanen navy on permanent wash, Musnah slate with strike-through.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** white on white or mist sections; navy only for the platform diagram's shared-base slab.
- **Shadow Strategy:** none at rest; product shadow plus 2px lift on hover for link cards.
- **Border:** 1px hairline, turning to 40% brand on hover.
- **Internal Padding:** 20px; sector cards lead with a 4:3 photo that scales to 1.04 on hover.
- **Reason blocks:** no box at all; a 2px navy top rule over a bold title and body text.

### Navigation
- **Utility bar:** navy, 36px, 13px white at 75%, product statement left and two quick links right; hidden under 768px.
- **Main bar:** white, 72px at desktop, hairline bottom border. Triggers are 15px semibold navy; hover and open turn brand; the active section shows brand text plus a 2px brand rule on the bar's bottom edge.
- **Mega panels:** open centred under the bar; items lead with an 8px mist icon tile that turns brand-wash/brand on hover; a side feature carries a real photo or a product excerpt.
- **Mobile:** sheet with accordion groups. A sticky CTA appears on mobile.
- **Breadcrumb:** 14px muted, chevron separators, current page navy medium; white at 70% on photo heroes.

### Page Hero
Two forms. With a photo: full-bleed real photograph under the navy left veil, breadcrumb, white display h1, lead at 85% white, primary plus outline-inverse buttons. Without a photo: a quiet mist band with a hairline bottom border and an optional product visual on a 5/7 grid.

### Product Frame (signature)
The application's own chrome as the screenshot frame: 12px radius, hairline border, product shadow, white body. A navy app bar carries the logo mark, "Modul / Layar" breadcrumb in 12px white, and a "Data contoh" sample tag. Inside: 10px panels, 13px tables with mist header rows and 11px uppercase column heads, status badges, mono codes, and confidence bars with a threshold tick. Under 640px tables become stacked records with a 6.5rem label column.

### CTA Band
A 16px-radius navy slab inside the container on white: 7/5 split, headline and lead left with inverse plus outline-inverse buttons, a real photograph right (hidden below 1024px).

### Audit Band
Full-bleed navy section over a 60%-opacity photograph covered by 90% navy; brand-soft check icons, a bordered `[DATA ASLI]` certification status line, and a live hash-chain verifier framed as product.

### Motion
Motion is quiet and entrance-only, respecting reduced-motion through a global user setting. One easing, `cubic-bezier(0.16, 1, 0.3, 1)`: hero photo settles from 1.06 scale over 1.8s; hero text and scroll reveals rise 24px over 0.9s and 0.55s without hiding content before JavaScript; the lifecycle connector draws once over 1.1s; module tab content fades and rises over 500ms.

## Do's and Don'ts

### Do:
- **Do** give navy whole regions: utility bar, photo veil, audit band, CTA band, footer, product app bar.
- **Do** use corporate blue (brand) as the only action colour, deepening to brand-ink on hover, and brand-soft for links and icons on navy.
- **Do** open photo pages with a real Unsplash-License photograph under the navy veil, and record its provenance in `docs/IMAGE-CREDITS.md` and a `.webp.json` sidecar.
- **Do** prove features with framed product screens carrying the navy app bar and a "Data contoh" tag.
- **Do** keep corners on the role steps: 5px badges, 8px controls, 10px inner panels, 12px frames and cards, 16px CTA band.
- **Do** show unknown real data (address, contact, certification status, logo) as a visible `[DATA ASLI]` placeholder.
- **Do** write every UI string in formal Bahasa Indonesia.

### Don't:
- **Don't** add a dark theme; the site is light only by the owner's decision.
- **Don't** use teal, amber or any status colour outside product frames, and don't use teal for actions.
- **Don't** place eyebrows, kickers or label lines above headings.
- **Don't** use gradient text, decorative glass or blur, or icon-card mosaics.
- **Don't** make any element pill-shaped.
- **Don't** use em dashes in copy.
- **Don't** invent statistics, client logos, testimonials or certifications; standards are listed as design references, "bukan klaim sertifikasi".
- **Don't** use images from Google search or photographs showing third-party logos or branded signage.
- **Don't** use neutral black shadows or shadows on flat marketing cards at rest.

## Logo

The mark is "Arsip Tersimpan" (approved 2026-10-06): a navy system frame (`#0B2447`) whose bottom-right corner is filled by one blue record block (`#1D4ED8`; `#9BB8FF` with a white frame on navy). The site draws the small-size cut from `src/components/logo.tsx` beside the name set in Red Hat Display Bold; masters and the app-icon tile live in `public/brand/`, usage rules in `docs/BRAND.md`.
