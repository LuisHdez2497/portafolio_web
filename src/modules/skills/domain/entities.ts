export interface Skill {
  name: string
  image: string
  color: string
}

export interface SkillCategory {
  id: string
  items: Skill[]
  order: number
}
