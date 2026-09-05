import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VisitEventInput } from '@shared/visit'

const record = vi.fn(async (_input: VisitEventInput) => undefined)

vi.mock('../infrastructure/visits-repository', () => ({
  createVisitsRepository: () => ({ record, subscribe: vi.fn() }),
}))

vi.mock('@/modules/i18n/application/language-store', () => ({
  useLanguage: { getState: () => ({ locale: 'en' }) },
}))

describe('trackVisit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envía el evento con el contexto del cliente', async () => {
    const { trackVisit } = await import('./track-visit')
    trackVisit('cv_download', 'CV en español')

    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cv_download',
        detail: 'CV en español',
        language: 'en',
        userAgent: expect.any(String),
        timezone: expect.any(String),
        screen: expect.any(String),
      }),
    )
  })

  it('usa cadena vacía cuando no hay detalle', async () => {
    const { trackVisit } = await import('./track-visit')
    trackVisit('github_click')
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ detail: '' }))
  })

  it('no lanza cuando el registro falla', async () => {
    record.mockRejectedValueOnce(new Error('network'))
    const { trackVisit } = await import('./track-visit')
    expect(() => trackVisit('contact_click', 'Email')).not.toThrow()
    await Promise.resolve()
  })
})
