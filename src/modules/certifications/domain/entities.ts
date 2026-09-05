import type { LocalizedText } from '@/shared/domain/localized'

export interface Certification {
  id: string
  name: string
  issuer: string
  status: LocalizedText
  credentialUrl: string
  published: boolean
  order: number
}
