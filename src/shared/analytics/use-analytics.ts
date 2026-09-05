import { useEffect } from 'react'
import { initAnalytics, trackException } from './analytics'

export function useAnalytics(): void {
  useEffect(() => {
    void initAnalytics()

    const onError = (event: ErrorEvent) => trackException(event.message)
    const onRejection = (event: PromiseRejectionEvent) =>
      trackException(event.reason instanceof Error ? event.reason.message : String(event.reason))

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])
}
