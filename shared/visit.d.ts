export type VisitEventType =
  | 'cv_download'
  | 'github_click'
  | 'project_link'
  | 'contact_click'
  | 'linkedin_click'

export interface VisitEventInput {
  type: VisitEventType
  detail?: string
  locale: string
  language: string
  referrer: string
  screen: string
  timezone: string
  userAgent: string
}

export interface VisitGeo {
  city?: string
  region?: string
  country?: string
  lat?: number
  lng?: number
}

export interface VisitDevice {
  browser?: string
  os?: string
  deviceType?: string
  brand?: string
}
