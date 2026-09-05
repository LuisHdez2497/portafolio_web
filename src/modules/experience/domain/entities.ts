import type { LocalizedList, LocalizedText } from '@/shared/domain/localized'

export interface Experience {
  id: string
  position: LocalizedText
  company: string
  location: string
  dateRange: string
  responsibilities: LocalizedList
  achievement: LocalizedText
  order: number
}
