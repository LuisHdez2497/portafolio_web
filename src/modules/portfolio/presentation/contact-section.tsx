import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionCard } from '@/shared/components/ui/section-card'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import { trackEvent } from '@/shared/analytics/analytics'
import { trackVisit } from '@/modules/visits/application/track-visit'
import type { Profile } from '../domain/entities'

interface ContactSectionProps {
  profile: Profile
}

interface ContactCardProps {
  icon: LucideIcon
  label: string
  value: string
  href?: string
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

function ContactCard({ icon: Icon, label, value, href }: ContactCardProps) {
  const inner = (
    <>
      <span className="flex items-center gap-2 text-amber-400">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-300/80">{label}</span>
      </span>
      <span className="mt-2 block truncate font-medium text-white">{value}</span>
    </>
  )
  const base = 'glass-chip block rounded-xl p-4 transition-colors'
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('contact_click', { channel: label })
        trackContactVisit(label)
      }}
      className={`${base} hover:border-amber-400/40 hover:bg-white/[0.06]`}
    >
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  )
}

export function ContactSection({ profile }: ContactSectionProps) {
  const { labels } = useTranslations()
  const { contact } = profile

  return (
    <SectionCard icon={Mail} title={labels.sections.contact}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <ContactCard icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
        <ContactCard icon={Phone} label="Tel" value={contact.phone} href={`tel:${contact.phone}`} />
        <ContactCard icon={MapPin} label="Ubicación" value={profile.location} />
        <ContactCard icon={Linkedin} label="LinkedIn" value={handleFromUrl(contact.linkedin)} href={contact.linkedin} />
        <ContactCard icon={Github} label="GitHub" value={handleFromUrl(contact.github)} href={contact.github} />
      </div>
    </SectionCard>
  )
}
