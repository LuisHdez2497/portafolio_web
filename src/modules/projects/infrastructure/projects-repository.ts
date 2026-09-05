import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { db } from '@/shared/firebase'
import type { ProjectRepository } from '../domain/interfaces'
import { toProject, toProjectDocument } from './projects-mapper'

export function createProjectRepository(): ProjectRepository {
  const ref = collection(db, COLLECTIONS.projects)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(ref, orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toProject(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async create(item) {
      await addDoc(ref, toProjectDocument(item))
    },
    async update(id, changes) {
      await updateDoc(doc(db, COLLECTIONS.projects, id), toProjectDocument(changes))
    },
    async remove(id) {
      await deleteDoc(doc(db, COLLECTIONS.projects, id))
    },
  }
}
