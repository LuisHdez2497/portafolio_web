import { z } from 'zod'
import { requiredUrl } from '@/shared/application/url-dto'

export const skillFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  image: requiredUrl('La imagen debe ser una URL http(s) válida'),
  color: z.string().min(1, 'El color es obligatorio'),
})

export type SkillFormInput = z.infer<typeof skillFormSchema>
