import type { ReactNode } from 'react'
import { LoadingScreen } from '@/shared/components/loading-screen'
import { useAuth } from '../application/auth-store'
import { LoginView } from './login-view'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, initializing } = useAuth()

  if (initializing) {
    return <LoadingScreen />
  }

  if (!isAdmin) {
    return <LoginView />
  }

  return <>{children}</>
}
