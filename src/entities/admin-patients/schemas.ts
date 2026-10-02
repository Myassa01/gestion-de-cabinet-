import { z } from 'zod'

export const createPatientSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Une minuscule, une majuscule et un chiffre requis'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})
export type CreatePatientFormValues = z.infer<typeof createPatientSchema>
