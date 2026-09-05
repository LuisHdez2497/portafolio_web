import { afterEach, describe, expect, it } from 'vitest'
import { useConfirmStore } from '@/shared/components/ui/confirm-store'
import { confirmDiscardIfDirty, useUnsavedStore } from './use-unsaved-changes'

afterEach(() => {
  useUnsavedStore.setState({ dirty: false })
  useConfirmStore.setState({ request: null })
})

describe('confirmDiscardIfDirty', () => {
  it('continúa sin preguntar cuando no hay cambios sin guardar', async () => {
    await expect(confirmDiscardIfDirty()).resolves.toBe(true)
  })

  it('bloquea y conserva el estado si se cancela el descarte', async () => {
    useUnsavedStore.setState({ dirty: true })
    const promise = confirmDiscardIfDirty()
    useConfirmStore.getState().respond(false)
    await expect(promise).resolves.toBe(false)
    expect(useUnsavedStore.getState().dirty).toBe(true)
  })

  it('continúa y limpia el estado si se acepta descartar', async () => {
    useUnsavedStore.setState({ dirty: true })
    const promise = confirmDiscardIfDirty()
    useConfirmStore.getState().respond(true)
    await expect(promise).resolves.toBe(true)
    expect(useUnsavedStore.getState().dirty).toBe(false)
  })
})
