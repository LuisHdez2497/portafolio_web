import type { LocalizedText } from '@/shared/domain/localized'

export interface Contact {
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
}

export interface Profile {
  name: string
  location: string
  summary: LocalizedText
  contact: Contact
  updatedAt?: Date
}
