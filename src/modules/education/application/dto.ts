import { z } from 'zod'
import { localizedTextSchema } from '@/shared/application/localized-dto'

export const educationFormSchema = z.object({
  degree: localizedTextSchema('El título es obligatorio'),
  institution: z.string().min(1, 'La institución es obligatoria'),
  status: localizedTextSchema('El estado es obligatorio'),
})

export type EducationFormInput = z.infer<typeof educationFormSchema>
