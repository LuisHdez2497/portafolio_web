import type { DocumentData } from 'firebase/firestore'
import { toLocalizedText } from '@/shared/infrastructure/localized-mapper'
import type { Project } from '../domain/entities'

export function toProject(id: string, data: DocumentData): Project {
  return {
    id,
    title: toLocalizedText(data.title),
    description: toLocalizedText(data.description),
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    repoUrl: data.repoUrl ?? '',
    liveUrl: data.liveUrl ?? '',
    imageUrl: data.imageUrl ?? '',
    published: data.published === true,
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

export function toProjectDocument(project: Partial<Project>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (project.title !== undefined) document.title = project.title
  if (project.description !== undefined) document.description = project.description
  if (project.technologies !== undefined) document.technologies = project.technologies
  if (project.repoUrl !== undefined) document.repoUrl = project.repoUrl
  if (project.liveUrl !== undefined) document.liveUrl = project.liveUrl
  if (project.imageUrl !== undefined) document.imageUrl = project.imageUrl
  if (project.published !== undefined) document.published = project.published
  if (project.order !== undefined) document.order = project.order
  return document
}
