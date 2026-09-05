import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CertificationForm } from './certifications-editor'

const certification = {
  id: 'az900',
  name: 'AZ-900: Microsoft Azure Fundamentals',
  issuer: 'Microsoft',
  status: { es: 'En preparación', en: '' },
  credentialUrl: '',
  published: false,
  order: 0,
}

describe('CertificationForm', () => {
  it('rellena el estado en inglés al traducir', async () => {
    const translate = vi.fn(async () => 'In progress')
    render(
      <CertificationForm
        certification={certification}
        isConfigured
        onSubmit={vi.fn()}
        translate={translate}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /traducir/i }))
    expect(await screen.findByDisplayValue('In progress')).toBeInTheDocument()
  })

  it('envía los valores y el id al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <CertificationForm
        certification={certification}
        isConfigured
        onSubmit={onSubmit}
        translate={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][1]).toBe('az900')
    expect(onSubmit.mock.calls[0][0].name).toBe('AZ-900: Microsoft Azure Fundamentals')
    expect(onSubmit.mock.calls[0][0].issuer).toBe('Microsoft')
  })

  it('no envía cuando la URL de la credencial es inválida', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <CertificationForm
        certification={certification}
        isConfigured
        onSubmit={onSubmit}
        translate={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.type(screen.getByLabelText('URL de la credencial'), 'no-es-url')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
