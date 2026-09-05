import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProfileForm } from './profile-editor'

const profile = {
  name: 'Luis',
  location: 'México',
  summary: { es: 'Perfil', en: '' },
  contact: { email: 'a@b.com', phone: '', website: '', linkedin: '', github: '', preferredChannel: 'whatsapp' as const },
}

describe('ProfileForm', () => {
  it('rellena el resumen en inglés al traducir', async () => {
    const translate = vi.fn().mockResolvedValue('Profile')
    render(<ProfileForm profile={profile} isConfigured onSubmit={vi.fn()} translate={translate} />)
    await userEvent.click(screen.getByRole('button', { name: /traducir/i }))
    expect(translate).toHaveBeenCalledWith('Perfil')
    expect(await screen.findByDisplayValue('Profile')).toBeInTheDocument()
  })

  it('envía los valores al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProfileForm profile={profile} isConfigured onSubmit={onSubmit} translate={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].name).toBe('Luis')
    expect(onSubmit.mock.calls[0][0].summary.es).toBe('Perfil')
  })
})
