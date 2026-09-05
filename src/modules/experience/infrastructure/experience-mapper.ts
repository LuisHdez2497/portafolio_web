import type { DocumentData } from 'firebase/firestore'
import { toLocalizedList, toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import type { Experience } from '../domain/entities'

export function toExperience(id: string, data: DocumentData): Experience {
  return {
    id,
    position: toLocalizedText(data.position),
    company: data.company ?? '',
    location: data.location ?? '',
    dateRange: data.dateRange ?? '',
    responsibilities: toLocalizedList(data.responsibilities),
    achievement: toLocalizedText(data.achievement),
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

export function toExperienceDocument(experience: Partial<Experience>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (experience.position !== undefined) document.position = experience.position
  if (experience.company !== undefined) document.company = experience.company
  if (experience.location !== undefined) document.location = experience.location
  if (experience.dateRange !== undefined) document.dateRange = experience.dateRange
  if (experience.responsibilities !== undefined) document.responsibilities = experience.responsibilities
  if (experience.achievement !== undefined) document.achievement = experience.achievement
  if (experience.order !== undefined) document.order = experience.order
  return document
}
