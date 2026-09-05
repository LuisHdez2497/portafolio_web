import { forwardRef, type InputHTMLAttributes } from 'react'
import { SUBCARD_CLASS } from './cms-styles'

interface PublishFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  hint: string
}

export const PublishField = forwardRef<HTMLInputElement, PublishFieldProps>(function PublishField(
  { hint, ...props },
  ref,
) {
  return (
    <div className={SUBCARD_CLASS}>
      <label className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-white/20 bg-white/[0.04] accent-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          {...props}
        />
        <span>
          <span className="block text-sm font-semibold text-gray-100">Publicar en el sitio</span>
          <span className="mt-0.5 block text-sm text-gray-400">{hint}</span>
        </span>
      </label>
    </div>
  )
})
