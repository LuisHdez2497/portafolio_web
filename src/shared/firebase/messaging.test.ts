import { describe, expect, it, vi } from 'vitest'

const vapid = vi.hoisted(() => ({ value: '' }))

vi.mock('@/shared/firebase', () => ({ app: {}, db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  serverTimestamp: vi.fn(),
  setDoc: vi.fn(),
}))
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(),
  getToken: vi.fn(),
  isSupported: vi.fn(async () => false),
}))
vi.mock('@/shared/config/env', () => ({
  getEnv: () => ({
    VITE_FIREBASE_API_KEY: 'k',
    VITE_FIREBASE_AUTH_DOMAIN: 'd',
    VITE_FIREBASE_PROJECT_ID: 'p',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 's',
    VITE_FIREBASE_APP_ID: 'a',
    VITE_FIREBASE_VAPID_KEY: vapid.value,
  }),
}))

const STATUSES = ['granted', 'blocked', 'unsupported', 'default']

describe('messaging', () => {
  it('isPushConfigured refleja si hay VAPID key', async () => {
    const messaging = await import('./messaging')
    vapid.value = ''
    expect(messaging.isPushConfigured()).toBe(false)
    vapid.value = 'BXXXX'
    expect(messaging.isPushConfigured()).toBe(true)
  })

  it('enablePush devuelve unsupported cuando el entorno no soporta push', async () => {
    vapid.value = 'BXXXX'
    const { enablePush } = await import('./messaging')
    await expect(enablePush()).resolves.toBe('unsupported')
  })

  it('refreshPushToken resuelve sin lanzar cuando el permiso no está concedido', async () => {
    vapid.value = 'BXXXX'
    const { refreshPushToken } = await import('./messaging')
    await expect(refreshPushToken()).resolves.toBeUndefined()
  })

  it('currentPushStatus devuelve un estado válido', async () => {
    vapid.value = 'BXXXX'
    const { currentPushStatus } = await import('./messaging')
    expect(STATUSES).toContain(currentPushStatus())
  })
})
