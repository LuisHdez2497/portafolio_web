import type { DocumentData } from 'firebase/firestore'
import { toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import type { Education } from '../domain/entities'

export function toEducation(id: string, data: DocumentData): Education {
  return {
    id,
    degree: toLocalizedText(data.degree),
    institution: data.institution ?? '',
    status: toLocalizedText(data.status),
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

export function toEducationDocument(education: Partial<Education>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (education.degree !== undefined) document.degree = education.degree
  if (education.institution !== undefined) document.institution = education.institution
  if (education.status !== undefined) document.status = education.status
  if (education.order !== undefined) document.order = education.order
  return document
}
