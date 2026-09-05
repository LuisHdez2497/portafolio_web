import { describe, expect, it } from 'vitest'
import { toWhatsAppUrl } from './whatsapp'

describe('toWhatsAppUrl', () => {
  it('conserva solo los dígitos del número internacional', () => {
    expect(toWhatsAppUrl('+52 667 104 8290')).toBe('https://wa.me/526671048290')
  })

  it('acepta un número ya compacto', () => {
    expect(toWhatsAppUrl('526671048290')).toBe('https://wa.me/526671048290')
  })

  it('descarta paréntesis y guiones', () => {
    expect(toWhatsAppUrl('+52 (667) 104-8290')).toBe('https://wa.me/526671048290')
  })

  it('devuelve vacío cuando no hay dígitos', () => {
    expect(toWhatsAppUrl('')).toBe('')
    expect(toWhatsAppUrl('sin número')).toBe('')
  })
})
