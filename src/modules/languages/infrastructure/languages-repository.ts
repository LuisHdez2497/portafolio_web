import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { LanguagesRepository } from '../domain/interfaces'
import { toLanguage, toLanguageDocument } from './languages-mapper'

export function createLanguagesRepository(): LanguagesRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.languages)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toLanguage(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(collectionRef(), toLanguageDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.languages, id), toLanguageDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(getDb(), COLLECTIONS.languages, id))
    },
  }
}
