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
import { createEducationRepository } from './education-repository'
import { toEducationDocument } from './education-mapper'

afterEach(() => vi.clearAllMocks())

const degree = { es: 'Ingeniería en Sistemas', en: 'Systems Engineering' }
const status = { es: 'Titulado', en: 'Graduated' }

describe('createEducationRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createEducationRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    onNext({ docs: [{ id: 'ed1', data: () => ({ degree, institution: 'Universidad', status, order: 0 }) }] })
    expect(onChange).toHaveBeenCalledWith([
      { id: 'ed1', degree, institution: 'Universidad', status, order: 0 },
    ])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createEducationRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('crea con el documento mapeado', async () => {
    const input = { degree, institution: 'Instituto', status, order: 1 }
    await createEducationRepository().create(input)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', toEducationDocument(input))
  })

  it('actualiza el documento por id', async () => {
    await createEducationRepository().update('ed1', { status })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toEducationDocument({ status }))
  })

  it('elimina el documento por id', async () => {
    await createEducationRepository().remove('ed1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith('docRef')
  })
})
