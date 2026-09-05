import { useEffect } from 'react'
import { create } from 'zustand'
import { getEnv } from '@/shared/config/env'
import type { AdminUser } from '../domain/entities'
import { createAuthRepository } from '../infrastructure/auth-repository'
import { isAdminUser } from './authorization'

const authRepository = createAuthRepository()

interface AuthState {
  user: AdminUser | null
  initializing: boolean
  setUser: (user: AdminUser | null) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
}))

let observerStarted = false

const INIT_TIMEOUT_MS = 3500

function ensureObserver() {
  if (observerStarted) {
    return
  }
  observerStarted = true
  authRepository.observe((user) => useAuthStore.getState().setUser(user))
  setTimeout(() => {
    const state = useAuthStore.getState()
    if (state.initializing) {
      state.setUser(state.user)
    }
  }, INIT_TIMEOUT_MS)
}

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const initializing = useAuthStore((state) => state.initializing)

  useEffect(ensureObserver, [])

  return {
    user,
    initializing,
    isAdmin: isAdminUser(user, getEnv().VITE_ADMIN_EMAIL),
    signIn: authRepository.signIn,
    signOut: authRepository.signOut,
  }
}
