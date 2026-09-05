import { z } from 'zod'
import { localizedTextSchema } from '@/shared/application/localized-dto'
import { optionalUrl } from '@/shared/application/url-dto'

export const projectFormSchema = z.object({
  title: localizedTextSchema('El título es obligatorio'),
  description: localizedTextSchema('La descripción es obligatoria'),
  technologies: z.array(z.string()),
  repoUrl: optionalUrl('Debe ser una URL http(s) válida'),
  liveUrl: optionalUrl('Debe ser una URL http(s) válida'),
  imageUrl: z.string(),
  published: z.boolean(),
})

export type ProjectFormInput = z.infer<typeof projectFormSchema>
