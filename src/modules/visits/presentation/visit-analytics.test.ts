import { describe, expect, it } from 'vitest'
import type { Visit } from '../domain/entities'
import { dayLabel, groupByDay, matchesFilter, summarize } from './visit-analytics'

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

describe('summarize', () => {
  it('cuenta por tipo y ordena países top', () => {
    const summary = summarize([
      makeVisit({ type: 'cv_download', geo: { country: 'México' } }),
      makeVisit({ type: 'cv_download', geo: { country: 'México' } }),
      makeVisit({ type: 'github_click', geo: { country: 'España' } }),
    ])
    expect(summary.total).toBe(3)
    expect(summary.byType.cv_download).toBe(2)
    expect(summary.byType.github_click).toBe(1)
    expect(summary.topCountries[0]).toEqual({ country: 'México', count: 2 })
  })
})

describe('matchesFilter', () => {
  it('filtra por tipo y país, y null pasa todo', () => {
    expect(matchesFilter(makeVisit({ type: 'cv_download' }), { kind: 'type', value: 'cv_download' })).toBe(true)
    expect(matchesFilter(makeVisit({ type: 'github_click' }), { kind: 'type', value: 'cv_download' })).toBe(false)
    expect(matchesFilter(makeVisit({ geo: { country: 'México' } }), { kind: 'country', value: 'México' })).toBe(true)
    expect(matchesFilter(makeVisit({}), null)).toBe(true)
  })
})

describe('dayLabel y groupByDay', () => {
  const now = new Date('2026-07-09T15:00:00')

  it('etiqueta Hoy y Ayer', () => {
    expect(dayLabel(new Date('2026-07-09T08:00:00'), now)).toBe('Hoy')
    expect(dayLabel(new Date('2026-07-08T23:00:00'), now)).toBe('Ayer')
  })

  it('agrupa visitas consecutivas por día', () => {
    const groups = groupByDay(
      [
        makeVisit({ id: 'a', createdAt: new Date('2026-07-09T10:00:00') }),
        makeVisit({ id: 'b', createdAt: new Date('2026-07-09T09:00:00') }),
        makeVisit({ id: 'c', createdAt: new Date('2026-07-08T10:00:00') }),
      ],
      now,
    )
    expect(groups.map((group) => group.label)).toEqual(['Hoy', 'Ayer'])
    expect(groups[0]?.visits).toHaveLength(2)
  })
})
