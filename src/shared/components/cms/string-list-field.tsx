import { Plus, Trash2 } from 'lucide-react'
import { FIELD_CLASS } from './cms-styles'

interface StringListFieldProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
}

export function StringListField({ label, value, onChange }: StringListFieldProps) {
  const updateItem = (index: number, next: string) =>
    onChange(value.map((item, position) => (position === index ? next : item)))
  const addItem = () => onChange([...value, ''])
  const removeItem = (index: number) => onChange(value.filter((_, position) => position !== index))

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            className={FIELD_CLASS}
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex shrink-0 items-center rounded-xl border border-destructive/40 px-3 text-destructive transition-colors hover:bg-destructive/10"
            aria-label="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
      >
        <Plus className="h-4 w-4" />
        Agregar
      </button>
    </div>
  )
}
