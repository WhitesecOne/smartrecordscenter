# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui + Motion (user's standing preference for professional sites). Local development first; no deploy target decided.

## Users

- **Decision makers** at organizations that hold regulated records (government agencies, state-owned enterprises, banks, large companies): records managers (arsiparis), compliance/legal officers, CIO/IT heads. They evaluate whether this platform can replace scattered file shares and paper archives.
- **Operators** (records staff, auditors) who use the demo app to see how a record moves from capture to preservation.

## Product Purpose

Smart Records Center is a digital records governance platform ("tata kelola arsip digital"): every record is stored in its organization's own tenant space, described with standard metadata, classified against the organization's taxonomy, found again through full-text and metadata search, moved Active → Inactive → Permanent by a retention rules engine, disposed of through an approval workflow, and leaves an immutable audit trail that feeds compliance reporting. Every module has an AI capability that proposes and a person who confirms. Success: a visitor understands the seven modules and the lifecycle, and requests a demo/consultation.

## Positioning

Governance and AI are two sides of the same pipeline, not add-ons: the rules (policy, BCS, retention, access, disposition) are enforced on every record automatically, and every automated decision is itself recorded as evidence.

## Operating Context

Structure (user requirement, 2026-10-06; replaces the earlier five-part structure). Seven modules, named only in Bahasa Indonesia on the site:
- Repositori Arsip (Records Repository): structured storage with secure multi-tenant separation. AI: duplicate detection.
- Pencarian & Temu Kembali (Search & Retrieval): full-text and metadata search, filtered by access rights. AI: OCR and meaning-based search.
- Manajemen Metadata (Metadata Management): schema per extended Dublin Core and ISO 23081. AI: metadata extraction with confidence and source.
- Klasifikasi Arsip (Classification): classification taxonomy configurable per organization. AI: classification proposals.
- Retensi & Penyusutan (Retention & Disposition): retention-schedule rules engine and disposition workflow. AI: personal-data and misclassification risk flags before disposition.
- Jejak Audit (Audit Trail): immutable log of every action on records. AI: abnormal-access detection.
- Pelaporan (Reporting): compliance dashboards and operational reports for customers and regulators. AI: draft findings summary for review.

Records-management vocabulary (use the Indonesian terms on the site, not English acronyms such as BCS): klasifikasi arsip, JRA (jadwal retensi arsip), retensi aktif/inaktif, disposisi/penyusutan, berita acara, arsip vital, arsip permanen.

## Capabilities and Constraints

- Current focus (user, 2026-09-26): the complete public website, final and formal, Bahasa Indonesia first. English version comes later. A demo app with sample data is deferred.
- Page set (2026-10-06): Beranda; Modul index + 7 module pages; Platform (Ikhtisar, Cara Kerja, Arsitektur & Integrasi, Keamanan & Kepatuhan); Industri (was Solusi; /solusi redirects); Mengapa Kami; Tentang Kami; Kontak/Minta Demo; Terima Kasih; Kebijakan Privasi; Syarat & Ketentuan; 404. Header: Modul, Platform, Industri, Perusahaan, Kontak, Minta Demo.
- Visual direction (user, 2026-10-06, revised the same day): formal corporate, craft bar IBM / Microsoft Purview / OpenText. The product's own screens are the primary visual (home hero is the dashboard mockup, module heroes show each module's screen). Photography only shows digital infrastructure and buildings: no people and no physical-archive objects (shelves, paper, binders). Photos come from free-license sources with recorded provenance, never from Google image search.
- Placeholders (user, 2026-10-06): no visible [DATA ASLI] markers. Legal entity name is "Smart Records Center" until a registered entity exists; facts that cannot be invented (NIB, leaders, history, certifications) are omitted rather than faked.
- Undecided: company/legal entity name, pricing model, certifications held, integrations actually supported, hosting model (cloud/on-prem).

## Brand Commitments

Name: "Smart Records Center". Tone requested: formal, professional, modern.

## Evidence on Hand

None yet. No customers, logos, testimonials, certifications, or statistics exist. Do not fabricate them. Contact details and legal entity use visible `[DATA ASLI]` placeholders until the user supplies them.

## Product Principles

1. Governance first: every feature is explained by the rule it enforces.
2. Show the lifecycle, don't just list modules.
3. Evidence over claims: automated actions are traceable and auditable.
4. Formal clarity: plain, precise language a records manager and an auditor both trust.

## Accessibility & Inclusion

WCAG 2.2 AA for public and demo pages.
