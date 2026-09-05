import { afterEach, describe, expect, it } from 'vitest'
import { confirmDialog, useConfirmStore } from './confirm-store'

afterEach(() => useConfirmStore.setState({ request: null }))

describe('confirmDialog', () => {
  it('registra la solicitud y resuelve true al confirmar', async () => {
    const promise = confirmDialog('¿Seguro?', { confirmLabel: 'Sí' })
    expect(useConfirmStore.getState().request?.message).toBe('¿Seguro?')
    useConfirmStore.getState().respond(true)
    await expect(promise).resolves.toBe(true)
    expect(useConfirmStore.getState().request).toBeNull()
  })

  it('resuelve false al cancelar', async () => {
    const promise = confirmDialog('¿Seguro?')
    useConfirmStore.getState().respond(false)
    await expect(promise).resolves.toBe(false)
  })
})
