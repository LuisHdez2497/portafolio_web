import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { FIELD_CLASS } from './cms-styles'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, ...props },
  ref,
) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <input ref={ref} className={FIELD_CLASS} {...props} />
      {error && <span className="block text-sm text-destructive">{error}</span>}
    </label>
  )
})

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { label, error, ...props },
  ref,
) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <textarea ref={ref} rows={5} className={`${FIELD_CLASS} resize-y leading-relaxed`} {...props} />
      {error && <span className="block text-sm text-destructive">{error}</span>}
    </label>
  )
})
