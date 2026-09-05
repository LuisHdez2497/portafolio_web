import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTranslationService } from './translation-service'

function mockFetch(translations: string[], ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => ({ data: { translations: translations.map((t) => ({ translatedText: t })) } }),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createTranslationService', () => {
  it('no está configurado sin API key', () => {
    expect(createTranslationService(undefined).isConfigured).toBe(false)
  })

  it('está configurado con API key', () => {
    expect(createTranslationService('key').isConfigured).toBe(true)
  })

  it('devuelve el texto vacío sin llamar a la API', async () => {
    const fetchMock = mockFetch([])
    const result = await createTranslationService('key').translateText('   ')
    expect(result).toBe('   ')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('traduce un texto', async () => {
    mockFetch(['Hello'])
    const result = await createTranslationService('key').translateText('Hola')
    expect(result).toBe('Hello')
  })

  it('traduce una lista', async () => {
    mockFetch(['One', 'Two'])
    const result = await createTranslationService('key').translateList(['Uno', 'Dos'])
    expect(result).toEqual(['One', 'Two'])
  })

  it('lanza cuando no hay API key', async () => {
    await expect(createTranslationService(undefined).translateText('Hola')).rejects.toThrow(
      'no está configurada',
    )
  })

  it('lanza ante una respuesta de error de la API', async () => {
    mockFetch([], false, 403)
    await expect(createTranslationService('key').translateText('Hola')).rejects.toThrow('403')
  })
})
