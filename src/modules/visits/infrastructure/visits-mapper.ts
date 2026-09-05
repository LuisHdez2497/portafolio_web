import type { DocumentData } from 'firebase/firestore'
import type { VisitDevice, VisitEventType, VisitGeo } from '@shared/visit'
import { toDate } from '@/shared/firebase/timestamp'
import type { Visit } from '../domain/entities'

const EVENT_TYPES: readonly string[] = [
  'cv_download',
  'github_click',
  'linkedin_click',
  'project_link',
  'contact_click',
]

function toEventType(value: unknown): VisitEventType {
  return typeof value === 'string' && EVENT_TYPES.includes(value) ? (value as VisitEventType) : 'contact_click'
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function toGeo(value: unknown): VisitGeo {
  const data = (value ?? {}) as Record<string, unknown>
  return {
    city: optionalString(data.city),
    region: optionalString(data.region),
    country: optionalString(data.country),
    lat: optionalNumber(data.lat),
    lng: optionalNumber(data.lng),
  }
}

function toDevice(value: unknown): VisitDevice {
  const data = (value ?? {}) as Record<string, unknown>
  return {
    browser: optionalString(data.browser),
    os: optionalString(data.os),
    deviceType: optionalString(data.deviceType),
    brand: optionalString(data.brand),
  }
}

export function toVisit(id: string, data: DocumentData): Visit {
  return {
    id,
    type: toEventType(data.type),
    detail: readString(data.detail),
    language: readString(data.language),
    referrer: readString(data.referrer),
    geo: toGeo(data.geo),
    device: toDevice(data.device),
    createdAt: toDate(data.createdAt) ?? null,
  }
}
