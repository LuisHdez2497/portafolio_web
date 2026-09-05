import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Visit } from '../domain/entities'
import { useVisits } from '../application/hooks'
import { VisitsView } from './visits-view'

vi.mock('../application/hooks', () => ({
  useVisits: vi.fn(),
  useRemoveVisit: () => ({ mutateAsync: vi.fn() }),
  useClearVisits: () => ({ mutateAsync: vi.fn() }),
  useNotificationPrefs: () => ({ data: {}, isLoading: false, error: null }),
  useSetNotificationPref: () => ({ mutate: vi.fn() }),
}))

const mockUseVisits = vi.mocked(useVisits)

describe('VisitsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el estado vacío cuando no hay visitas', () => {
    mockUseVisits.mockReturnValue({ data: [], isLoading: false, error: null })
    render(<VisitsView />)
    expect(screen.getByText('Aún no hay visitas registradas.')).toBeInTheDocument()
  })

  it('muestra una visita con acción, lugar y dispositivo', () => {
    const visit: Visit = {
      id: '1',
      type: 'cv_download',
      detail: 'CV en español',
      language: 'es',
      referrer: '',
      geo: { city: 'Guadalajara', country: 'México' },
      device: { brand: 'Apple', os: 'iOS', browser: 'Safari' },
      createdAt: new Date(),
    }
    mockUseVisits.mockReturnValue({ data: [visit], isLoading: false, error: null })
    render(<VisitsView />)

    expect(screen.getByText('Descargó tu CV')).toBeInTheDocument()
    expect(screen.getByText('CV en español')).toBeInTheDocument()
    expect(screen.getByText('Guadalajara, México')).toBeInTheDocument()
    expect(screen.getByText('Apple · iOS · Safari')).toBeInTheDocument()
  })
})
