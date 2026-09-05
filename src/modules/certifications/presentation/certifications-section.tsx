import { BadgeCheck, ExternalLink } from 'lucide-react'
import { GlassCard } from '@/shared/components/ui/glass-card'
import { SectionCard } from '@/shared/components/ui/section-card'
import { localize } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import type { Certification } from '../domain/entities'

interface CertificationsSectionProps {
  items: Certification[]
}

const CREDENTIAL_LINK_CLASS =
  'mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-400/20'

function CertificationCard({ item }: { item: Certification }) {
  const { locale, labels } = useTranslations()

  return (
    <GlassCard as="article" accent>
      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
      <p className="mt-1 text-sm font-medium text-amber-300">{item.issuer}</p>
      <p className="mt-1 text-sm text-gray-300/90">{localize(locale, item.status)}</p>
      {item.credentialUrl && (
        <a href={item.credentialUrl} target="_blank" rel="noreferrer" className={CREDENTIAL_LINK_CLASS}>
          <ExternalLink className="h-3.5 w-3.5" />
          {labels.actions.viewCredential}
        </a>
      )}
    </GlassCard>
  )
}

export function CertificationsSection({ items }: CertificationsSectionProps) {
  const { labels } = useTranslations()

  if (items.length === 0) return null

  return (
    <SectionCard icon={BadgeCheck} title={labels.sections.certifications}>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <CertificationCard key={item.id} item={item} />
        ))}
      </div>
    </SectionCard>
  )
}
