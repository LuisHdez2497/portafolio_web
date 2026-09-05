import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ getDb: () => ({}) }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'docRef'),
  onSnapshot: vi.fn(() => vi.fn()),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-ts'),
  Timestamp: class {},
}))

import * as firestore from 'firebase/firestore'
import { createProfileRepository } from './profile-repository'
import { toProfile, toProfileDocument } from './profile-mapper'

afterEach(() => vi.clearAllMocks())

function emitSnapshot(exists: boolean, data: Record<string, unknown>) {
  const onChange = vi.fn()
  createProfileRepository().subscribe(onChange, vi.fn())
  const onNext = vi.mocked(firestore.onSnapshot).mock.calls[0][1] as (snapshot: unknown) => void
  onNext({ exists: () => exists, data: () => data })
  return onChange
}

describe('createProfileRepository', () => {
  it('mapea el perfil cuando el documento existe', () => {
    const data = { name: 'Luis', location: 'México', summary: { es: 'r', en: 's' } }
    expect(emitSnapshot(true, data)).toHaveBeenCalledWith(toProfile(data))
  })

  it('emite null cuando el documento no existe', () => {
    expect(emitSnapshot(false, {})).toHaveBeenCalledWith(null)
  })

  it('actualiza añadiendo el serverTimestamp', async () => {
    await createProfileRepository().update({ name: 'Luis Alfonso' })
    expect(firestore.updateDoc).toHaveBeenCalledWith('docRef', {
      ...toProfileDocument({ name: 'Luis Alfonso' }),
      updatedAt: 'server-ts',
    })
  })
})
