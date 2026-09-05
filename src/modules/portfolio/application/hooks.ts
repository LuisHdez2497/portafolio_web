import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { Profile } from '../domain/entities'
import { createProfileRepository } from '../infrastructure/profile-repository'

const profileRepository = createProfileRepository()

export function useProfile() {
  return useRealtimeQuery<Profile | null>(QUERY_KEYS.profile, profileRepository.subscribe)
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (changes: Partial<Profile>) => profileRepository.update(changes),
  })
}
