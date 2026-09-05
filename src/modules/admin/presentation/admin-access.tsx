import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config/constants'
import { useSecretTap } from '@/shared/lib/use-secret-tap'

export function AdminAccess() {
  const navigate = useNavigate()
  const handleTap = useSecretTap(() => navigate(ROUTES.admin))

  return (
    <button
      type="button"
      aria-label="Acceso administrador"
      tabIndex={-1}
      onClick={handleTap}
      className="fixed bottom-0 right-0 z-[60] h-12 w-12 opacity-0"
    />
  )
}
