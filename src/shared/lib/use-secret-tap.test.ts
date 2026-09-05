import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSecretTap } from './use-secret-tap'

afterEach(() => {
  vi.useRealTimers()
})

describe('useSecretTap', () => {
  it('dispara tras alcanzar el número de toques dentro de la ventana', () => {
    const onTrigger = vi.fn()
    const { result } = renderHook(() => useSecretTap(onTrigger, 5, 2000))

    for (let index = 0; index < 4; index += 1) result.current()
    expect(onTrigger).not.toHaveBeenCalled()

    result.current()
    expect(onTrigger).toHaveBeenCalledTimes(1)
  })

  it('reinicia el conteo cuando los toques quedan fuera de la ventana', () => {
    vi.useFakeTimers()
    const onTrigger = vi.fn()
    const { result } = renderHook(() => useSecretTap(onTrigger, 3, 1000))

    result.current()
    result.current()
    vi.advanceTimersByTime(1500)
    result.current()
    result.current()
    expect(onTrigger).not.toHaveBeenCalled()

    result.current()
    expect(onTrigger).toHaveBeenCalledTimes(1)
  })
})
