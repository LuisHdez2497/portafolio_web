import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguageForm } from './languages-editor'

const language = {
  id: 'l1',
  name: { es: 'Español', en: '' },
  level: { es: 'Nativo', en: '' },
  order: 0,
}

describe('LanguageForm', () => {
  it('rellena los campos en inglés al traducir', async () => {
    const translate = vi.fn(async (text: string) => (text === 'Español' ? 'Spanish' : 'Native'))
    render(
      <LanguageForm
        language={language}
        isConfigured
        onSubmit={vi.fn()}
        translate={translate}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /traducir/i }))
    expect(await screen.findByDisplayValue('Spanish')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Native')).toBeInTheDocument()
  })

  it('envía los valores y el id al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <LanguageForm
        language={language}
        isConfigured
        onSubmit={onSubmit}
        translate={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][1]).toBe('l1')
    expect(onSubmit.mock.calls[0][0].name.es).toBe('Español')
  })
})
