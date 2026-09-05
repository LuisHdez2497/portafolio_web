import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { TranslationService } from '@/modules/i18n/domain/interfaces'
import { ExperienceForm } from './experience-editor'

const experience = {
  id: 'e1',
  position: { es: 'Desarrollador', en: '' },
  company: 'Acme',
  location: 'México',
  dateRange: '2020 - 2022',
  responsibilities: { es: ['Backend'], en: [] },
  achievement: { es: 'Migración', en: '' },
  order: 0,
}

const service: TranslationService = {
  isConfigured: true,
  translateText: vi.fn(async (text: string) => (text === 'Desarrollador' ? 'Developer' : 'Migration')),
  translateList: vi.fn(async () => ['Backend EN']),
}

describe('ExperienceForm', () => {
  it('rellena los campos en inglés al traducir', async () => {
    render(<ExperienceForm experience={experience} service={service} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /traducir/i }))
    expect(await screen.findByDisplayValue('Developer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Migration')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Backend EN')).toBeInTheDocument()
  })

  it('envía los valores y el id al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ExperienceForm experience={experience} service={service} onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][1]).toBe('e1')
    expect(onSubmit.mock.calls[0][0].position.es).toBe('Desarrollador')
  })
})
