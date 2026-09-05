import { useMemo } from 'react'
import { getEnv } from '@/shared/config/env'
import type { TranslationService } from '../domain/interfaces'
import { createTranslationService } from '../infrastructure/translation-service'

export function useTranslationService(): TranslationService {
  return useMemo(() => createTranslationService(getEnv().VITE_GOOGLE_TRANSLATE_API_KEY), [])
}
