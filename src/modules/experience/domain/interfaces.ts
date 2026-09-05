import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Experience } from './entities'

export interface ExperienceRepository {
  subscribe(onChange: OnChange<Experience[]>, onError: OnError): Unsubscribe
  create(item: Omit<Experience, 'id'>): Promise<void>
  update(id: string, changes: Partial<Experience>): Promise<void>
  remove(id: string): Promise<void>
}
