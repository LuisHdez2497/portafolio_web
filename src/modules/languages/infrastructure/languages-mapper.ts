import type { DocumentData } from 'firebase/firestore'
import { toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import type { Language } from '../domain/entities'

export function toLanguage(id: string, data: DocumentData): Language {
  return {
    id,
    name: toLocalizedText(data.name),
    level: toLocalizedText(data.level),
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

export function toLanguageDocument(language: Partial<Language>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (language.name !== undefined) document.name = language.name
  if (language.level !== undefined) document.level = language.level
  if (language.order !== undefined) document.order = language.order
  return document
}
