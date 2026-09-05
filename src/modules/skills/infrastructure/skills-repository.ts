import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/shared/config/constants'
import { getDb } from '@/shared/firebase'
import type { SkillsRepository } from '../domain/interfaces'
import { toSkillCategory, toSkillCategoryDocument } from './skills-mapper'

export function createSkillsRepository(): SkillsRepository {
  const collectionRef = () => collection(getDb(), COLLECTIONS.skills)

  return {
    subscribe(onChange, onError) {
      return onSnapshot(
        query(collectionRef(), orderBy('order')),
        (snapshot) => onChange(snapshot.docs.map((entry) => toSkillCategory(entry.id, entry.data()))),
        (error) => onError(error),
      )
    },
    async update(id, changes) {
      await updateDoc(doc(getDb(), COLLECTIONS.skills, id), toSkillCategoryDocument(changes))
    },
  }
}
