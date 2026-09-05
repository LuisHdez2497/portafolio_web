import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ getFirebaseAuth: () => ({}) }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}))

import * as firebaseAuth from 'firebase/auth'
import { createAuthRepository } from './auth-repository'

afterEach(() => vi.clearAllMocks())

function observedUser(user: unknown) {
  const onChange = vi.fn()
  createAuthRepository().observe(onChange)
  const callback = vi.mocked(firebaseAuth.onAuthStateChanged).mock.calls[0][1] as (value: unknown) => void
  callback(user)
  return onChange
}

describe('createAuthRepository', () => {
  it('mapea el usuario autenticado a AdminUser', () => {
    const onChange = observedUser({ uid: 'u1', email: 'admin@site.com', emailVerified: true })
    expect(onChange).toHaveBeenCalledWith({ uid: 'u1', email: 'admin@site.com', emailVerified: true })
  })

  it('emite null cuando no hay usuario', () => {
    expect(observedUser(null)).toHaveBeenCalledWith(null)
  })

  it('signIn delega en firebase/auth con las credenciales', async () => {
    await createAuthRepository().signIn('admin@site.com', 'secret')
    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'admin@site.com', 'secret')
  })

  it('signOut delega en firebase/auth', async () => {
    await createAuthRepository().signOut()
    expect(firebaseAuth.signOut).toHaveBeenCalledWith({})
  })
})
