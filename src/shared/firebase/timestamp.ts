import { Timestamp } from 'firebase/firestore'

export function toDate(value: unknown): Date | undefined {
  if (value instanceof Timestamp) {
    return value.toDate()
  }
  if (value instanceof Date) {
    return value
  }
  return undefined
}
