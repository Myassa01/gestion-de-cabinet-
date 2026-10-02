import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Une minuscule, une majuscule et un chiffre requis'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  phone: z.string().optional(),
})
export type RegisterFormValues = z.infer<typeof registerSchema>
