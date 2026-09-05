import { ChevronLeft, Loader2 } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { CertificationsSection } from '@/modules/certifications/presentation/certifications-section'
import { EducationSection } from '@/modules/education/presentation/education-section'
import { ExperienceSection } from '@/modules/experience/presentation/experience-section'
import { LanguageToggle } from '@/modules/i18n/presentation/language-toggle'
import { LanguagesSection } from '@/modules/languages/presentation/languages-section'
import { ProjectsSection } from '@/modules/projects/presentation/projects-section'
import { SkillsSection } from '@/modules/skills/presentation/skills-section'
import { SpaceBackground } from '@/shared/components/space-background'
import { useAnalytics } from '@/shared/analytics/use-analytics'
import { ROUTES } from '@/shared/config/constants'
import { usePortfolioContent } from '../application/use-portfolio-content'
import { ContactSection } from './contact-section'
import { HeroSection } from './hero-section'

interface PortfolioViewProps {
  isAdmin?: boolean
}

const LOAD_TIMEOUT_MS = 15000

function StatusScreen({ children }: { children: ReactNode }) {
  return (
    <div className="bg-space flex min-h-screen items-center justify-center px-4 text-center">{children}</div>
  )
}

function ErrorScreen({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) {
    return (
      <StatusScreen>
        <p className="max-w-md text-gray-400">
          Por el momento no está disponible. Vuelve a intentarlo en un momento.
        </p>
      </StatusScreen>
    )
  }
  return (
    <StatusScreen>
      <div className="max-w-md space-y-4">
        <p className="text-gray-400">
          No se pudo conectar con la base de datos. Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="glass-cta inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-6 py-2.5 font-semibold text-black transition-all duration-300 hover:brightness-105"
        >
          Reintentar
        </button>
      </div>
    </StatusScreen>
  )
}

export function PortfolioView({ isAdmin = false }: PortfolioViewProps) {
  useAnalytics()
  const content = usePortfolioContent()
  const { error, isLoading: loading, profile } = content
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (!loading) {
      setTimedOut(false)
      return
    }
    const timer = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [loading])

  if (error || (timedOut && loading)) return <ErrorScreen isAdmin={isAdmin} />

  if (loading || !profile) {
    return (
      <StatusScreen>
        <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      </StatusScreen>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <LanguageToggle />
      {isAdmin && (
        <a
          href={ROUTES.admin}
          className="glass-chip top-safe fixed left-4 z-50 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-amber-100 transition-colors hover:text-white sm:left-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al panel
        </a>
      )}
      <div className="container content-safe-top relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12">
        <HeroSection profile={profile} />
        <ContactSection profile={profile} />
        <SkillsSection categories={content.skills} />
        <ExperienceSection items={content.experience} />
        <ProjectsSection items={content.projects} />
        <CertificationsSection items={content.certifications} />
        <LanguagesSection items={content.languages} />
        <EducationSection items={content.education} />
      </div>
    </div>
  )
}
