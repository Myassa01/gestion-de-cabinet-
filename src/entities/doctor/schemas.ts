import { z } from 'zod'

export const createDoctorSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Une minuscule, une majuscule et un chiffre requis'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  specialty: z.string().min(1, 'Spécialité requise'),
  bio: z.string().optional(),
  roomNo: z.string().optional(),
})
export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>
