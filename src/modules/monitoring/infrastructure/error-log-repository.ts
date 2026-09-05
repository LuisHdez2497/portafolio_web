import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { ErrorLogRepository } from '../domain/interfaces'

export function createErrorLogRepository(): ErrorLogRepository {
  return {
    async report(report) {
      await addDoc(collection(getDb(), COLLECTIONS.errorLogs), {
        ...report,
        createdAt: serverTimestamp(),
      })
    },
  }
}
