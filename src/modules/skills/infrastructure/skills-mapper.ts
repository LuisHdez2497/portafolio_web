import type { DocumentData } from 'firebase/firestore'
import type { Skill, SkillCategory } from '../domain/entities'

interface SkillDocument {
  name?: string
  image?: string
  color?: string
}

interface SkillCategoryDocument {
  items?: SkillDocument[]
  order?: number
}

function toSkill(data: SkillDocument): Skill {
  return {
    name: data.name ?? '',
    image: data.image ?? '',
    color: data.color ?? '',
  }
}

export function toSkillCategory(id: string, data: DocumentData): SkillCategory {
  const document = data as SkillCategoryDocument
  return {
    id,
    items: (document.items ?? []).map(toSkill),
    order: document.order ?? 0,
  }
}

export function toSkillCategoryDocument(category: Partial<SkillCategory>): Record<string, unknown> {
  const document: Record<string, unknown> = {}
  if (category.items !== undefined) {
    document.items = category.items.map((skill) => ({
      name: skill.name,
      image: skill.image,
      color: skill.color,
    }))
  }
  if (category.order !== undefined) {
    document.order = category.order
  }
  return document
}
