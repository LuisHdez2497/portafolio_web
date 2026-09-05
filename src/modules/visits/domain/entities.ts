import type { VisitDevice, VisitEventType, VisitGeo } from '@shared/visit'

export type { VisitEventType } from '@shared/visit'

export interface Visit {
  id: string
  type: VisitEventType
  detail: string
  language: string
  referrer: string
  geo: VisitGeo
  device: VisitDevice
  createdAt: Date | null
}

export type NotificationPrefs = Partial<Record<VisitEventType, boolean>>
