import { beforeEach, describe, expect, it, vi } from 'vitest'

const logEvent = vi.fn()
const getAnalytics = vi.fn(() => 'analyticsInstance')
const isSupported = vi.fn(async () => true)

vi.mock('firebase/analytics', () => ({ getAnalytics, isSupported, logEvent }))
vi.mock('@/shared/firebase', () => ({ app: {} }))
vi.mock('@/shared/config/env', () => ({
  getEnv: () => ({ VITE_FIREBASE_MEASUREMENT_ID: 'G-TEST' }),
}))

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('no envía eventos antes de inicializar', async () => {
    const { trackEvent } = await import('./analytics')
    trackEvent('cv_download')
    expect(logEvent).not.toHaveBeenCalled()
  })

  it('envía eventos tras inicializar con measurement id', async () => {
    const { initAnalytics, trackEvent, trackException } = await import('./analytics')
    await initAnalytics()

    trackEvent('cv_download', { locale: 'es' })
    expect(logEvent).toHaveBeenCalledWith('analyticsInstance', 'cv_download', { locale: 'es' })

    trackException('boom')
    expect(logEvent).toHaveBeenCalledWith('analyticsInstance', 'exception', { description: 'boom', fatal: true })
  })
})
