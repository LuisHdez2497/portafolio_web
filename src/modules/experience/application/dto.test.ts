import { describe, expect, it } from 'vitest'
import { experienceFormSchema } from './dto'

const valid = {
  position: { es: 'Dev', en: '' },
  company: 'ACME',
  location: '',
  dateRange: '2020-2024',
  responsibilities: { es: ['Una', 'Dos'], en: [] },
  achievement: { es: 'Logro', en: '' },
}

describe('experienceFormSchema', () => {
  it('acepta una experiencia válida con inglés opcional', () => {
    expect(experienceFormSchema.safeParse(valid).success).toBe(true)
  })

  it('acepta ubicación vacía', () => {
    expect(experienceFormSchema.safeParse({ ...valid, location: '' }).success).toBe(true)
  })

  it('rechaza un puesto sin español', () => {
    expect(experienceFormSchema.safeParse({ ...valid, position: { es: '', en: 'Dev' } }).success).toBe(false)
  })

  it('rechaza un logro sin español', () => {
    expect(experienceFormSchema.safeParse({ ...valid, achievement: { es: '', en: 'Win' } }).success).toBe(false)
  })
})
