import { describe, expect, it } from 'vitest'
import { certificationFormSchema } from './dto'

const valid = {
  name: 'AZ-900: Microsoft Azure Fundamentals',
  issuer: 'Microsoft',
  status: { es: 'En preparación', en: '' },
  credentialUrl: '',
  published: false,
}

describe('certificationFormSchema', () => {
  it('acepta una certificación válida sin credencial ni inglés', () => {
    expect(certificationFormSchema.safeParse(valid).success).toBe(true)
  })

  it('acepta una URL de credencial válida', () => {
    const input = { ...valid, credentialUrl: 'https://learn.microsoft.com/credencial' }
    expect(certificationFormSchema.safeParse(input).success).toBe(true)
  })

  it('rechaza un nombre vacío', () => {
    expect(certificationFormSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rechaza un emisor vacío', () => {
    expect(certificationFormSchema.safeParse({ ...valid, issuer: '' }).success).toBe(false)
  })

  it('rechaza un estado sin español', () => {
    const input = { ...valid, status: { es: '', en: 'In progress' } }
    expect(certificationFormSchema.safeParse(input).success).toBe(false)
  })

  it('rechaza una URL de credencial mal formada', () => {
    expect(certificationFormSchema.safeParse({ ...valid, credentialUrl: 'no-es-url' }).success).toBe(false)
  })

  it('exige declarar si se publica', () => {
    const { published: _omitted, ...sinPublicar } = valid
    expect(certificationFormSchema.safeParse(sinPublicar).success).toBe(false)
  })
})
