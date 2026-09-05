import {
  TRANSLATE_API_URL,
  TRANSLATE_SOURCE_LANG,
  TRANSLATE_TARGET_LANG,
} from '@/shared/config/constants'
import type { TranslationService } from '../domain/interfaces'

interface TranslateResponse {
  data: { translations: { translatedText: string }[] }
}

async function requestTranslations(apiKey: string, query: string[]): Promise<string[]> {
  const response = await fetch(`${TRANSLATE_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: query,
      source: TRANSLATE_SOURCE_LANG,
      target: TRANSLATE_TARGET_LANG,
      format: 'text',
    }),
  })
  if (!response.ok) {
    throw new Error(`Error de la API de traducción (${response.status})`)
  }
  const payload = (await response.json()) as TranslateResponse
  return payload.data.translations.map((translation) => translation.translatedText)
}

export function createTranslationService(apiKey: string | undefined): TranslationService {
  const isConfigured = Boolean(apiKey)

  const ensureKey = (): string => {
    if (!apiKey) {
      throw new Error('La API key de Google Translate no está configurada')
    }
    return apiKey
  }

  return {
    isConfigured,
    async translateText(text) {
      if (text.trim() === '') return text
      const [translated] = await requestTranslations(ensureKey(), [text])
      return translated ?? text
    },
    async translateList(texts) {
      if (texts.length === 0) return texts
      return requestTranslations(ensureKey(), texts)
    },
  }
}
