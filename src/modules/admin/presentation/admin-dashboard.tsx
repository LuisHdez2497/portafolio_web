import { useEffect, useState, type ComponentType } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Activity,
  BadgeCheck,
  Briefcase,
  ExternalLink,
  FolderGit2,
  GraduationCap,
  Languages,
  Layers,
  LogOut,
  User,
} from 'lucide-react'
import { CertificationsEditor } from '@/modules/certifications/presentation/certifications-editor'
import { EducationEditor } from '@/modules/education/presentation/education-editor'
import { ExperienceEditor } from '@/modules/experience/presentation/experience-editor'
import { LanguagesEditor } from '@/modules/languages/presentation/languages-editor'
import { ProfileEditor } from '@/modules/portfolio/presentation/profile-editor'
import { ProjectsEditor } from '@/modules/projects/presentation/projects-editor'
import { SkillsEditor } from '@/modules/skills/presentation/skills-editor'
import { VisitsView } from '@/modules/visits/presentation/visits-view'
import { HEADSHOT_URL, ROUTES } from '@/shared/config/constants'
import { prewarmPush, refreshPushToken } from '@/shared/firebase/messaging'
import { SpaceBackground } from '@/shared/components/space-background'
import { confirmDiscardIfDirty } from '@/shared/components/cms/use-unsaved-changes'
import { AdminTabBar, type AdminTab } from './admin-tab-bar'
import { useAuth } from '../application/auth-store'

const TABS: (AdminTab & { Component: ComponentType })[] = [
  { id: 'profile', label: 'Perfil', icon: User, Component: ProfileEditor },
  { id: 'skills', label: 'Stack', icon: Layers, Component: SkillsEditor },
  { id: 'experience', label: 'Trabajo', icon: Briefcase, Component: ExperienceEditor },
  { id: 'projects', label: 'Proyectos', icon: FolderGit2, Component: ProjectsEditor },
  { id: 'certifications', label: 'Certifs', icon: BadgeCheck, Component: CertificationsEditor },
  { id: 'education', label: 'Estudios', icon: GraduationCap, Component: EducationEditor },
  { id: 'languages', label: 'Idiomas', icon: Languages, Component: LanguagesEditor },
]

const ICON_BUTTON_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-gray-200 transition-colors hover:bg-white/[0.08]'

const ICON_BUTTON_ACTIVE_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 transition-colors'

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [params] = useSearchParams()
  const [activeId, setActiveId] = useState(params.get('view') === 'visits' ? 'visits' : 'profile')
  const Active = activeId === 'visits' ? VisitsView : (TABS.find((tab) => tab.id === activeId) ?? TABS[0]).Component

  useEffect(() => {
    void prewarmPush()
    void refreshPushToken()
  }, [])

  const selectTab = async (id: string) => {
    if (await confirmDiscardIfDirty()) setActiveId(id)
  }

  const handleSignOut = async () => {
    if (await confirmDiscardIfDirty()) void signOut()
  }

  return (
    <main className="relative min-h-screen text-foreground">
      <SpaceBackground />
      <header className="header-safe sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[hsl(230_32%_4%/0.72)] px-4 pb-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={HEADSHOT_URL}
            alt={user?.email ?? 'Administrador'}
            className="h-9 w-9 shrink-0 rounded-full border border-amber-400/60 object-cover shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Panel</p>
            <p className="truncate font-mono text-[0.65rem] uppercase tracking-wider text-amber-300/70">{user?.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void selectTab('visits')}
            className={activeId === 'visits' ? ICON_BUTTON_ACTIVE_CLASS : ICON_BUTTON_CLASS}
            aria-label="Visitas"
            title="Visitas"
          >
            <Activity className="h-4 w-4" />
          </button>
          <a href={ROUTES.portfolioPreview} className={ICON_BUTTON_CLASS} aria-label="Ver sitio" title="Ver sitio">
            <ExternalLink className="h-4 w-4" />
          </a>
          <button type="button" onClick={handleSignOut} className={ICON_BUTTON_CLASS} aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-xl px-4 pb-40 pt-6 sm:pt-8">
        <Active />
      </div>
      <AdminTabBar tabs={TABS} activeId={activeId} onSelect={selectTab} />
    </main>
  )
}
