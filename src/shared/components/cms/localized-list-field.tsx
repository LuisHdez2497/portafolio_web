import { StringListField } from './string-list-field'
import { SUBCARD_CLASS } from './cms-styles'

interface LocalizedListFieldProps {
  label: string
  es: string[]
  en: string[]
  onChangeEs: (value: string[]) => void
  onChangeEn: (value: string[]) => void
}

export function LocalizedListField({ label, es, en, onChangeEs, onChangeEn }: LocalizedListFieldProps) {
  return (
    <div className={SUBCARD_CLASS}>
      <span className="text-sm font-semibold text-gray-100">{label}</span>
      <StringListField label="Español" value={es} onChange={onChangeEs} />
      <StringListField label="English" value={en} onChange={onChangeEn} />
    </div>
  )
}
