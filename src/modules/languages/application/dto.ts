import { z } from 'zod'
import { localizedTextSchema } from '@/shared/application/localized-dto'

export const languageFormSchema = z.object({
  name: localizedTextSchema('El idioma es obligatorio'),
  level: localizedTextSchema('El nivel es obligatorio'),
})

export type LanguageFormInput = z.infer<typeof languageFormSchema>
