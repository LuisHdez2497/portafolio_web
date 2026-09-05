import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useRealtimeQuery } from './use-realtime-query'

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('useRealtimeQuery', () => {
  it('expone los datos que emite la suscripción', async () => {
    const key = ['probe-data']
    const subscribe = vi.fn((onChange: (value: string) => void) => {
      onChange('hola')
      return () => undefined
    })

    const { result } = renderHook(() => useRealtimeQuery<string>(key, subscribe), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data).toBe('hola'))
    expect(result.current.error).toBeNull()
  })

  it('reintenta ante un error transitorio y se recupera sin exponer error', async () => {
    vi.useFakeTimers()
    const key = ['probe-retry']
    let attempt = 0
    const subscribe = vi.fn((onChange: (value: string) => void, onError: (error: Error) => void) => {
      attempt += 1
      if (attempt === 1) onError(new Error('transitorio'))
      else onChange('recuperado')
      return () => undefined
    })

    const { result } = renderHook(() => useRealtimeQuery<string>(key, subscribe), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toBe('recuperado')
    expect(subscribe).toHaveBeenCalledTimes(2)
  })

  it('expone el error solo tras agotar los reintentos', async () => {
    vi.useFakeTimers()
    const key = ['probe-error']
    const failure = new Error('sin permisos')
    const subscribe = vi.fn((_onChange: (value: string) => void, onError: (error: Error) => void) => {
      onError(failure)
      return () => undefined
    })

    const { result } = renderHook(() => useRealtimeQuery<string>(key, subscribe), {
      wrapper: createWrapper(),
    })

    expect(result.current.error).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6100)
    })

    expect(result.current.error).toBe(failure)
    expect(subscribe).toHaveBeenCalledTimes(5)
  })

  it('cancela la suscripción al desmontar', () => {
    const key = ['probe-unmount']
    const unsubscribe = vi.fn()
    const subscribe = vi.fn(() => unsubscribe)

    const { unmount } = renderHook(() => useRealtimeQuery<string>(key, subscribe), {
      wrapper: createWrapper(),
    })
    unmount()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
