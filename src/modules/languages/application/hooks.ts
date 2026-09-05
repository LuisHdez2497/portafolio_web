import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Language } from '../domain/entities'
import { createLanguagesRepository } from '../infrastructure/languages-repository'

const languagesRepository = createLanguagesRepository()

export function useLanguages() {
  return useRealtimeQuery<Language[]>(QUERY_KEYS.languages, languagesRepository.subscribe)
}

export function useCreateLanguage() {
  return useMutation({
    mutationFn: (item: Omit<Language, 'id'>) => languagesRepository.create(item),
  })
}

export function useUpdateLanguage() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<Language> }) =>
      languagesRepository.update(input.id, input.changes),
  })
}

export function useRemoveLanguage() {
  return useMutation({
    mutationFn: (id: string) => languagesRepository.remove(id),
  })
}
