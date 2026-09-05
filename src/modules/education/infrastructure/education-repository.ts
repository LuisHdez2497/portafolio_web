import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { db } from '@/shared/firebase'
import type { EducationRepository } from '../domain/interfaces'
import { toEducation, toEducationDocument } from './education-mapper'

export function createEducationRepository(): EducationRepository {
  const ref = collection(db, COLLECTIONS.education)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(ref, orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toEducation(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(ref, toEducationDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(db, COLLECTIONS.education, id), toEducationDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(db, COLLECTIONS.education, id))
    },
  }
}
