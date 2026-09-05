import { describe, expect, it } from 'vitest'
import { toVisit } from './visits-mapper'

describe('toVisit', () => {
  it('mapea un documento completo', () => {
    const createdAt = new Date('2026-07-09T12:00:00Z')
    const visit = toVisit('abc', {
      type: 'cv_download',
      detail: 'CV en español',
      language: 'es',
      referrer: 'https://google.com',
      geo: { city: 'Guadalajara', region: 'Jalisco', country: 'México', lat: 20.65, lng: -103.35 },
      device: { browser: 'Safari', os: 'iOS', deviceType: 'mobile', brand: 'Apple' },
      createdAt,
    })

    expect(visit).toEqual({
      id: 'abc',
      type: 'cv_download',
      detail: 'CV en español',
      language: 'es',
      referrer: 'https://google.com',
      geo: { city: 'Guadalajara', region: 'Jalisco', country: 'México', lat: 20.65, lng: -103.35 },
      device: { browser: 'Safari', os: 'iOS', deviceType: 'mobile', brand: 'Apple' },
      createdAt,
    })
  })

  it('usa defaults cuando faltan campos', () => {
    const visit = toVisit('x', {})
    expect(visit.type).toBe('contact_click')
    expect(visit.detail).toBe('')
    expect(visit.language).toBe('')
    expect(visit.referrer).toBe('')
    expect(visit.geo).toEqual({})
    expect(visit.device).toEqual({})
    expect(visit.createdAt).toBeNull()
  })

  it('normaliza un tipo desconocido a contact_click', () => {
    expect(toVisit('x', { type: 'weird_value' }).type).toBe('contact_click')
  })

  it('descarta cadenas vacías de geo y dispositivo', () => {
    const visit = toVisit('x', { geo: { city: '', country: 'México' }, device: { brand: '' } })
    expect(visit.geo).toEqual({ country: 'México' })
    expect(visit.device).toEqual({})
  })
})
