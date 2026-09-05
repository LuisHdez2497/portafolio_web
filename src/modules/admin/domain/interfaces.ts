import type { OnChange, Unsubscribe } from '@/shared/domain/subscription'
import type { AdminUser } from './entities'

export interface AuthRepository {
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  observe(onChange: OnChange<AdminUser | null>): Unsubscribe
}
