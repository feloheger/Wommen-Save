/**
 * Zod-Validierungsschemas für Formulare
 */
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen haben."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Bitte gib deinen Namen ein."),
    email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
    password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen haben."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Bitte gib einen Namen ein."),
  phone: z.string().min(6, "Bitte gib eine gültige Telefonnummer ein."),
  relationship: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
