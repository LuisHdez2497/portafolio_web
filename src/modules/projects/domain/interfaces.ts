import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Project } from './entities'

export interface ProjectRepository {
  subscribe(onChange: OnChange<Project[]>, onError: OnError): Unsubscribe
  create(item: Omit<Project, 'id'>): Promise<void>
  update(id: string, changes: Partial<Project>): Promise<void>
  remove(id: string): Promise<void>
}
