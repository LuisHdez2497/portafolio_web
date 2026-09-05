import { GraduationCap } from 'lucide-react'
import { GlassCard } from '@/shared/components/ui/glass-card'
import { SectionCard } from '@/shared/components/ui/section-card'
import { localize } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import type { Education } from '../domain/entities'

interface EducationSectionProps {
  items: Education[]
}

export function EducationSection({ items }: EducationSectionProps) {
  const { locale, labels } = useTranslations()

  return (
    <SectionCard icon={GraduationCap} title={labels.sections.education}>
      <div className="space-y-4">
        {items.map((item) => (
          <GlassCard as="article" accent key={item.id}>
            <h3 className="text-lg font-semibold text-white">{localize(locale, item.degree)}</h3>
            <p className="mt-1 text-sm font-medium text-amber-300">{item.institution}</p>
            <p className="mt-1 text-sm text-gray-300/90">{localize(locale, item.status)}</p>
          </GlassCard>
        ))}
      </div>
    </SectionCard>
  )
}
