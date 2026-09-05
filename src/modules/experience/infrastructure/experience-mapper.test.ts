import { describe, expect, it } from 'vitest'
import { toExperience, toExperienceDocument } from './experience-mapper'

describe('toExperience', () => {
  it('mapea los campos bilingües embebidos', () => {
    const experience = toExperience('bizont', {
      position: { es: 'Desarrollador FullStack', en: 'FullStack Developer' },
      company: 'Bizont.ca',
      location: 'Remoto (Canadá)',
      dateRange: 'Julio 2020 - Noviembre 2021',
      responsibilities: { es: ['Desarrollo', 'Optimización'], en: ['Development', 'Optimization'] },
      achievement: { es: 'Reduje 35%', en: 'Reduced 35%' },
      order: 5,
    })
    expect(experience).toEqual({
      id: 'bizont',
      position: { es: 'Desarrollador FullStack', en: 'FullStack Developer' },
      company: 'Bizont.ca',
      location: 'Remoto (Canadá)',
      dateRange: 'Julio 2020 - Noviembre 2021',
      responsibilities: { es: ['Desarrollo', 'Optimización'], en: ['Development', 'Optimization'] },
      achievement: { es: 'Reduje 35%', en: 'Reduced 35%' },
      order: 5,
    })
  })

  it('rellena campos faltantes con vacíos', () => {
    expect(toExperience('x', {})).toEqual({
      id: 'x',
      position: { es: '', en: '' },
      company: '',
      location: '',
      dateRange: '',
      responsibilities: { es: [], en: [] },
      achievement: { es: '', en: '' },
      order: 0,
    })
  })
})

describe('toExperienceDocument', () => {
  it('incluye solo los campos provistos', () => {
    expect(toExperienceDocument({ position: { es: 'Dev', en: '' }, order: 2 })).toEqual({
      position: { es: 'Dev', en: '' },
      order: 2,
    })
  })
})
