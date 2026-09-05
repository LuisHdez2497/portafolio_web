import type { Visit, VisitEventType } from '../domain/entities'

export interface VisitsSummary {
  total: number
  byType: Partial<Record<VisitEventType, number>>
  topCountries: { country: string; count: number }[]
}

export function summarize(visits: Visit[]): VisitsSummary {
  const byType: Partial<Record<VisitEventType, number>> = {}
  const byCountry = new Map<string, number>()
  for (const visit of visits) {
    byType[visit.type] = (byType[visit.type] ?? 0) + 1
    const country = visit.geo.country
    if (country) byCountry.set(country, (byCountry.get(country) ?? 0) + 1)
  }
  const topCountries = [...byCountry.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
  return { total: visits.length, byType, topCountries }
}

export type VisitFilter = { kind: 'type'; value: VisitEventType } | { kind: 'country'; value: string }

export function matchesFilter(visit: Visit, filter: VisitFilter | null): boolean {
  if (!filter) return true
  if (filter.kind === 'type') return visit.type === filter.value
  return visit.geo.country === filter.value
}

const DAY_MS = 86_400_000

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function dayLabel(date: Date | null, now: Date): string {
  if (!date) return 'Sin fecha'
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
}

export interface VisitGroup {
  label: string
  visits: Visit[]
}

export function groupByDay(visits: Visit[], now: Date): VisitGroup[] {
  const groups: VisitGroup[] = []
  for (const visit of visits) {
    const label = dayLabel(visit.createdAt, now)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.visits.push(visit)
    else groups.push({ label, visits: [visit] })
  }
  return groups
}
