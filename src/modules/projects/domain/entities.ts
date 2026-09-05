import type { LocalizedText } from '@/shared/domain/localized'

export interface Project {
  id: string
  title: LocalizedText
  description: LocalizedText
  technologies: string[]
  repoUrl: string
  liveUrl: string
  imageUrl: string
  published: boolean
  order: number
}
