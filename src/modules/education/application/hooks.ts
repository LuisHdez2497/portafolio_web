import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Education } from '../domain/entities'
import { createEducationRepository } from '../infrastructure/education-repository'

const educationRepository = createEducationRepository()

export function useEducation() {
  return useRealtimeQuery<Education[]>(QUERY_KEYS.education, educationRepository.subscribe)
}

export function useCreateEducation() {
  return useMutation({
    mutationFn: (item: Omit<Education, 'id'>) => educationRepository.create(item),
  })
}

export function useUpdateEducation() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<Education> }) =>
      educationRepository.update(input.id, input.changes),
  })
}

export function useRemoveEducation() {
  return useMutation({
    mutationFn: (id: string) => educationRepository.remove(id),
  })
}
