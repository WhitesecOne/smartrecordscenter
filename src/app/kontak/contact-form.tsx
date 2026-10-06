"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { sectors, type ContactField } from "@/lib/contact-schema"

import { requestDemo } from "./actions"

const labels: Record<ContactField, string> = {
  nama: "Nama lengkap",
  organisasi: "Organisasi",
  jabatan: "Jabatan",
  email: "Email kerja",
  telepon: "Telepon",
  sektor: "Sektor",
  kebutuhan: "Kebutuhan singkat",
  persetujuan: "Persetujuan kebijakan privasi",
}

const sectorItems = sectors.map((s) => ({ value: s, label: s }))

export function ContactForm() {
  const [state, formAction, pending] = useActionState(requestDemo, {})
  // Fields the visitor has touched since the last failed submit; their stale errors are hidden.
  const [edited, setEdited] = useState<{ at?: number; fields: ContactField[] }>({ fields: [] })
  const touched = edited.at === state.attempt ? edited.fields : []
  const errors = Object.fromEntries(
    Object.entries(state.errors ?? {}).filter(([f]) => !touched.includes(f as ContactField))
  ) as NonNullable<typeof state.errors>
  const markEdited = (f: ContactField) =>
    setEdited((e) => (e.at === state.attempt ? (e.fields.includes(f) ? e : { at: e.at, fields: [...e.fields, f] }) : { at: state.attempt, fields: [f] }))
  const values = state.values ?? {}
  const count = Object.keys(errors).length
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.attempt) summaryRef.current?.focus()
  }, [state.attempt])

  // Wires a control to its hint and error so screen readers read both.
  const a11y = (f: ContactField, hint = false) => {
    const ids = [hint && `${f}-hint`, errors[f] && `${f}-error`].filter(Boolean).join(" ")
    return { id: f, "aria-invalid": errors[f] ? true : undefined, "aria-describedby": ids || undefined }
  }
  const error = (f: ContactField) => (
    // role unset: the summary above already announces every error once.
    <FieldError id={`${f}-error`} role={undefined}>
      {errors[f]}
    </FieldError>
  )
  const text = (f: ContactField, props: React.ComponentProps<"input"> = {}) => (
    <Field data-invalid={errors[f] ? true : undefined}>
      <FieldLabel htmlFor={f}>{labels[f]}</FieldLabel>
      <Input {...a11y(f)} name={f} defaultValue={values[f]} required className="h-11" {...props} />
      {error(f)}
    </Field>
  )

  return (
    // key: remount after each failed submit so every control (Select and Checkbox included) shows the returned values.
    <form
      key={state.attempt ?? 0}
      action={formAction}
      noValidate
      aria-busy={pending}
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name
        if (name in labels) markEdited(name as ContactField)
      }}
    >
      {count > 0 && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive outline-none focus-visible:ring-3 focus-visible:ring-destructive/30"
        >
          <p className="font-semibold">Periksa kembali {count} kolom berikut:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {(Object.keys(errors) as ContactField[]).map((f) => (
              <li key={f}>
                {labels[f]}: {errors[f]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.failed && count === 0 && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive outline-none focus-visible:ring-3 focus-visible:ring-destructive/30"
        >
          <p className="font-semibold">Permintaan belum terkirim karena gangguan di server kami.</p>
          <p className="mt-1">Isian Anda masih tersimpan di formulir ini. Coba kirim lagi beberapa saat lagi, atau hubungi kami langsung lewat email di bagian Kontak langsung.</p>
        </div>
      )}

      <p className="mb-6 text-sm text-muted-foreground">Semua kolom wajib diisi, kecuali yang bertanda opsional.</p>

      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        {text("nama", { autoComplete: "name" })}
        {text("email", { type: "email", autoComplete: "email", inputMode: "email" })}
        {text("organisasi", { autoComplete: "organization" })}
        {text("jabatan", { autoComplete: "organization-title" })}

        <Field data-invalid={errors.telepon ? true : undefined}>
          <FieldLabel htmlFor="telepon">
            Telepon <span className="font-normal text-muted-foreground">(opsional)</span>
          </FieldLabel>
          <Input {...a11y("telepon", true)} name="telepon" type="tel" autoComplete="tel" defaultValue={values.telepon} className="h-11" />
          <FieldDescription id="telepon-hint">Diawali +62 atau 0.</FieldDescription>
          {error("telepon")}
        </Field>

        <Field data-invalid={errors.sektor ? true : undefined}>
          <FieldLabel htmlFor="sektor">Sektor</FieldLabel>
          <Select name="sektor" items={sectorItems} defaultValue={values.sektor || null} onValueChange={() => markEdited("sektor")}>
            <SelectTrigger {...a11y("sektor")} className="h-11 w-full data-[size=default]:h-11 bg-white text-base md:text-sm">
              <SelectValue placeholder="Pilih sektor" />
            </SelectTrigger>
            <SelectContent>
              {sectorItems.map((s) => (
                <SelectItem key={s.value} value={s.value} className="min-h-11 text-base md:min-h-9 md:text-sm">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error("sektor")}
        </Field>

        <Field data-invalid={errors.kebutuhan ? true : undefined} className="sm:col-span-2">
          <FieldLabel htmlFor="kebutuhan">Kebutuhan singkat</FieldLabel>
          <Textarea
            {...a11y("kebutuhan", true)}
            name="kebutuhan"
            defaultValue={values.kebutuhan}
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className="min-h-32"
          />
          <FieldDescription id="kebutuhan-hint">
            Misalnya jenis arsip, jumlah unit kerja, atau sistem yang sedang dipakai. 10 sampai 2.000 karakter.
          </FieldDescription>
          {error("kebutuhan")}
        </Field>

        <Field orientation="horizontal" data-invalid={errors.persetujuan ? true : undefined} className="sm:col-span-2">
          <Checkbox {...a11y("persetujuan", true)} name="persetujuan" defaultChecked={values.persetujuan === "on"} onCheckedChange={() => markEdited("persetujuan")} required className="mt-0.5" />
          <FieldContent>
            <FieldLabel htmlFor="persetujuan" className="leading-snug font-normal text-body">
              Saya setuju data di formulir ini diproses untuk menindaklanjuti permintaan demo.
            </FieldLabel>
            <FieldDescription id="persetujuan-hint">
              <Link href="/kebijakan-privasi" target="_blank" rel="noopener" className="font-medium text-brand">
                Baca kebijakan privasi (tab baru)
              </Link>
            </FieldDescription>
            {error("persetujuan")}
          </FieldContent>
        </Field>
      </FieldGroup>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Jangan isi kolom ini</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-8 w-full sm:w-auto">
        {pending ? (
          <>
            <Spinner role={undefined} aria-label={undefined} aria-hidden />
            Mengirim…
          </>
        ) : (
          "Kirim Permintaan Demo"
        )}
      </Button>
    </form>
  )
}
