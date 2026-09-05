import type { LocalizedText } from '@/shared/domain/localized'

export interface Language {
  id: string
  name: LocalizedText
  level: LocalizedText
  order: number
}
