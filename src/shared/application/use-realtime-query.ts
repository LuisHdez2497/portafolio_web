import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { OnChange, OnError, Unsubscribe } from '@/shared/domain/subscription'

export type Subscribe<T> = (onChange: OnChange<T>, onError: OnError) => Unsubscribe

export interface RealtimeResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

const MAX_RETRIES = 4
const RETRY_DELAY_MS = 600

export function useRealtimeQuery<T>(queryKey: QueryKey, subscribe: Subscribe<T>): RealtimeResult<T> {
  const queryClient = useQueryClient()
  const [error, setError] = useState<Error | null>(null)

  const query = useQuery<T>({
    queryKey,
    queryFn: () => new Promise<T>(() => undefined),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  useEffect(() => {
    setError(null)
    let active = true
    let retries = 0
    let unsubscribe: Unsubscribe = () => undefined
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      unsubscribe = subscribe(
        (data) => {
          retries = 0
          setError(null)
          queryClient.setQueryData<T>(queryKey, data)
        },
        (subscriptionError) => {
          unsubscribe()
          if (active && retries < MAX_RETRIES) {
            retries += 1
            retryTimer = setTimeout(connect, RETRY_DELAY_MS * retries)
          } else if (active) {
            setError(subscriptionError)
          }
        },
      )
    }
    connect()

    return () => {
      active = false
      if (retryTimer) clearTimeout(retryTimer)
      unsubscribe()
    }
  }, [queryClient, subscribe, queryKey])

  return {
    data: query.data,
    isLoading: query.isPending && error === null,
    error,
  }
}
