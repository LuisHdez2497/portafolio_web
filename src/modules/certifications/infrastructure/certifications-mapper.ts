import type { DocumentData } from 'firebase/firestore'
import { toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import type { Certification } from '../domain/entities'

export function toCertification(id: string, data: DocumentData): Certification {
  return {
    id,
    name: data.name ?? '',
    issuer: data.issuer ?? '',
    status: toLocalizedText(data.status),
    credentialUrl: data.credentialUrl ?? '',
    published: data.published === true,
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

export function toCertificationDocument(certification: Partial<Certification>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (certification.name !== undefined) document.name = certification.name
  if (certification.issuer !== undefined) document.issuer = certification.issuer
  if (certification.status !== undefined) document.status = certification.status
  if (certification.credentialUrl !== undefined) document.credentialUrl = certification.credentialUrl
  if (certification.published !== undefined) document.published = certification.published
  if (certification.order !== undefined) document.order = certification.order
  return document
}
