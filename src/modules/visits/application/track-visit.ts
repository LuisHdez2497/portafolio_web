import type { VisitEventType } from '@shared/visit'
import { useLanguage } from '@/modules/i18n/application/language-store'
import { createVisitsRepository } from '../infrastructure/visits-repository'

const repository = createVisitsRepository()

export function trackVisit(type: VisitEventType, detail?: string): void {
  void repository
    .record({
      type,
      detail: detail ?? '',
      locale: navigator.language,
      language: useLanguage.getState().locale,
      referrer: document.referrer,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
    })
    .catch(() => undefined)
}
