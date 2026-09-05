import { UI_LABELS, type Locale } from '@/modules/i18n/domain/ui-labels'
import { localizeDateRange, localizeLocation } from '@/modules/i18n/application/format-date'
import { localize, localizeList } from '@/modules/i18n/application/localize'
import type { Certification } from '@/modules/certifications/domain/entities'
import type { Education } from '@/modules/education/domain/entities'
import type { Experience } from '@/modules/experience/domain/entities'
import type { Language } from '@/modules/languages/domain/entities'
import type { Profile } from '@/modules/portfolio/domain/entities'
import type { Project } from '@/modules/projects/domain/entities'
import type { SkillCategory } from '@/modules/skills/domain/entities'
import { CV_FILE_NAMES } from '@/shared/config/constants'
import { CV_LABELS } from '../domain/cv-labels'
import type {
  CvCertificationEntry,
  CvDocument,
  CvEducationEntry,
  CvExperienceEntry,
  CvLanguageEntry,
  CvProjectEntry,
  CvSkillGroup,
} from '../domain/entities'

export interface CvSourceData {
  profile: Profile
  skills: SkillCategory[]
  experience: Experience[]
  projects: Project[]
  certifications: Certification[]
  education: Education[]
  languages: Language[]
}

function buildSkillGroups(categories: SkillCategory[], locale: Locale): CvSkillGroup[] {
  const names = UI_LABELS[locale].skillCategories as Record<string, string>
  return categories.map((category) => ({
    label: names[category.id] ?? category.id,
    skills: category.items.map((item) => item.name).join(', '),
  }))
}

function buildExperience(items: Experience[], locale: Locale): CvExperienceEntry[] {
  return items.map((item) => {
    const location = item.location ? ` (${localizeLocation(item.location, locale)})` : ''
    return {
      heading: `${localize(locale, item.position)} – ${item.company}${location}`,
      dateRange: localizeDateRange(item.dateRange, locale),
      responsibilities: localizeList(locale, item.responsibilities),
      achievement: localize(locale, item.achievement),
    }
  })
}

function buildProjects(items: Project[], locale: Locale): CvProjectEntry[] {
  return items.map((item) => ({
    title: localize(locale, item.title),
    description: localize(locale, item.description),
    technologies: item.technologies.join(', '),
    url: item.liveUrl || item.repoUrl,
  }))
}

function buildCertifications(items: Certification[], locale: Locale): CvCertificationEntry[] {
  return items.map((item) => ({
    name: item.name,
    issuer: item.issuer,
    status: localize(locale, item.status),
  }))
}

function buildEducation(items: Education[], locale: Locale): CvEducationEntry[] {
  return items.map((item) => ({
    heading: `${localize(locale, item.degree)} – ${item.institution}`,
    status: localize(locale, item.status),
  }))
}

function buildLanguages(items: Language[], locale: Locale): CvLanguageEntry[] {
  return items.map((item) => ({
    name: localize(locale, item.name),
    level: localize(locale, item.level),
  }))
}

export function buildCvDocument(source: CvSourceData, locale: Locale): CvDocument {
  const { profile } = source
  const labels = CV_LABELS[locale]
  return {
    fileName: CV_FILE_NAMES[locale],
    name: profile.name,
    location: profile.location,
    contact: profile.contact,
    contactLabels: labels.contact,
    preferredChannel: profile.contact.preferredChannel,
    summary: localize(locale, profile.summary),
    sectionTitles: labels.sections,
    starLabels: labels.star,
    skillGroups: buildSkillGroups(source.skills, locale),
    experience: buildExperience(source.experience, locale),
    projects: buildProjects(source.projects, locale),
    certifications: buildCertifications(source.certifications, locale),
    education: buildEducation(source.education, locale),
    languages: buildLanguages(source.languages, locale),
  }
}
