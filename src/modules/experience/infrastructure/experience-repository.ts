import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { ExperienceRepository } from '../domain/interfaces'
import { toExperience, toExperienceDocument } from './experience-mapper'

export function createExperienceRepository(): ExperienceRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.experience)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toExperience(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(collectionRef(), toExperienceDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.experience, id), toExperienceDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(getDb(), COLLECTIONS.experience, id))
    },
  }
}
