import { forwardRef, type SelectHTMLAttributes } from 'react'
import { FIELD_CLASS } from './cms-styles'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, options, error, ...props },
  ref,
) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <select ref={ref} className={FIELD_CLASS} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[hsl(230_32%_8%)]">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="block text-sm text-destructive">{error}</span>}
    </label>
  )
})
