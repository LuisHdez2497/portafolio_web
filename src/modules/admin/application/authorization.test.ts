import { describe, expect, it } from 'vitest'
import { isAdminUser } from './authorization'

const ADMIN = 'admin@example.com'

describe('isAdminUser', () => {
  it('es admin cuando el email verificado coincide con el admin', () => {
    expect(isAdminUser({ uid: '1', email: ADMIN, emailVerified: true }, ADMIN)).toBe(true)
  })

  it('no es admin cuando el email no está verificado', () => {
    expect(isAdminUser({ uid: '1', email: ADMIN, emailVerified: false }, ADMIN)).toBe(false)
  })

  it('no es admin cuando el email no coincide', () => {
    expect(isAdminUser({ uid: '1', email: 'otro@x.com', emailVerified: true }, ADMIN)).toBe(false)
  })

  it('no es admin cuando no hay usuario', () => {
    expect(isAdminUser(null, ADMIN)).toBe(false)
  })
})
