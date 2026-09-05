import type { ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { confirmDialog } from '@/shared/components/ui/confirm-store'
import { EditorSection } from './editor-section'
import { BACK_LINK_CLASS, PRIMARY_BUTTON_CLASS } from './cms-styles'
import type { MoveDirection } from './use-reorder'

interface EntityRow {
  id: string
  label: string
}

interface EntityEditorShellProps {
  title: string
  description?: string
  rows: EntityRow[]
  selectedId: string | null
  isNew: boolean
  onSelect: (id: string) => void
  onAddNew: () => void
  onDelete: (id: string) => void
  onClose: () => void
  onMove?: (id: string, direction: MoveDirection) => void
  children: ReactNode
}

interface EntityRowListProps {
  rows: EntityRow[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onMove?: (id: string, direction: MoveDirection) => void
}

const MOVE_BUTTON = 'p-0.5 text-gray-500 transition-colors hover:text-gray-200 disabled:opacity-30'

function MoveControls({ onUp, onDown, isFirst, isLast }: { onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="flex shrink-0 flex-col">
      <button type="button" onClick={onUp} disabled={isFirst} aria-label="Subir" className={MOVE_BUTTON}>
        <ChevronUp className="h-4 w-4" />
      </button>
      <button type="button" onClick={onDown} disabled={isLast} aria-label="Bajar" className={MOVE_BUTTON}>
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

async function confirmDelete(label: string, onDelete: () => void) {
  if (await confirmDialog(`¿Eliminar “${label || 'este elemento'}”?`, { confirmLabel: 'Eliminar', danger: true })) {
    onDelete()
  }
}

function EntityRowList({ rows, onSelect, onDelete, onMove }: EntityRowListProps) {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-500">Aún no hay elementos. Agrega el primero.</p>
  }
  return (
    <ul className="space-y-2">
      {rows.map((row, index) => (
        <li key={row.id}>
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.05]">
            {onMove && (
              <MoveControls
                onUp={() => onMove(row.id, 'up')}
                onDown={() => onMove(row.id, 'down')}
                isFirst={index === 0}
                isLast={index === rows.length - 1}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect(row.id)}
              className="flex flex-1 items-center gap-2 truncate text-left text-sm text-gray-100"
            >
              <span className="flex-1 truncate">{row.label || 'Sin título'}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete(row.label, () => onDelete(row.id))}
              className="rounded-lg p-2.5 text-gray-500 transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function EntityEditorShell(props: EntityEditorShellProps) {
  const { title, description, rows, selectedId, isNew, onSelect, onAddNew, onDelete, onClose, onMove, children } = props
  const editing = isNew || selectedId !== null

  return (
    <EditorSection title={title} description={description}>
      {editing ? (
        <div className="space-y-4">
          <button type="button" onClick={onClose} className={BACK_LINK_CLASS}>
            <ChevronLeft className="h-4 w-4" />
            Volver a la lista
          </button>
          {children}
        </div>
      ) : (
        <div className="space-y-3">
          <button type="button" onClick={onAddNew} className={`w-full ${PRIMARY_BUTTON_CLASS}`}>
            <Plus className="h-4 w-4" />
            Agregar nuevo
          </button>
          <EntityRowList rows={rows} onSelect={onSelect} onDelete={onDelete} onMove={onMove} />
        </div>
      )}
    </EditorSection>
  )
}
