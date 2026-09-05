import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Locale } from '@/modules/i18n/domain/ui-labels'
import type { Certification } from '@/modules/certifications/domain/entities'
import type { Education } from '@/modules/education/domain/entities'
import type { Experience } from '@/modules/experience/domain/entities'
import type { Language } from '@/modules/languages/domain/entities'
import type { Profile } from '@/modules/portfolio/domain/entities'
import type { Project } from '@/modules/projects/domain/entities'
import type { SkillCategory } from '@/modules/skills/domain/entities'
import { QUERY_KEYS } from '@/shared/application/query-keys'
import { HEADSHOT_URL } from '@/shared/config/constants'
import { onlyPublished } from '@/shared/lib/publishing'
import { renderCvPdf } from '../infrastructure/cv-pdf-renderer'
import { loadImageAsBase64 } from '../infrastructure/image-loader'
import { buildCvDocument, type CvSourceData } from './cv-content'

async function tryLoadHeadshot(): Promise<string | undefined> {
  try {
    return await loadImageAsBase64(HEADSHOT_URL)
  } catch {
    return undefined
  }
}

export function useCvDownload() {
  const queryClient = useQueryClient()
  const [isGenerating, setIsGenerating] = useState(false)

  const download = async (locale: Locale): Promise<void> => {
    const profile = queryClient.getQueryData<Profile>(QUERY_KEYS.profile)
    if (!profile) return
    setIsGenerating(true)
    try {
      const source: CvSourceData = {
        profile,
        skills: queryClient.getQueryData<SkillCategory[]>(QUERY_KEYS.skills) ?? [],
        experience: queryClient.getQueryData<Experience[]>(QUERY_KEYS.experience) ?? [],
        projects: onlyPublished(queryClient.getQueryData<Project[]>(QUERY_KEYS.projects) ?? []),
        certifications: onlyPublished(
          queryClient.getQueryData<Certification[]>(QUERY_KEYS.certifications) ?? [],
        ),
        education: queryClient.getQueryData<Education[]>(QUERY_KEYS.education) ?? [],
        languages: queryClient.getQueryData<Language[]>(QUERY_KEYS.languages) ?? [],
      }
      const imageBase64 = await tryLoadHeadshot()
      renderCvPdf(buildCvDocument(source, locale), imageBase64)
    } finally {
      setIsGenerating(false)
    }
  }

  return { download, isGenerating }
}
