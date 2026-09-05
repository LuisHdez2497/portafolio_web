import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { AdminAccess } from '@/modules/admin/presentation/admin-access'
import { AdminDashboard } from '@/modules/admin/presentation/admin-dashboard'
import { AdminGuard } from '@/modules/admin/presentation/admin-guard'
import { useAuth } from '@/modules/admin/application/auth-store'
import { reportAdminError } from '@/modules/monitoring/application/report-error'
import { PortfolioView } from '@/modules/portfolio/presentation/portfolio-view'
import { initAnalytics, trackException } from '@/shared/analytics/analytics'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { ErrorFallback } from '@/shared/components/error-fallback'
import { LoadingScreen } from '@/shared/components/loading-screen'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { queryClient } from '@/shared/lib/query-client'
import { ROUTES } from '@/shared/config/constants'

function reportPublicError(error: Error): void {
  void initAnalytics().then(() => trackException(error.message))
}

function PublicRoute() {
  const { isAdmin, initializing } = useAuth()
  const [params] = useSearchParams()

  if (initializing) return <LoadingScreen />
  if (isAdmin && !params.has('ver')) return <Navigate to={ROUTES.admin} replace />
  return <PortfolioView isAdmin={isAdmin} />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path={ROUTES.home}
            element={
              <>
                <ErrorBoundary
                  onError={reportPublicError}
                  fallback={<ErrorFallback description="Por el momento no está disponible. Vuelve a intentarlo en un momento." />}
                >
                  <PublicRoute />
                </ErrorBoundary>
                <AdminAccess />
              </>
            }
          />
          <Route
            path={ROUTES.admin}
            element={
              <ErrorBoundary
                onError={reportAdminError}
                fallback={<ErrorFallback description="Ocurrió un error en el panel. Recarga para continuar." />}
              >
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </ErrorBoundary>
            }
          />
        </Routes>
      </BrowserRouter>
      <ConfirmDialog />
    </QueryClientProvider>
  )
}
