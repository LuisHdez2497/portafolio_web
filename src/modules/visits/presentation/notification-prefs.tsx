import type { VisitEventType } from '../domain/entities'
import { useNotificationPrefs, useSetNotificationPref } from '../application/hooks'
import { EVENT_TEXT } from './visit-format'

const EVENT_TYPES = Object.keys(EVENT_TEXT) as VisitEventType[]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

export function NotificationPrefs() {
  const { data: prefs = {} } = useNotificationPrefs()
  const setPref = useSetNotificationPref()

  return (
    <details className="rounded-xl border border-white/[0.08] bg-white/[0.03]">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-gray-300">
        Notificaciones por evento
      </summary>
      <ul className="space-y-3 px-4 pb-4">
        {EVENT_TYPES.map((type) => (
          <li key={type} className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-200">
              {EVENT_TEXT[type].emoji} {EVENT_TEXT[type].label}
            </span>
            <Toggle checked={prefs[type] !== false} onChange={(enabled) => setPref.mutate({ type, enabled })} />
          </li>
        ))}
      </ul>
    </details>
  )
}
