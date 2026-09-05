import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SkillForm } from './skills-editor'

describe('SkillForm', () => {
  it('envía la skill al guardar', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <SkillForm skill={{ name: 'React', image: 'https://cdn.jsdelivr.net/icon.svg', color: '#61dafb' }} onSubmit={onSubmit} onCancel={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].name).toBe('React')
  })

  it('llama onCancel al cancelar', async () => {
    const onCancel = vi.fn()
    render(<SkillForm skill={null} onSubmit={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
