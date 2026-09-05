import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collectionRef'),
  doc: vi.fn(() => 'docRef'),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(() => 'orderBy'),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}))

import * as firestore from 'firebase/firestore'
import { createLanguagesRepository } from './languages-repository'
import { toLanguageDocument } from './languages-mapper'

afterEach(() => vi.clearAllMocks())

const spanish = { es: 'Español', en: 'Spanish' }
const native = { es: 'Nativo', en: 'Native' }

describe('createLanguagesRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createLanguagesRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    onNext({ docs: [{ id: 'l1', data: () => ({ name: spanish, level: native, order: 0 }) }] })
    expect(onChange).toHaveBeenCalledWith([{ id: 'l1', name: spanish, level: native, order: 0 }])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createLanguagesRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('crea con el documento mapeado', async () => {
    const input = { name: spanish, level: native, order: 1 }
    await createLanguagesRepository().create(input)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', toLanguageDocument(input))
  })

  it('actualiza el documento por id', async () => {
    await createLanguagesRepository().update('l1', { level: native })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toLanguageDocument({ level: native }))
  })

  it('elimina el documento por id', async () => {
    await createLanguagesRepository().remove('l1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith('docRef')
  })
})
