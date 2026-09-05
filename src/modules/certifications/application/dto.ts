import { z } from 'zod'
import { localizedTextSchema } from '@/shared/application/localized-dto'
import { optionalUrl } from '@/shared/application/url-dto'

export const certificationFormSchema = z.object({
  name: z.string().min(1, 'El nombre de la certificación es obligatorio'),
  issuer: z.string().min(1, 'El emisor es obligatorio'),
  status: localizedTextSchema('El estado es obligatorio'),
  credentialUrl: optionalUrl('La URL de la credencial no es válida'),
  published: z.boolean(),
})

export type CertificationFormInput = z.infer<typeof certificationFormSchema>
