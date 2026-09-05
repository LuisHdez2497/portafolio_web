import { Code, Layers } from 'lucide-react'
import { SectionCard } from '@/shared/components/ui/section-card'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import type { SkillCategory } from '../domain/entities'

interface SkillsSectionProps {
  categories: SkillCategory[]
}

export function SkillsSection({ categories }: SkillsSectionProps) {
  const { labels } = useTranslations()

  return (
    <SectionCard icon={Code} title={labels.sections.skills}>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="space-y-3">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-300/80">
              <Layers className="h-4 w-4" />
              {labels.skillCategories[category.id as keyof typeof labels.skillCategories] ?? category.id}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <li
                  key={skill.name}
                  className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-gray-200 transition-colors hover:border-amber-400/40 hover:text-white"
                >
                  <img src={skill.image} alt="" loading="lazy" className="h-4 w-4 object-contain" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
