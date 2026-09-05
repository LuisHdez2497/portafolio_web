import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Language } from './entities'

export interface LanguagesRepository {
  subscribe(onChange: OnChange<Language[]>, onError: OnError): Unsubscribe
  create(item: Omit<Language, 'id'>): Promise<void>
  update(id: string, changes: Partial<Language>): Promise<void>
  remove(id: string): Promise<void>
}
