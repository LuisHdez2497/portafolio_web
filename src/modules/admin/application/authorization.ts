import type { AdminUser } from '../domain/entities'

export function isAdminUser(user: AdminUser | null, adminEmail: string): boolean {
  return user !== null && user.emailVerified && user.email === adminEmail
}
