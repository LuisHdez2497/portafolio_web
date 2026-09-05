import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { useRealtimeQuery } from '@/shared/application/use-realtime-query'
import type { NotificationPrefs, Visit, VisitEventType } from '../domain/entities'
import { createVisitsRepository } from '../infrastructure/visits-repository'

const visitsRepository = createVisitsRepository()

export function useVisits() {
  return useRealtimeQuery<Visit[]>(QUERY_KEYS.visits, visitsRepository.subscribe)
}

export function useNotificationPrefs() {
  return useRealtimeQuery<NotificationPrefs>(QUERY_KEYS.notificationPrefs, visitsRepository.subscribeNotificationPrefs)
}

export function useSetNotificationPref() {
  return useMutation({
    mutationFn: (input: { type: VisitEventType; enabled: boolean }) =>
      visitsRepository.setNotificationPref(input.type, input.enabled),
  })
}

export function useRemoveVisit() {
  return useMutation({ mutationFn: (id: string) => visitsRepository.remove(id) })
}

export function useClearVisits() {
  return useMutation({ mutationFn: (ids: string[]) => visitsRepository.removeMany(ids) })
}
