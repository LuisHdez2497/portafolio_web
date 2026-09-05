import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { SkillCategory } from './entities'

export interface SkillsRepository {
  subscribe(onChange: OnChange<SkillCategory[]>, onError: OnError): Unsubscribe
  update(id: string, changes: Partial<SkillCategory>): Promise<void>
}
