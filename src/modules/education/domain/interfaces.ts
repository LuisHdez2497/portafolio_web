import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Education } from './entities'

export interface EducationRepository {
  subscribe(onChange: OnChange<Education[]>, onError: OnError): Unsubscribe
  create(item: Omit<Education, 'id'>): Promise<void>
  update(id: string, changes: Partial<Education>): Promise<void>
  remove(id: string): Promise<void>
}
