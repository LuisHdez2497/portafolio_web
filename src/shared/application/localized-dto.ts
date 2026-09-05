import { z } from 'zod'

export function localizedTextSchema(requiredMessage: string) {
  return z.object({ es: z.string().min(1, requiredMessage), en: z.string() })
}

export const localizedListSchema = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
})
