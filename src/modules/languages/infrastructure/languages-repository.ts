import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { db } from '@/shared/firebase'
import type { LanguagesRepository } from '../domain/interfaces'
import { toLanguage, toLanguageDocument } from './languages-mapper'

export function createLanguagesRepository(): LanguagesRepository {
  const ref = collection(db, COLLECTIONS.languages)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(ref, orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toLanguage(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(ref, toLanguageDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(db, COLLECTIONS.languages, id), toLanguageDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(db, COLLECTIONS.languages, id))
    },
  }
}
