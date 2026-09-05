import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { SkillCategory } from '../domain/entities'
import { createSkillsRepository } from '../infrastructure/skills-repository'

const skillsRepository = createSkillsRepository()

export function useSkills() {
  return useRealtimeQuery<SkillCategory[]>(QUERY_KEYS.skills, skillsRepository.subscribe)
}

export function useUpdateSkillCategory() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<SkillCategory> }) =>
      skillsRepository.update(input.id, input.changes),
  })
}
