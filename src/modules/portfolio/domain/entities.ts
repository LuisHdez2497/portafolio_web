import type { LocalizedText } from '@/shared/domain/localized'

export const CONTACT_CHANNELS = ['whatsapp', 'email'] as const

export type ContactChannel = (typeof CONTACT_CHANNELS)[number]

export interface Contact {
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
  preferredChannel: ContactChannel
}

export interface Profile {
  name: string
  location: string
  summary: LocalizedText
  contact: Contact
  updatedAt?: Date
}
