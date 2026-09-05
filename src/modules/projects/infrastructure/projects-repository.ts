import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { ProjectRepository } from '../domain/interfaces'
import { toProject, toProjectDocument } from './projects-mapper'

export function createProjectRepository(): ProjectRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.projects)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toProject(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(collectionRef(), toProjectDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.projects, id), toProjectDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(getDb(), COLLECTIONS.projects, id))
    },
  }
}
