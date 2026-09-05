import { useState } from 'react'
import { Github } from 'lucide-react'
import { CvDownloadButton } from '@/modules/cv/presentation/cv-download-button'
import { localize } from '@/modules/i18n/application/localize'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import { trackEvent } from '@/shared/analytics/analytics'
import { trackVisit } from '@/modules/visits/application/track-visit'
import { splitAtSentences } from '@/shared/lib/summary'
import type { Profile } from '../domain/entities'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { locale, labels } = useTranslations()
  const [expanded, setExpanded] = useState(false)
  const summary = localize(locale, profile.summary)
  const { preview, rest } = splitAtSentences(summary, 2)
  const hasMore = rest.length > 0

  return (
    <header className="animate-fade-in mb-20 flex flex-col items-center text-center">
      <div className="mb-6 rounded-full p-[3px] shadow-[0_0_45px_rgba(251,191,36,0.25)] [background:conic-gradient(from_180deg,rgba(251,191,36,0.9),rgba(253,230,138,0.3),rgba(245,158,11,0.9))]">
        <img
          src="/software-developer-headshot.JPEG"
          alt={profile.name}
          className="h-32 w-32 rounded-full border-[3px] object-cover sm:h-36 sm:w-36 md:h-44 md:w-44"
          style={{ borderColor: 'hsl(230 32% 4%)' }}
        />
      </div>
      <h1 className="mb-3 bg-linear-to-r from-white via-amber-200 to-yellow-400 bg-clip-text px-2 text-4xl font-black leading-[1.05] tracking-tight text-transparent drop-shadow-2xl sm:text-5xl md:text-6xl">
        {profile.name.toUpperCase()}
      </h1>
      <p className="mb-3 text-lg font-light tracking-wide text-amber-300 sm:text-xl md:text-2xl">
        {labels.subtitle}
      </p>
      <p className="mb-7 font-mono text-sm italic text-amber-200/80">{labels.tagline}</p>
      <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg sm:leading-relaxed">
        {hasMore && !expanded ? preview : summary}
        {hasMore && (
          <>
            {' '}
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="font-medium text-amber-300 underline decoration-amber-400/40 underline-offset-4 transition-colors hover:text-amber-200"
            >
              {expanded ? labels.actions.showLess : labels.actions.showMore}
            </button>
          </>
        )}
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <CvDownloadButton />
        <a
          href={profile.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent('github_click', { source: 'hero' })
            trackVisit('github_click')
          }}
          className="glass-chip inline-flex min-w-[13rem] items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-amber-100 transition-all duration-300 hover:scale-105 hover:text-white"
        >
          <Github className="h-5 w-5" />
          {labels.actions.viewGithub}
        </a>
      </div>
    </header>
  )
}
