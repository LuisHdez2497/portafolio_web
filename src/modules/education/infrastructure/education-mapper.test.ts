import { describe, expect, it } from 'vitest'
import { toEducation, toEducationDocument } from './education-mapper'

describe('toEducation', () => {
  it('mapea los campos bilingües embebidos', () => {
    const education = toEducation('itc', {
      degree: { es: 'Ingeniería en TIC', en: 'ICT Engineering' },
      institution: 'Instituto Tecnológico de Culiacán',
      status: { es: 'Titulado', en: 'Graduated' },
      order: 0,
    })
    expect(education).toEqual({
      id: 'itc',
      degree: { es: 'Ingeniería en TIC', en: 'ICT Engineering' },
      institution: 'Instituto Tecnológico de Culiacán',
      status: { es: 'Titulado', en: 'Graduated' },
      order: 0,
    })
  })

  it('rellena campos faltantes con vacíos', () => {
    expect(toEducation('x', {})).toEqual({
      id: 'x',
      degree: { es: '', en: '' },
      institution: '',
      status: { es: '', en: '' },
      order: 0,
    })
  })
})

describe('toEducationDocument', () => {
  it('incluye solo los campos provistos', () => {
    expect(toEducationDocument({ status: { es: 'Titulado', en: 'Graduated' } })).toEqual({
      status: { es: 'Titulado', en: 'Graduated' },
    })
  })
})
