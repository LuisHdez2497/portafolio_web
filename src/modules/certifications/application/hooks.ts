import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Certification } from '../domain/entities'
import { createCertificationsRepository } from '../infrastructure/certifications-repository'

const certificationsRepository = createCertificationsRepository()

export function useCertifications() {
  return useRealtimeQuery<Certification[]>(QUERY_KEYS.certifications, certificationsRepository.subscribe)
}

export function useCreateCertification() {
  return useMutation({
    mutationFn: (item: Omit<Certification, 'id'>) => certificationsRepository.create(item),
  })
}

export function useUpdateCertification() {
  return useMutation({
    mutationFn: (input: { id: string; changes: Partial<Certification> }) =>
      certificationsRepository.update(input.id, input.changes),
  })
}

export function useRemoveCertification() {
  return useMutation({
    mutationFn: (id: string) => certificationsRepository.remove(id),
  })
}
