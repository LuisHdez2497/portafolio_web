import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collectionRef'),
  doc: vi.fn(() => 'docRef'),
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(() => 'orderBy'),
  onSnapshot: vi.fn(() => vi.fn()),
  updateDoc: vi.fn(),
  Timestamp: class {},
}))

import * as firestore from 'firebase/firestore'
import { createSkillsRepository } from './skills-repository'
import { toSkillCategoryDocument } from './skills-mapper'

afterEach(() => vi.clearAllMocks())

describe('createSkillsRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createSkillsRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    onNext({
      docs: [
        {
          id: 'frontend',
          data: () => ({
            items: [{ name: 'React', image: 'react.svg', color: '#61dafb' }],
            order: 1,
          }),
        },
      ],
    })
    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'frontend',
        items: [{ name: 'React', image: 'react.svg', color: '#61dafb' }],
        order: 1,
      },
    ])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createSkillsRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('actualiza el documento por id', async () => {
    await createSkillsRepository().update('frontend', { order: 3 })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toSkillCategoryDocument({ order: 3 }))
  })
})
