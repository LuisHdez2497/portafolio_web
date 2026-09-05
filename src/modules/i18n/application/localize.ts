import type { LocalizedList, LocalizedText } from '@/shared/domain/localized'
import type { Locale } from '../domain/ui-labels'

export function localize(locale: Locale, text: LocalizedText): string {
  return text[locale] || text.es
}

export function localizeList(locale: Locale, list: LocalizedList): string[] {
  const value = list[locale]
  return value.length > 0 ? value : list.es
}
