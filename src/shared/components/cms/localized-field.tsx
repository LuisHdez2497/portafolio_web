import type { UseFormRegisterReturn } from 'react-hook-form'
import { TextAreaField, TextField } from './text-field'
import { SUBCARD_CLASS } from './cms-styles'

interface LocalizedFieldProps {
  label: string
  es: UseFormRegisterReturn
  en: UseFormRegisterReturn
  error?: string
  multiline?: boolean
}

export function LocalizedField({ label, es, en, error, multiline = false }: LocalizedFieldProps) {
  const Field = multiline ? TextAreaField : TextField
  return (
    <div className={SUBCARD_CLASS}>
      <span className="text-sm font-semibold text-gray-100">{label}</span>
      <Field label="Español" error={error} {...es} />
      <Field label="English" {...en} />
    </div>
  )
}
