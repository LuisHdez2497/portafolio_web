import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Certification } from './entities'

export interface CertificationsRepository {
  subscribe(onChange: OnChange<Certification[]>, onError: OnError): Unsubscribe
  create(item: Omit<Certification, 'id'>): Promise<void>
  update(id: string, changes: Partial<Certification>): Promise<void>
  remove(id: string): Promise<void>
}
