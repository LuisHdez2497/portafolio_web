import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'
import type { Profile } from './entities'

export interface ProfileRepository {
  subscribe(onChange: OnChange<Profile | null>, onError: OnError): Unsubscribe
  update(changes: Partial<Profile>): Promise<void>
}
