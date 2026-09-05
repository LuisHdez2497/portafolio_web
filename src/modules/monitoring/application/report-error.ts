import type { ErrorInfo } from 'react'
import { createErrorLogRepository } from '../infrastructure/error-log-repository'

const repository = createErrorLogRepository()

export function reportAdminError(error: Error, info: ErrorInfo): void {
  void repository
    .report({
      message: error.message,
      stack: error.stack ?? '',
      componentStack: info.componentStack ?? '',
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    })
    .catch(() => undefined)
}
