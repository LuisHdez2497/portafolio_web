import { useEffect } from 'react'
import { Trash2, X } from 'lucide-react'
import type { Visit } from '../domain/entities'
import { EVENT_TEXT, deviceOf, fullPlaceOf, mapEmbedUrl, relativeTime } from './visit-format'

interface VisitMapModalProps {
  visit: Visit | null
  onClose: () => void
  onDelete: (visit: Visit) => void
}

function DetailRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-gray-500">{term}</dt>
      <dd className="text-right text-gray-200">{value}</dd>
    </div>
  )
}

function VisitMap({ visit }: { visit: Visit }) {
  const { lat, lng } = visit.geo
  if (lat === undefined || lng === undefined) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-gray-400">
        Ubicación aproximada no disponible en el mapa.
      </p>
    )
  }
  return (
    <iframe
      title={`Mapa de ${fullPlaceOf(visit)}`}
      src={mapEmbedUrl(lat, lng)}
      loading="lazy"
      className="h-56 w-full rounded-xl border border-white/10"
    />
  )
}

export function VisitMapModal({ visit, onClose, onDelete }: VisitMapModalProps) {
  useEffect(() => {
    if (!visit) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visit, onClose])

  if (!visit) return null

  const event = EVENT_TEXT[visit.type]

  return (
    <div role="dialog" aria-modal="true" aria-label={event.label} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="glass-panel relative z-10 w-full max-w-md space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{event.emoji}</span>
            <div>
              <p className="font-semibold text-white">{event.label}</p>
              <p className="text-xs text-gray-400">{relativeTime(visit.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <VisitMap visit={visit} />

        <dl className="space-y-1.5 text-sm">
          <DetailRow term="Ubicación" value={fullPlaceOf(visit)} />
          <DetailRow term="Dispositivo" value={deviceOf(visit)} />
          {visit.detail && <DetailRow term="Detalle" value={visit.detail} />}
        </dl>

        <button
          type="button"
          onClick={() => onDelete(visit)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar visita
        </button>
      </div>
    </div>
  )
}
