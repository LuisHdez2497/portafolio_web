import { Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionCard } from '@/shared/components/ui/section-card'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import { trackEvent } from '@/shared/analytics/analytics'
import { trackVisit } from '@/modules/visits/application/track-visit'
import { toWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { ContactChannel, Profile } from '../domain/entities'

interface ContactSectionProps {
  profile: Profile
}

interface ContactCardProps {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  preferredLabel?: string
}

function handleFromUrl(url: string): string {
  const segments = url.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? url
}

function trackContactVisit(label: string): void {
  if (label === 'GitHub') trackVisit('github_click')
  else if (label === 'LinkedIn') trackVisit('linkedin_click')
  else trackVisit('contact_click', label)
}

function ContactCard({ icon: Icon, label, value, href, preferredLabel }: ContactCardProps) {
  const inner = (
    <>
      <span className="flex items-center gap-2 text-amber-400">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-300/80">{label}</span>
        {preferredLabel && (
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-amber-200">
            {preferredLabel}
          </span>
        )}
      </span>
      <span className="mt-2 block truncate font-medium text-white">{value}</span>
    </>
  )
  const base = 'glass-chip block rounded-xl p-4 transition-colors'
  const highlight = preferredLabel ? ' border-amber-400/40 bg-amber-400/[0.06]' : ''
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('contact_click', { channel: label })
        trackContactVisit(label)
      }}
      className={`${base}${highlight} hover:border-amber-400/40 hover:bg-white/[0.06]`}
    >
      {inner}
    </a>
  ) : (
    <div className={`${base}${highlight}`}>{inner}</div>
  )
}

export function ContactSection({ profile }: ContactSectionProps) {
  const { labels } = useTranslations()
  const { contact } = profile
  const whatsAppUrl = toWhatsAppUrl(contact.phone)
  const badgeFor = (channel: ContactChannel) =>
    contact.preferredChannel === channel ? labels.contact.preferred : undefined

  return (
    <SectionCard icon={Mail} title={labels.sections.contact}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {whatsAppUrl && (
          <ContactCard
            icon={MessageCircle}
            label={labels.contact.whatsapp}
            value={contact.phone}
            href={whatsAppUrl}
            preferredLabel={badgeFor('whatsapp')}
          />
        )}
        <ContactCard
          icon={Mail}
          label={labels.contact.email}
          value={contact.email}
          href={`mailto:${contact.email}`}
          preferredLabel={badgeFor('email')}
        />
        <ContactCard icon={MapPin} label={labels.contact.location} value={profile.location} />
        <ContactCard
          icon={Linkedin}
          label={labels.contact.linkedin}
          value={handleFromUrl(contact.linkedin)}
          href={contact.linkedin}
        />
        <ContactCard
          icon={Github}
          label={labels.contact.github}
          value={handleFromUrl(contact.github)}
          href={contact.github}
        />
      </div>
    </SectionCard>
  )
}
