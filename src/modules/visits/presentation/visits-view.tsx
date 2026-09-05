import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { confirmDialog } from '@/shared/components/ui/confirm-store'
import { useClearVisits, useRemoveVisit, useVisits } from '../application/hooks'
import type { Visit } from '../domain/entities'
import { NotificationPrefs } from './notification-prefs'
import { NotificationsToggle } from './notifications-toggle'
import { VisitMapModal } from './visit-map-modal'
import { VisitsSummaryBar } from './visits-summary'
import { EVENT_TEXT, deviceOf, placeOf, relativeTime } from './visit-format'
import { groupByDay, matchesFilter, summarize, type VisitFilter, type VisitGroup } from './visit-analytics'

const ROW_CLASS =
  'flex w-full gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-4 text-left transition-colors hover:border-amber-400/30'

const NOTICE_CLASS = 'rounded-xl border border-white/[0.08] bg-white/[0.05] p-6 text-center text-sm text-gray-400'

function VisitRow({ visit, onSelect }: { visit: Visit; onSelect: (visit: Visit) => void }) {
  const event = EVENT_TEXT[visit.type]
  return (
    <li>
      <button type="button" onClick={() => onSelect(visit)} className={ROW_CLASS}>
        <span className="text-2xl leading-none">{event.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-semibold text-white">{event.label}</p>
            <span className="shrink-0 text-xs text-gray-500">{relativeTime(visit.createdAt)}</span>
          </div>
          {visit.detail && <p className="truncate text-sm text-amber-300/80">{visit.detail}</p>}
          <p className="mt-1 text-sm text-gray-300">{placeOf(visit)}</p>
          <p className="text-xs text-gray-500">{deviceOf(visit)}</p>
        </div>
      </button>
    </li>
  )
}

function VisitGroups({ groups, onSelect }: { groups: VisitGroup[]; onSelect: (visit: Visit) => void }) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{group.label}</h3>
          <ul className="space-y-3">
            {group.visits.map((visit) => (
              <VisitRow key={visit.id} visit={visit} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function VisitsHeader({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-white">Visitas</h2>
        <p className="text-sm text-gray-400">Quién interactuó con tu portafolio, desde dónde y con qué dispositivo.</p>
      </div>
      {count > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.04] p-2 text-gray-300 transition-colors hover:border-red-500/30 hover:text-red-200"
          aria-label="Limpiar todas las visitas"
          title="Limpiar todo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </header>
  )
}

export function VisitsView() {
  const { data: visits = [], isLoading, error } = useVisits()
  const [selected, setSelected] = useState<Visit | null>(null)
  const [filter, setFilter] = useState<VisitFilter | null>(null)
  const removeVisit = useRemoveVisit()
  const clearVisits = useClearVisits()

  const groups = groupByDay(
    visits.filter((visit) => matchesFilter(visit, filter)),
    new Date(),
  )

  const handleDelete = async (visit: Visit) => {
    if (await confirmDialog('¿Eliminar esta visita?', { confirmLabel: 'Eliminar', danger: true })) {
      await removeVisit.mutateAsync(visit.id)
      setSelected(null)
    }
  }

  const handleClear = async () => {
    if (await confirmDialog(`¿Eliminar las ${visits.length} visitas?`, { confirmLabel: 'Eliminar todo', danger: true })) {
      await clearVisits.mutateAsync(visits.map((visit) => visit.id))
    }
  }

  return (
    <section className="space-y-4">
      <VisitsHeader count={visits.length} onClear={() => void handleClear()} />
      <NotificationsToggle />
      <NotificationPrefs />
      {visits.length > 0 && <VisitsSummaryBar summary={summarize(visits)} filter={filter} onFilter={setFilter} />}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        </div>
      )}
      {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">No se pudieron cargar las visitas.</p>}
      {!isLoading && !error && visits.length === 0 && <p className={NOTICE_CLASS}>Aún no hay visitas registradas.</p>}
      {!isLoading && !error && visits.length > 0 && groups.length === 0 && (
        <p className={NOTICE_CLASS}>No hay visitas con ese filtro.</p>
      )}
      <VisitGroups groups={groups} onSelect={setSelected} />
      <VisitMapModal visit={selected} onClose={() => setSelected(null)} onDelete={(visit) => void handleDelete(visit)} />
    </section>
  )
}
