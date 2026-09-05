import { describe, expect, it } from 'vitest'
import { localizeDateRange, localizeLocation } from './format-date'

describe('localizeDateRange', () => {
  it('deja la fecha intacta en español', () => {
    expect(localizeDateRange('Enero 2025 - Enero 2026', 'es')).toBe('Enero 2025 - Enero 2026')
  })

  it('traduce los meses al inglés', () => {
    expect(localizeDateRange('Enero 2025 - Enero 2026', 'en')).toBe('January 2025 - January 2026')
    expect(localizeDateRange('Mayo 2024 - Julio 2020', 'en')).toBe('May 2024 - July 2020')
  })

  it('traduce “Presente” en trabajos actuales', () => {
    expect(localizeDateRange('Abril 2026 - Presente', 'en')).toBe('April 2026 - Present')
  })

  it('conserva números y palabras que no son meses', () => {
    expect(localizeDateRange('Noviembre 2021', 'en')).toBe('November 2021')
  })
})

describe('localizeLocation', () => {
  it('deja la ubicación intacta en español', () => {
    expect(localizeLocation('Remoto (Canadá)', 'es')).toBe('Remoto (Canadá)')
  })

  it('traduce términos conocidos al inglés', () => {
    expect(localizeLocation('Remoto', 'en')).toBe('Remote')
    expect(localizeLocation('Híbrido', 'en')).toBe('Hybrid')
    expect(localizeLocation('Remoto (Canadá)', 'en')).toBe('Remote (Canada)')
  })

  it('conserva nombres de ciudad no mapeados', () => {
    expect(localizeLocation('Guadalajara', 'en')).toBe('Guadalajara')
  })
})
