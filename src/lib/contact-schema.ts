import { z } from "zod"

export const sectors = ["Instansi Pemerintah", "BUMN/BUMD", "Perbankan & Keuangan", "Korporasi", "Lainnya"] as const

const text = (label: string, max: number) =>
  z.string().trim().min(1, `Masukkan ${label}.`).max(max, `${label[0].toUpperCase()}${label.slice(1)} maksimal ${max} karakter.`)

export const contactSchema = z.object({
  nama: text("nama lengkap Anda", 120),
  organisasi: text("nama organisasi Anda", 160),
  jabatan: text("jabatan Anda", 120),
  email: z
    .string()
    .trim()
    .min(1, "Masukkan email kerja Anda.")
    .max(200, "Email maksimal 200 karakter.")
    .pipe(z.email("Format email belum valid. Contoh: nama@organisasi.co.id.")),
  // Optional. Spaces, dashes, dots and brackets are dropped before the +62/0 prefix is checked.
  telepon: z
    .string()
    .transform((v) => v.replace(/[\s\-().]/g, ""))
    .refine((v) => v === "" || /^(\+62|0)[1-9]\d{7,11}$/.test(v), "Gunakan nomor Indonesia yang diawali +62 atau 0, misalnya 0812 3456 7890."),
  sektor: z.enum(sectors, "Pilih sektor organisasi Anda."),
  kebutuhan: z
    .string()
    .trim()
    .min(10, "Jelaskan kebutuhan Anda minimal 10 karakter.")
    .max(2000, "Kebutuhan maksimal 2.000 karakter."),
  persetujuan: z.literal("on", "Centang persetujuan kebijakan privasi untuk melanjutkan."),
})

export type ContactField = keyof z.input<typeof contactSchema>
export type ContactData = z.output<typeof contactSchema>
export type ContactState = {
  errors?: Partial<Record<ContactField, string>>
  values?: Partial<Record<ContactField, string>>
  /** Bumped on every failed submit so the form remounts with the returned values. */
  attempt?: number
  /** Set when the data was valid but could not be delivered; the visitor's values are kept. */
  failed?: boolean
}

const fields = Object.keys(contactSchema.shape) as ContactField[]

export function parseContact(formData: FormData): { data: ContactData } | Required<Pick<ContactState, "errors" | "values">> {
  const values = Object.fromEntries(fields.map((f) => [f, String(formData.get(f) ?? "")])) as Record<ContactField, string>
  const result = contactSchema.safeParse(values)
  if (result.success) return { data: result.data }
  const errors: Partial<Record<ContactField, string>> = {}
  for (const issue of result.error.issues) {
    const f = issue.path[0] as ContactField
    errors[f] ??= issue.message
  }
  return { errors, values }
}
