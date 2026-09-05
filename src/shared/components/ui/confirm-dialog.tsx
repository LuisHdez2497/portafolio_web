import { useConfirmStore } from '@/shared/components/ui/confirm-store'

const CANCEL_CLASS =
  'inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'

const DANGER_CLASS =
  'inline-flex items-center justify-center rounded-full bg-linear-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300'

const PRIMARY_CLASS =
  'glass-cta inline-flex items-center justify-center rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

export function ConfirmDialog() {
  const request = useConfirmStore((state) => state.request)
  const respond = useConfirmStore((state) => state.respond)

  if (!request) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => respond(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="glass-panel relative w-full max-w-sm space-y-5 p-6">
        <p className="text-sm leading-relaxed text-gray-100">{request.message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => respond(false)} className={CANCEL_CLASS}>
            {request.cancelLabel ?? 'Cancelar'}
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => respond(true)}
            className={request.danger ? DANGER_CLASS : PRIMARY_CLASS}
          >
            {request.confirmLabel ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
