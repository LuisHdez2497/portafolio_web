import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Experience } from '../domain/entities'
import { createExperienceRepository } from '../infrastructure/experience-repository'

const experienceRepository = createExperienceRepository()

export function useExperience() {
  return useRealtimeQuery<Experience[]>(QUERY_KEYS.experience, experienceRepository.subscribe)
}

export function useCreateExperience() {
  return useMutation({
    mutationFn: (item: Omit<Experience, 'id'>) => experienceRepository.create(item),
  })
}

export function useUpdateExperience() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<Experience> }) =>
      experienceRepository.update(input.id, input.changes),
  })
}

export function useRemoveExperience() {
  return useMutation({
    mutationFn: (id: string) => experienceRepository.remove(id),
  })
}
