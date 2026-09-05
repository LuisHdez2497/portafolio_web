import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collectionRef'),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'serverTs'),
}))

import * as firestore from 'firebase/firestore'
import { createErrorLogRepository } from './error-log-repository'

afterEach(() => vi.clearAllMocks())

const report = {
  message: 'boom',
  stack: 'at foo',
  componentStack: 'at App',
  path: '/admin',
  userAgent: 'jsdom',
}

describe('createErrorLogRepository', () => {
  it('escribe el reporte con marca de tiempo del servidor', async () => {
    await createErrorLogRepository().report(report)
    expect(firestore.addDoc).toHaveBeenCalledWith('collectionRef', { ...report, createdAt: 'serverTs' })
  })
})
