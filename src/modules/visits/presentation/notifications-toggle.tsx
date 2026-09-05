import { useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { currentPushStatus, enablePush, isPushConfigured, type PushStatus } from '@/shared/firebase/messaging'

type State = PushStatus | 'working'

const HINTS: Partial<Record<State, string>> = {
  blocked: 'Permiso bloqueado. Actívalo en los ajustes del navegador para este sitio.',
  unsupported: 'Para recibir notificaciones en iPhone, instala la app en la pantalla de inicio y ábrela desde ahí.',
  error: 'No se pudo activar. Revisa tu conexión e inténtalo de nuevo.',
}

export function NotificationsToggle() {
  const [state, setState] = useState<State>(currentPushStatus)

  if (!isPushConfigured()) return null

  if (state === 'granted') {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
        <BellRing className="h-4 w-4 shrink-0" />
        Notificaciones activadas en este dispositivo.
      </p>
    )
  }

  const handleEnable = async () => {
    setState('working')
    setState(await enablePush())
  }

  const hint = HINTS[state]

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4">
      <button
        type="button"
        onClick={() => void handleEnable()}
        disabled={state === 'working' || state === 'blocked'}
        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Bell className="h-4 w-4" />
        {state === 'working' ? 'Activando…' : 'Activar notificaciones push'}
      </button>
      {hint && <p className="mt-2 text-xs text-amber-200/80">{hint}</p>}
    </div>
  )
}
