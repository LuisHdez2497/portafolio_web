import { ExternalLink, FolderGit2, Github } from 'lucide-react'
import { GlassCard } from '@/shared/components/ui/glass-card'
import { SectionCard } from '@/shared/components/ui/section-card'
import { localize } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import { trackEvent } from '@/shared/analytics/analytics'
import { trackVisit } from '@/modules/visits/application/track-visit'
import type { Project } from '../domain/entities'

interface ProjectsSectionProps {
  items: Project[]
}

const LINK_CLASS =
  'inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/[0.08]'

function trackProjectLink(kind: 'repo' | 'demo', title: string): void {
  trackEvent('project_link', { kind, title })
  trackVisit('project_link', `${title} (${kind === 'repo' ? 'código' : 'demo'})`)
}

function ProjectCard({ item }: { item: Project }) {
  const { locale, labels } = useTranslations()
  const title = localize(locale, item.title)

  return (
    <GlassCard as="article" accent className="flex flex-col">
      {item.imageUrl && (
        <img src={item.imageUrl} alt={title} loading="lazy" className="mb-3 h-40 w-full rounded-lg object-cover" />
      )}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-300/90">{localize(locale, item.description)}</p>
      {item.technologies.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {item.technologies.map((tech) => (
            <li key={tech} className="glass-chip rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] text-amber-200/90">
              {tech}
            </li>
          ))}
        </ul>
      )}
      {(item.repoUrl || item.liveUrl) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.repoUrl && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackProjectLink('repo', title)}
              className={LINK_CLASS}
            >
              <Github className="h-3.5 w-3.5" />
              {labels.actions.viewCode}
            </a>
          )}
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackProjectLink('demo', title)}
              className={`${LINK_CLASS} border-amber-400/30 bg-amber-400/10 text-amber-200`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {labels.actions.viewDemo}
            </a>
          )}
        </div>
      )}
    </GlassCard>
  )
}

export function ProjectsSection({ items }: ProjectsSectionProps) {
  const { labels } = useTranslations()

  if (items.length === 0) return null

  return (
    <SectionCard icon={FolderGit2} title={labels.sections.projects}>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <ProjectCard key={item.id} item={item} />
        ))}
      </div>
    </SectionCard>
  )
}
