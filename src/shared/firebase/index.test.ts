import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(() => ({ name: 'app' })),
}))
vi.mock('firebase/firestore', () => ({ initializeFirestore: vi.fn(() => ({ type: 'db' })) }))
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({ type: 'auth' })) }))
vi.mock('firebase/storage', () => ({ getStorage: vi.fn(() => ({ type: 'storage' })) }))

import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('inicialización de Firebase', () => {
  it('no toca Firebase al importar el módulo', async () => {
    await import('./index')
    expect(initializeApp).not.toHaveBeenCalled()
    expect(initializeFirestore).not.toHaveBeenCalled()
  })

  it('crea la app en el primer uso y la reutiliza después', async () => {
    const { getDb, getFirebaseAuth, getFirebaseStorage } = await import('./index')

    const first = getDb()
    const second = getDb()
    getFirebaseAuth()
    getFirebaseStorage()

    expect(first).toBe(second)
    expect(initializeApp).toHaveBeenCalledTimes(1)
    expect(initializeFirestore).toHaveBeenCalledTimes(1)
  })

  it('reutiliza una app ya registrada en lugar de crear otra', async () => {
    const { getApps } = await import('firebase/app')
    vi.mocked(getApps).mockReturnValueOnce([{ name: 'existente' }] as never)

    const { getFirebaseApp } = await import('./index')

    expect(getFirebaseApp()).toEqual({ name: 'existente' })
    expect(initializeApp).not.toHaveBeenCalled()
  })
})
