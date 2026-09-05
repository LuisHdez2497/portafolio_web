import { describe, expect, it } from 'vitest'
import { loginSchema } from './dto'

describe('loginSchema', () => {
  it('acepta credenciales válidas', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true)
  })

  it('rechaza un email inválido', () => {
    expect(loginSchema.safeParse({ email: 'no-es-email', password: '123456' }).success).toBe(false)
  })

  it('rechaza una contraseña demasiado corta', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123' }).success).toBe(false)
  })
})
