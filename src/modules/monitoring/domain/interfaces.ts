export interface ErrorReport {
  message: string
  stack: string
  componentStack: string
  path: string
  userAgent: string
}

export interface ErrorLogRepository {
  report(report: ErrorReport): Promise<void>
}
