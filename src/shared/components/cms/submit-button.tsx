import { Loader2 } from 'lucide-react'
import { PRIMARY_BUTTON_CLASS } from './cms-styles'

interface SubmitButtonProps {
  isSubmitting: boolean
  disabled?: boolean
  label?: string
}

export function SubmitButton({ isSubmitting, disabled = false, label = 'Guardar' }: SubmitButtonProps) {
  return (
    <button type="submit" disabled={isSubmitting || disabled} className={PRIMARY_BUTTON_CLASS}>
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {isSubmitting ? 'Guardando…' : label}
    </button>
  )
}
