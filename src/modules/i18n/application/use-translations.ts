import { UI_LABELS, type Locale, type UiLabels } from '../domain/ui-labels'
import { useLanguage } from './language-store'

export interface Translations {
  locale: Locale
  labels: UiLabels
}

export function useTranslations(): Translations {
  const locale = useLanguage((state) => state.locale)
  return { locale, labels: UI_LABELS[locale] }
}
