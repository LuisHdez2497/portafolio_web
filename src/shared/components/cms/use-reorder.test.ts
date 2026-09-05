import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useReorder } from './use-reorder'

const items = [
  { id: 'a', order: 1 },
  { id: 'b', order: 2 },
  { id: 'c', order: 3 },
]

describe('useReorder', () => {
  it('sube un item intercambiando su order con el anterior', () => {
    const update = vi.fn()
    const { result } = renderHook(() => useReorder(items, update))
    result.current('b', 'up')
    expect(update).toHaveBeenCalledWith({ id: 'b', changes: { order: 1 } })
    expect(update).toHaveBeenCalledWith({ id: 'a', changes: { order: 2 } })
  })

  it('baja un item intercambiando su order con el siguiente', () => {
    const update = vi.fn()
    const { result } = renderHook(() => useReorder(items, update))
    result.current('b', 'down')
    expect(update).toHaveBeenCalledWith({ id: 'b', changes: { order: 3 } })
    expect(update).toHaveBeenCalledWith({ id: 'c', changes: { order: 2 } })
  })

  it('no hace nada en los extremos', () => {
    const update = vi.fn()
    const { result } = renderHook(() => useReorder(items, update))
    result.current('a', 'up')
    result.current('c', 'down')
    expect(update).not.toHaveBeenCalled()
  })
})
