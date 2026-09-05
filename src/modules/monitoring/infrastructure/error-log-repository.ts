import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { db } from '@/shared/firebase'
import type { ErrorLogRepository } from '../domain/interfaces'

export function createErrorLogRepository(): ErrorLogRepository {
  return {
    async report(report) {
      await addDoc(collection(db, COLLECTIONS.errorLogs), {
        ...report,
        createdAt: serverTimestamp(),
      })
    },
  }
}
