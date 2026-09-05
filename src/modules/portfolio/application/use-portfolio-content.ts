import { useCertifications } from '@/modules/certifications/application/hooks'
import { useEducation } from '@/modules/education/application/hooks'
import { useExperience } from '@/modules/experience/application/hooks'
import { useLanguages } from '@/modules/languages/application/hooks'
import { useProjects } from '@/modules/projects/application/hooks'
import { useSkills } from '@/modules/skills/application/hooks'
import type { Certification } from '@/modules/certifications/domain/entities'
import type { Education } from '@/modules/education/domain/entities'
import type { Experience } from '@/modules/experience/domain/entities'
import type { Language } from '@/modules/languages/domain/entities'
import type { Project } from '@/modules/projects/domain/entities'
import type { SkillCategory } from '@/modules/skills/domain/entities'
import { onlyPublished } from '@/shared/lib/publishing'
import type { Profile } from '../domain/entities'
import { useProfile } from './hooks'

export interface PortfolioContent {
  profile: Profile | null | undefined
  skills: SkillCategory[]
  experience: Experience[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  education: Education[]
  error: Error | null
  isLoading: boolean
}

export function usePortfolioContent(): PortfolioContent {
  const profile = useProfile()
  const skills = useSkills()
  const experience = useExperience()
  const education = useEducation()
  const languages = useLanguages()
  const projects = useProjects()
  const certifications = useCertifications()

  return {
    profile: profile.data,
    skills: skills.data ?? [],
    experience: experience.data ?? [],
    projects: onlyPublished(projects.data ?? []),
    certifications: onlyPublished(certifications.data ?? []),
    languages: languages.data ?? [],
    education: education.data ?? [],
    error:
      profile.error ??
      skills.error ??
      experience.error ??
      education.error ??
      languages.error ??
      projects.error ??
      certifications.error,
    isLoading: profile.isLoading || skills.isLoading || experience.isLoading,
  }
}
