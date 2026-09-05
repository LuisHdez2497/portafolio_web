import { beforeEach, describe, expect, it, vi } from 'vitest'

const onSnapshot = vi.fn()
const deleteDoc = vi.fn(async () => undefined)
const batchDelete = vi.fn()
const batchCommit = vi.fn(async () => undefined)

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collectionRef'),
  query: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn((field: string, direction: string) => ({ orderBy: [field, direction] })),
  limit: vi.fn((size: number) => ({ limit: size })),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  doc: vi.fn((_db: unknown, collectionName: string, id: string) => ({ collectionName, id })),
  deleteDoc,
  writeBatch: () => ({ delete: batchDelete, commit: batchCommit }),
  Timestamp: class Timestamp {},
}))

vi.mock('@/shared/firebase', () => ({ db: {} }))

describe('createVisitsRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('record hace POST del evento a /api/recordVisit', async () => {
    const fetchMock = vi.fn(async (_url: string, _options: RequestInit) => ({ status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const { createVisitsRepository } = await import('./visits-repository')

    await createVisitsRepository().record({
      type: 'cv_download',
      detail: 'x',
      locale: 'es-MX',
      language: 'es',
      referrer: '',
      screen: '390x844',
      timezone: 'America/Mexico_City',
      userAgent: 'UA',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/recordVisit', expect.objectContaining({ method: 'POST' }))
    const body = fetchMock.mock.calls[0]?.[1]?.body
    expect(JSON.parse(String(body))).toMatchObject({ type: 'cv_download', detail: 'x' })
    vi.unstubAllGlobals()
  })

  it('subscribe entrega las visitas mapeadas desde el snapshot', async () => {
    onSnapshot.mockImplementation((_query: unknown, next: (snapshot: unknown) => void) => {
      next({ docs: [{ id: '1', data: () => ({ type: 'github_click', detail: '' }) }] })
      return () => undefined
    })
    const onChange = vi.fn()
    const { createVisitsRepository } = await import('./visits-repository')

    const unsubscribe = createVisitsRepository().subscribe(onChange, vi.fn())

    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ id: '1', type: 'github_click' })])
    expect(typeof unsubscribe).toBe('function')
  })

  it('remove borra el documento de la visita', async () => {
    const { createVisitsRepository } = await import('./visits-repository')
    await createVisitsRepository().remove('v1')
    expect(deleteDoc).toHaveBeenCalledWith({ collectionName: 'visits', id: 'v1' })
  })

  it('removeMany borra en lote y hace commit', async () => {
    const { createVisitsRepository } = await import('./visits-repository')
    await createVisitsRepository().removeMany(['a', 'b'])
    expect(batchDelete).toHaveBeenCalledTimes(2)
    expect(batchCommit).toHaveBeenCalledTimes(1)
  })
})
