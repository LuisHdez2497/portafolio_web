import type { Locale } from '../domain/ui-labels'
import { trackEvent } from '@/shared/analytics/analytics'
import { useLanguage } from '../application/language-store'

const OPTIONS: { code: Locale; label: string; name: string }[] = [
  { code: 'es', label: '🇲🇽 ES', name: 'Español' },
  { code: 'en', label: '🇺🇸 EN', name: 'English' },
]

export function LanguageToggle() {
  const locale = useLanguage((state) => state.locale)
  const setLocale = useLanguage((state) => state.setLocale)

  return (
    <div className="glass-chip top-safe fixed right-4 z-50 flex gap-1 rounded-full p-1 sm:right-6">
      {OPTIONS.map((option) => {
        const active = locale === option.code
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => {
              setLocale(option.code)
              trackEvent('language_change', { locale: option.code })
            }}
            aria-label={option.name}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
              active
                ? 'bg-linear-to-r from-amber-400 to-yellow-500 text-black shadow-[0_2px_10px_rgba(251,191,36,0.45)]'
                : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
