import { collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, setDoc, writeBatch } from 'firebase/firestore'
import type { VisitEventInput, VisitEventType } from '@shared/visit'
import { COLLECTIONS, NOTIFICATION_PREFS_DOC } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { NotificationPrefs } from '../domain/entities'
import type { VisitsRepository } from '../domain/interfaces'
import { toVisit } from './visits-mapper'

const RECORD_ENDPOINT = '/api/recordVisit'
const VISITS_LIMIT = 100

export function createVisitsRepository(): VisitsRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.visits)
  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('createdAt', 'desc'), limit(VISITS_LIMIT)),
        (snapshot) => onChange(snapshot.docs.map((entry) => toVisit(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async record(input: VisitEventInput) {
      await fetch(RECORD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        keepalive: true,
      })
    },
    async remove(id: string) {
      await deleteDoc(doc(getDb(), COLLECTIONS.visits, id))
    },
    async removeMany(ids: string[]) {
      const batch = writeBatch(getDb())
      for (const id of ids) batch.delete(doc(getDb(), COLLECTIONS.visits, id))
      await batch.commit()
    },
    subscribeNotificationPrefs(onChange, onError) {
      return onSnapshot(
        doc(getDb(), COLLECTIONS.config, NOTIFICATION_PREFS_DOC),
        (snapshot) => onChange((snapshot.data() ?? {}) as NotificationPrefs),
        (error) => onError(error),
      )
    },
    async setNotificationPref(type: VisitEventType, enabled: boolean) {
      await setDoc(doc(getDb(), COLLECTIONS.config, NOTIFICATION_PREFS_DOC), { [type]: enabled }, { merge: true })
    },
  }
}
