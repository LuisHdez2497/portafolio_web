import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collectionRef'),
  doc: vi.fn(() => 'docRef'),
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(() => 'orderBy'),
  onSnapshot: vi.fn(() => vi.fn()),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}))

import * as firestore from 'firebase/firestore'
import { createExperienceRepository } from './experience-repository'
import { toExperience, toExperienceDocument } from './experience-mapper'

afterEach(() => vi.clearAllMocks())

const position = { es: 'Desarrollador', en: 'Developer' }
const responsibilities = { es: ['Backend'], en: ['Backend'] }
const achievement = { es: 'Migración', en: 'Migration' }

describe('createExperienceRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createExperienceRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    const data = {
      position,
      company: 'Acme',
      location: 'México',
      dateRange: '2020 - 2022',
      responsibilities,
      achievement,
      order: 1,
    }
    onNext({ docs: [{ id: 'e1', data: () => data }] })
    expect(onChange).toHaveBeenCalledWith([toExperience('e1', data)])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createExperienceRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('crea con el documento mapeado', async () => {
    const input = {
      position,
      company: 'Beta',
      location: '',
      dateRange: '2021-2023',
      responsibilities,
      achievement,
      order: 2,
    }
    await createExperienceRepository().create(input)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', toExperienceDocument(input))
  })

  it('actualiza el documento por id', async () => {
    await createExperienceRepository().update('e1', { achievement })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toExperienceDocument({ achievement }))
  })

  it('elimina el documento por id', async () => {
    await createExperienceRepository().remove('e1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith('docRef')
  })
})
