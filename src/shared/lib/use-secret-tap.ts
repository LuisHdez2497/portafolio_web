import { useRef } from 'react'

const DEFAULT_TAPS = 5
const DEFAULT_WINDOW_MS = 2000

export function useSecretTap(
  onTrigger: () => void,
  taps: number = DEFAULT_TAPS,
  windowMs: number = DEFAULT_WINDOW_MS,
): () => void {
  const timestamps = useRef<number[]>([])
  return () => {
    const now = Date.now()
    const recent = timestamps.current.filter((time) => now - time < windowMs)
    recent.push(now)
    timestamps.current = recent
    if (recent.length >= taps) {
      timestamps.current = []
      onTrigger()
    }
  }
}
