import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ErrorInfo } from 'react'

const { report } = vi.hoisted(() => ({ report: vi.fn() }))
vi.mock('../infrastructure/error-log-repository', () => ({
  createErrorLogRepository: () => ({ report }),
}))

import { reportAdminError } from './report-error'

afterEach(() => vi.clearAllMocks())

describe('reportAdminError', () => {
  it('reporta el error con su contexto', () => {
    report.mockResolvedValue(undefined)
    reportAdminError(new Error('crash'), { componentStack: 'at App' } as ErrorInfo)
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'crash', componentStack: 'at App' }),
    )
  })

  it('no lanza si el registro en Firestore falla', () => {
    report.mockRejectedValue(new Error('write failed'))
    expect(() => reportAdminError(new Error('x'), { componentStack: null } as ErrorInfo)).not.toThrow()
  })
})
