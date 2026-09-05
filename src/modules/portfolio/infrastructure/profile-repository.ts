import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { COLLECTIONS, PROFILE_DOC } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { ProfileRepository } from '../domain/interfaces'
import { toProfile, toProfileDocument } from './profile-mapper'

export function createProfileRepository(): ProfileRepository {
  const documentRef = () => doc(getDb(), COLLECTIONS.profile, PROFILE_DOC)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        documentRef(),
        (snapshot) => onChange(snapshot.exists() ? toProfile(snapshot.data()) : null),
        (error) => onError(error),
      )
    },
    async update(changes) {
      await updateDoc(documentRef(), { ...toProfileDocument(changes), updatedAt: serverTimestamp() })
    },
  }
}
