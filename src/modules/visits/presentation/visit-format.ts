import type { Visit, VisitEventType } from '../domain/entities'

export const EVENT_TEXT: Record<VisitEventType, { emoji: string; label: string }> = {
  cv_download: { emoji: '📄', label: 'Descargó tu CV' },
  github_click: { emoji: '🐙', label: 'Visitó tu GitHub' },
  linkedin_click: { emoji: '💼', label: 'Visitó tu LinkedIn' },
  project_link: { emoji: '🚀', label: 'Abrió un proyecto' },
  contact_click: { emoji: '✉️', label: 'Tocó un contacto' },
}

const RELATIVE_TIME = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

export function placeOf(visit: Visit): string {
  return [visit.geo.city, visit.geo.country].filter(Boolean).join(', ') || 'Ubicación desconocida'
}

export function fullPlaceOf(visit: Visit): string {
  return [visit.geo.city, visit.geo.region, visit.geo.country].filter(Boolean).join(', ') || 'Ubicación desconocida'
}

export function deviceOf(visit: Visit): string {
  return (
    [visit.device.brand, visit.device.os, visit.device.browser].filter(Boolean).join(' · ') || 'Dispositivo desconocido'
  )
}

export function relativeTime(date: Date | null): string {
  if (!date) return ''
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  for (const [unit, size] of TIME_UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE_TIME.format(Math.round(seconds / size), unit)
  }
  return RELATIVE_TIME.format(seconds, 'second')
}

export function mapEmbedUrl(lat: number, lng: number): string {
  const bbox = [lng - 0.1, lat - 0.06, lng + 0.1, lat + 0.06].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}
