import { describe, expect, it } from 'vitest'
import { toLanguage, toLanguageDocument } from './languages-mapper'

describe('toLanguage', () => {
  it('mapea los campos bilingües embebidos', () => {
    const language = toLanguage('espanol', {
      name: { es: 'Español', en: 'Spanish' },
      level: { es: 'Nativo', en: 'Native' },
      order: 0,
    })
    expect(language).toEqual({
      id: 'espanol',
      name: { es: 'Español', en: 'Spanish' },
      level: { es: 'Nativo', en: 'Native' },
      order: 0,
    })
  })

  it('rellena campos faltantes con vacíos', () => {
    expect(toLanguage('x', {})).toEqual({
      id: 'x',
      name: { es: '', en: '' },
      level: { es: '', en: '' },
      order: 0,
    })
  })
})

describe('toLanguageDocument', () => {
  it('incluye solo los campos provistos', () => {
    expect(toLanguageDocument({ level: { es: 'Avanzado', en: 'Advanced' } })).toEqual({
      level: { es: 'Avanzado', en: 'Advanced' },
    })
  })
})
