import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { VisitEventInput, VisitEventType } from '@shared/visit'
import type { NotificationPrefs, Visit } from './entities'

export interface VisitsRepository {
  subscribe(onChange: OnChange<Visit[]>, onError: OnError): Unsubscribe
  record(input: VisitEventInput): Promise<void>
  remove(id: string): Promise<void>
  removeMany(ids: string[]): Promise<void>
  subscribeNotificationPrefs(onChange: OnChange<NotificationPrefs>, onError: OnError): Unsubscribe
  setNotificationPref(type: VisitEventType, enabled: boolean): Promise<void>
}
