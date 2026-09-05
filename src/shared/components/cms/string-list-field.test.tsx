import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StringListField } from './string-list-field'

describe('StringListField', () => {
  it('agrega un elemento vacío al final', async () => {
    const onChange = vi.fn()
    render(<StringListField label="Items" value={['a']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))
    expect(onChange).toHaveBeenCalledWith(['a', ''])
  })

  it('elimina el elemento indicado', async () => {
    const onChange = vi.fn()
    render(<StringListField label="Items" value={['a', 'b']} onChange={onChange} />)
    const [firstRemove] = screen.getAllByRole('button', { name: 'Eliminar' })
    await userEvent.click(firstRemove)
    expect(onChange).toHaveBeenCalledWith(['b'])
  })

  it('actualiza el valor editado', () => {
    const onChange = vi.fn()
    render(<StringListField label="Items" value={['a']} onChange={onChange} />)
    fireEvent.change(screen.getByDisplayValue('a'), { target: { value: 'React' } })
    expect(onChange).toHaveBeenCalledWith(['React'])
  })
})
