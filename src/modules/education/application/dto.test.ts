import { describe, expect, it } from 'vitest'
import { educationFormSchema } from './dto'

const valid = {
  degree: { es: 'Ingeniería', en: '' },
  institution: 'Universidad',
  status: { es: 'Terminado', en: '' },
}

describe('educationFormSchema', () => {
  it('acepta una educación válida con inglés opcional', () => {
    expect(educationFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rechaza un título sin español', () => {
    expect(educationFormSchema.safeParse({ ...valid, degree: { es: '', en: 'Engineering' } }).success).toBe(false)
  })

  it('rechaza una institución vacía', () => {
    expect(educationFormSchema.safeParse({ ...valid, institution: '' }).success).toBe(false)
  })

  it('rechaza un estado sin español', () => {
    expect(educationFormSchema.safeParse({ ...valid, status: { es: '', en: 'Graduated' } }).success).toBe(false)
  })
})
