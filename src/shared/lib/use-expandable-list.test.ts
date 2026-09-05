import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useExpandableList } from './use-expandable-list'

const items = ['a', 'b', 'c', 'd', 'e']

describe('useExpandableList', () => {
  it('muestra solo la vista previa cuando hay más elementos de los que caben', () => {
    const { result } = renderHook(() => useExpandableList(items, 3))
    expect(result.current.visible).toEqual(['a', 'b', 'c'])
    expect(result.current.hiddenCount).toBe(2)
    expect(result.current.canExpand).toBe(true)
    expect(result.current.isExpanded).toBe(false)
  })

  it('muestra todos los elementos al expandir y vuelve a recortar al contraer', () => {
    const { result } = renderHook(() => useExpandableList(items, 3))

    act(() => result.current.toggle())
    expect(result.current.visible).toEqual(items)
    expect(result.current.isExpanded).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.visible).toEqual(['a', 'b', 'c'])
    expect(result.current.isExpanded).toBe(false)
  })

  it('no ofrece expandir cuando los elementos caben en la vista previa', () => {
    const { result } = renderHook(() => useExpandableList(['a', 'b'], 3))
    expect(result.current.visible).toEqual(['a', 'b'])
    expect(result.current.canExpand).toBe(false)
    expect(result.current.hiddenCount).toBe(0)
  })

  it('no ofrece expandir cuando la cantidad es exactamente la de la vista previa', () => {
    const { result } = renderHook(() => useExpandableList(['a', 'b', 'c'], 3))
    expect(result.current.canExpand).toBe(false)
    expect(result.current.visible).toEqual(['a', 'b', 'c'])
  })

  it('devuelve una lista vacía sin ofrecer expandir', () => {
    const { result } = renderHook(() => useExpandableList([], 3))
    expect(result.current.visible).toEqual([])
    expect(result.current.canExpand).toBe(false)
  })
})
