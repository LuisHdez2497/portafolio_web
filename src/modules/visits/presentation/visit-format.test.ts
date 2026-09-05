import { describe, expect, it } from 'vitest'
import type { Visit } from '../domain/entities'
import { deviceOf, fullPlaceOf, mapEmbedUrl, placeOf } from './visit-format'

function makeVisit(over: Partial<Visit>): Visit {
  return {
    id: '1',
    type: 'cv_download',
    detail: '',
    language: 'es',
    referrer: '',
    geo: {},
    device: {},
    createdAt: null,
    ...over,
  }
}

describe('visit-format', () => {
  it('placeOf usa ciudad y país', () => {
    expect(placeOf(makeVisit({ geo: { city: 'Guadalajara', country: 'México' } }))).toBe('Guadalajara, México')
  })

  it('placeOf cae a desconocida sin datos', () => {
    expect(placeOf(makeVisit({}))).toBe('Ubicación desconocida')
  })

  it('fullPlaceOf incluye la región', () => {
    const visit = makeVisit({ geo: { city: 'Guadalajara', region: 'Jalisco', country: 'México' } })
    expect(fullPlaceOf(visit)).toBe('Guadalajara, Jalisco, México')
  })

  it('deviceOf une marca, SO y navegador', () => {
    expect(deviceOf(makeVisit({ device: { brand: 'Apple', os: 'iOS', browser: 'Safari' } }))).toBe('Apple · iOS · Safari')
  })

  it('mapEmbedUrl arma la URL de OSM con el marcador', () => {
    const url = mapEmbedUrl(20.65, -103.35)
    expect(url).toContain('openstreetmap.org/export/embed.html')
    expect(url).toContain('marker=20.65,-103.35')
  })
})
