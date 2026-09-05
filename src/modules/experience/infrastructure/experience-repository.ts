import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { db } from '@/shared/firebase'
import type { ExperienceRepository } from '../domain/interfaces'
import { toExperience, toExperienceDocument } from './experience-mapper'

export function createExperienceRepository(): ExperienceRepository {
  const ref = collection(db, COLLECTIONS.experience)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(ref, orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toExperience(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(ref, toExperienceDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(db, COLLECTIONS.experience, id), toExperienceDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(db, COLLECTIONS.experience, id))
    },
  }
}
