import { z } from 'zod'
import { localizedListSchema, localizedTextSchema } from '@/shared/application/localized-dto'

export const experienceFormSchema = z.object({
  position: localizedTextSchema('El puesto es obligatorio'),
  company: z.string().min(1, 'La empresa es obligatoria'),
  location: z.string(),
  dateRange: z.string().min(1, 'La fecha es obligatoria'),
  responsibilities: localizedListSchema,
  achievement: localizedTextSchema('El logro es obligatorio'),
})

export type ExperienceFormInput = z.infer<typeof experienceFormSchema>
