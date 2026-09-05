import { Award } from 'lucide-react'
import { GlassCard } from '@/shared/components/ui/glass-card'
import { SectionCard } from '@/shared/components/ui/section-card'
import { localizeDateRange, localizeLocation } from '@/modules/i18n/application/format-date'
import { localize, localizeList } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import type { Experience } from '../domain/entities'

interface ExperienceSectionProps {
  items: Experience[]
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const { locale, labels } = useTranslations()

  return (
    <SectionCard icon={Award} title={labels.sections.experience}>
      <div className="space-y-4">
        {items.map((item) => (
          <GlassCard as="article" accent key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-white">{localize(locale, item.position)}</h3>
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-300/70">
                {localizeDateRange(item.dateRange, locale)}
              </span>
            </div>
            <p className="mb-3 text-sm font-medium text-amber-300">
              {item.company}
              {item.location ? ` · ${localizeLocation(item.location, locale)}` : ''}
            </p>
            <ul className="mb-3 space-y-1.5 text-sm leading-relaxed text-gray-300/90">
              {localizeList(locale, item.responsibilities).map((responsibility) => (
                <li key={responsibility} className="flex items-start gap-2.5">
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
            <p className="flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2 text-sm font-medium text-amber-200">
              <span aria-hidden="true">🎯</span>
              <span>{localize(locale, item.achievement)}</span>
            </p>
          </GlassCard>
        ))}
      </div>
    </SectionCard>
  )
}
