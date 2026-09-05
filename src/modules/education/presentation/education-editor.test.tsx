import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EducationForm } from './education-editor'

const education = {
  id: 'ed1',
  degree: { es: 'Ingeniería', en: '' },
  institution: 'Universidad',
  status: { es: 'Titulado', en: '' },
  order: 0,
}

describe('EducationForm', () => {
  it('rellena los campos en inglés al traducir', async () => {
    const translate = vi.fn(async (text: string) => (text === 'Ingeniería' ? 'Engineering' : 'Graduated'))
    render(
      <EducationForm
        education={education}
        isConfigured
        onSubmit={vi.fn()}
        translate={translate}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /traducir/i }))
    expect(await screen.findByDisplayValue('Engineering')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Graduated')).toBeInTheDocument()
  })

  it('envía los valores y el id al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <EducationForm
        education={education}
        isConfigured
        onSubmit={onSubmit}
        translate={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][1]).toBe('ed1')
    expect(onSubmit.mock.calls[0][0].degree.es).toBe('Ingeniería')
    expect(onSubmit.mock.calls[0][0].institution).toBe('Universidad')
  })
})
