import { Languages as LanguagesIcon } from 'lucide-react'
import { GlassCard } from '@/shared/components/ui/glass-card'
import { SectionCard } from '@/shared/components/ui/section-card'
import { localize } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import type { Language } from '../domain/entities'

interface LanguagesSectionProps {
  items: Language[]
}

export function LanguagesSection({ items }: LanguagesSectionProps) {
  const { locale, labels } = useTranslations()

  return (
    <SectionCard icon={LanguagesIcon} title={labels.sections.languages}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {items.map((item) => (
          <GlassCard accent key={item.id}>
            <h3 className="text-lg font-semibold text-white">{localize(locale, item.name)}</h3>
            <p className="mt-1 text-sm font-medium text-amber-300">{localize(locale, item.level)}</p>
          </GlassCard>
        ))}
      </div>
    </SectionCard>
  )
}
