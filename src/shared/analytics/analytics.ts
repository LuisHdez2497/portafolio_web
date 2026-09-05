import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics'
import { getFirebaseApp } from '@/shared/firebase'
import { getEnv } from '@/shared/config/env'

let instance: Analytics | null = null
let initialized = false

export async function initAnalytics(): Promise<void> {
  if (initialized) return
  initialized = true
  if (!getEnv().VITE_FIREBASE_MEASUREMENT_ID) return
  if (!(await isSupported())) return
  instance = getAnalytics(getFirebaseApp())
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!instance) return
  logEvent(instance, name, params)
}

export function trackException(description: string, fatal = true): void {
  if (!instance) return
  logEvent(instance, 'exception', { description, fatal })
}
