import type { DocumentData } from 'firebase/firestore'
import { toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import { toDate } from '@/shared/firebase/timestamp'
import type { Contact, Profile } from '../domain/entities'

interface ContactDocument {
  email?: string
  phone?: string
  website?: string
  linkedin?: string
  github?: string
}

function toContact(data: ContactDocument | undefined): Contact {
  return {
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    website: data?.website ?? '',
    linkedin: data?.linkedin ?? '',
    github: data?.github ?? '',
  }
}

export function toProfile(data: DocumentData): Profile {
  return {
    name: data.name ?? '',
    location: data.location ?? '',
    summary: toLocalizedText(data.summary),
    contact: toContact(data.contact),
    updatedAt: toDate(data.updatedAt),
  }
}

export function toProfileDocument(profile: Partial<Profile>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (profile.name !== undefined) document.name = profile.name
  if (profile.location !== undefined) document.location = profile.location
  if (profile.summary !== undefined) document.summary = profile.summary
  if (profile.contact !== undefined) document.contact = profile.contact
  return document
}
