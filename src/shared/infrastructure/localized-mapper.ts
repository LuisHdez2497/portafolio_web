import type { LocalizedList, LocalizedText } from '@/shared/domain/localized'

export function toLocalizedText(value: unknown): LocalizedText {
  const localized = value as Partial<LocalizedText> | undefined
  return { es: localized?.es ?? '', en: localized?.en ?? '' }
}

export function toLocalizedList(value: unknown): LocalizedList {
  const localized = value as Partial<LocalizedList> | undefined
  return {
    es: Array.isArray(localized?.es) ? localized.es : [],
    en: Array.isArray(localized?.en) ? localized.en : [],
  }
}
