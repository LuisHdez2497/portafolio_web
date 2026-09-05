import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { EducationRepository } from '../domain/interfaces'
import { toEducation, toEducationDocument } from './education-mapper'

export function createEducationRepository(): EducationRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.education)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toEducation(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(collectionRef(), toEducationDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.education, id), toEducationDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(getDb(), COLLECTIONS.education, id))
    },
  }
}
