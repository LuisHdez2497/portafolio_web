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
import { createCertificationsRepository } from './certifications-repository'
import { toCertificationDocument } from './certifications-mapper'

afterEach(() => vi.clearAllMocks())

const status = { es: 'En preparación', en: 'In progress' }

describe('createCertificationsRepository', () => {
  it('mapea los documentos del snapshot a entidades', () => {
    const onChange = vi.fn()
    createCertificationsRepository().subscribe(onChange, vi.fn())
    const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
    onNext({
      docs: [
        {
          id: 'az900',
          data: () => ({ name: 'AZ-900', issuer: 'Microsoft', status, credentialUrl: '', published: true, order: 0 }),
        },
      ],
    })
    expect(onChange).toHaveBeenCalledWith([
      { id: 'az900', name: 'AZ-900', issuer: 'Microsoft', status, credentialUrl: '', published: true, order: 0 },
    ])
  })

  it('propaga el error de la suscripción', () => {
    const onError = vi.fn()
    createCertificationsRepository().subscribe(vi.fn(), onError)
    const emitError = vi.mocked(firestore.onSnapshot).mock.calls[0][2] as unknown as (error: Error) => void
    const error = new Error('boom')
    emitError(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('crea con el documento mapeado', async () => {
    const input = { name: 'AZ-104', issuer: 'Microsoft', status, credentialUrl: '', published: false, order: 1 }
    await createCertificationsRepository().create(input)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', toCertificationDocument(input))
  })

  it('actualiza el documento por id', async () => {
    await createCertificationsRepository().update('az900', { status })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', toCertificationDocument({ status }))
  })

  it('elimina el documento por id', async () => {
    await createCertificationsRepository().remove('az900')
    expect(firestore.deleteDoc).toHaveBeenCalledWith('docRef')
  })
})
