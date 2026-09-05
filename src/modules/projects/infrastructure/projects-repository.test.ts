import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ getDb: () => ({}) }))
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
import { createProjectRepository } from './projects-repository'
import { toProjectDocument } from './projects-mapper'

afterEach(() => vi.clearAllMocks())

const title = { es: 'Portafolio', en: 'Portfolio' }
const description = { es: 'Sitio bilingüe', en: 'Bilingual site' }

describe('createProjectRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createProjectRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    onNext({
      docs: [
        {
          id: 'p1',
          data: () => ({ title, description, technologies: ['React'], repoUrl: '', liveUrl: '', published: true, order: 0 }),
        },
      ],
    })
    expect(onChange).toHaveBeenCalledWith([
      { id: 'p1', title, description, technologies: ['React'], repoUrl: '', liveUrl: '', imageUrl: '', published: true, order: 0 },
    ])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createProjectRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('crea con el documento mapeado', async () => {
    const input = { title, description, technologies: ['React'], repoUrl: '', liveUrl: '', imageUrl: '', published: false, order: 1 }
    await createProjectRepository().create(input)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', toProjectDocument(input))
  })

  it('actualiza el documento por id', async () => {
    await createProjectRepository().update('p1', { repoUrl: 'https://github.com/user/repo' })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toProjectDocument({ repoUrl: 'https://github.com/user/repo' }))
  })

  it('elimina el documento por id', async () => {
    await createProjectRepository().remove('p1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith('docRef')
  })
})
