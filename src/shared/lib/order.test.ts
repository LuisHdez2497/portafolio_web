import { describe, expect, it } from 'vitest'
import { nextOrder } from './order'

describe('nextOrder', () => {
  it('devuelve 0 para una lista vacía', () => {
    expect(nextOrder([])).toBe(0)
  })

  it('devuelve max(order) + 1, no la longitud', () => {
    expect(nextOrder([{ order: 1 }, { order: 2 }, { order: 6 }])).toBe(7)
  })

  it('evita colisión tras borrar un elemento intermedio', () => {
    expect(nextOrder([{ order: 0 }, { order: 2 }])).toBe(3)
  })
})
