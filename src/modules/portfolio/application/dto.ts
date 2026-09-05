import { z } from 'zod'
import { localizedTextSchema } from '@/shared/application/localized-dto'
import { optionalUrl } from '@/shared/application/url-dto'

const httpUrl = optionalUrl('Debe ser una URL http(s) válida')

export const profileFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  location: z.string().min(1, 'La ubicación es obligatoria'),
  summary: localizedTextSchema('El perfil profesional es obligatorio'),
  contact: z.object({
    email: z.string().email('Correo inválido'),
    phone: z.string(),
    website: httpUrl,
    linkedin: httpUrl,
    github: httpUrl,
  }),
})

export type ProfileFormInput = z.infer<typeof profileFormSchema>
