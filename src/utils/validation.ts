/**
 * Zod-Schemas für Formulare
 */
import { z } from "zod";

import { normalizePhone } from "@/utils/formatters";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Namen ein."),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => /^\+?\d{6,15}$/.test(v), "Bitte gib eine gültige Telefonnummer ein."),
});

export type ContactFormData = z.input<typeof contactSchema>;
export type ContactParsed = z.output<typeof contactSchema>;
