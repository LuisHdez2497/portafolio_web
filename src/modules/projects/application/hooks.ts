import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Project } from '../domain/entities'
import { createProjectRepository } from '../infrastructure/projects-repository'

const projectRepository = createProjectRepository()

export function useProjects() {
  return useRealtimeQuery<Project[]>(QUERY_KEYS.projects, projectRepository.subscribe)
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (item: Omit<Project, 'id'>) => projectRepository.create(item),
  })
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<Project> }) =>
      projectRepository.update(input.id, input.changes),
  })
}

export function useRemoveProject() {
  return useMutation({
    mutationFn: (id: string) => projectRepository.remove(id),
  })
}
