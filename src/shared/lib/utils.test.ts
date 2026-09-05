import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('combina varias clases en una cadena', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('resuelve conflictos de Tailwind quedándose con la última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignora valores falsy', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })
})
