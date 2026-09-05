import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { CertificationsRepository } from '../domain/interfaces'
import { toCertification, toCertificationDocument } from './certifications-mapper'

export function createCertificationsRepository(): CertificationsRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.certifications)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toCertification(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(collectionRef(), toCertificationDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.certifications, id), toCertificationDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(getDb(), COLLECTIONS.certifications, id))
    },
  }
}
