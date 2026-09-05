import { describe, expect, it } from 'vitest'
import { languageFormSchema } from './dto'

const valid = { name: { es: 'Español', en: '' }, level: { es: 'Nativo', en: '' } }

describe('languageFormSchema', () => {
  it('acepta un idioma válido con inglés opcional', () => {
    expect(languageFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rechaza un idioma sin español en el nombre', () => {
    expect(languageFormSchema.safeParse({ ...valid, name: { es: '', en: 'Spanish' } }).success).toBe(false)
  })

  it('rechaza un idioma sin español en el nivel', () => {
    expect(languageFormSchema.safeParse({ ...valid, level: { es: '', en: 'Native' } }).success).toBe(false)
  })
})
