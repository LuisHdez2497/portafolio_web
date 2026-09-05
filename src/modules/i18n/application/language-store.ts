import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '../domain/ui-labels'

interface LanguageState {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggle: () => void
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
      toggle: () => set((state) => ({ locale: state.locale === 'es' ? 'en' : 'es' })),
    }),
    { name: 'portfolio-language' },
  ),
)
