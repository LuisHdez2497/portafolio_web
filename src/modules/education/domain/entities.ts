import type { LocalizedText } from '@/shared/domain/localized'

export interface Education {
  id: string
  degree: LocalizedText
  institution: string
  status: LocalizedText
  order: number
}
