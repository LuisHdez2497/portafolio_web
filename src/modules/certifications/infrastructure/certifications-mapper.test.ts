import { describe, expect, it } from 'vitest'
import { toCertification, toCertificationDocument } from './certifications-mapper'

describe('toCertification', () => {
  it('mapea los campos con el estado bilingüe embebido', () => {
    const certification = toCertification('az900', {
      name: 'AZ-900: Microsoft Azure Fundamentals',
      issuer: 'Microsoft',
      status: { es: 'En preparación', en: 'In progress' },
      credentialUrl: 'https://learn.microsoft.com/credencial',
      published: true,
      order: 0,
    })
    expect(certification).toEqual({
      id: 'az900',
      name: 'AZ-900: Microsoft Azure Fundamentals',
      issuer: 'Microsoft',
      status: { es: 'En preparación', en: 'In progress' },
      credentialUrl: 'https://learn.microsoft.com/credencial',
      published: true,
      order: 0,
    })
  })

  it('rellena campos faltantes con vacíos', () => {
    expect(toCertification('x', {})).toEqual({
      id: 'x',
      name: '',
      issuer: '',
      status: { es: '', en: '' },
      credentialUrl: '',
      published: false,
      order: 0,
    })
  })
})

describe('toCertificationDocument', () => {
  it('incluye solo los campos provistos', () => {
    expect(toCertificationDocument({ issuer: 'Microsoft' })).toEqual({ issuer: 'Microsoft' })
  })

  it('conserva una credencial vacía cuando se limpia el campo', () => {
    expect(toCertificationDocument({ credentialUrl: '' })).toEqual({ credentialUrl: '' })
  })
})
