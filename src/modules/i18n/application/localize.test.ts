import { describe, expect, it } from 'vitest'
import { localize, localizeList } from './localize'

describe('localize', () => {
  it('devuelve el texto en el idioma pedido', () => {
    expect(localize('en', { es: 'Hola', en: 'Hello' })).toBe('Hello')
    expect(localize('es', { es: 'Hola', en: 'Hello' })).toBe('Hola')
  })

  it('cae al español cuando el inglés está vacío', () => {
    expect(localize('en', { es: 'Hola', en: '' })).toBe('Hola')
  })
})

describe('localizeList', () => {
  it('devuelve la lista en el idioma pedido', () => {
    expect(localizeList('en', { es: ['a'], en: ['b'] })).toEqual(['b'])
  })

  it('cae al español cuando la lista en inglés está vacía', () => {
    expect(localizeList('en', { es: ['a'], en: [] })).toEqual(['a'])
  })
})
