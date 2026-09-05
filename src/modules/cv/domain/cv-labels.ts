import type { Locale } from '@/modules/i18n/domain/ui-labels'
import type { CvContactLabels, CvSectionTitles, CvStarLabels } from './entities'

export interface CvLabels {
  sections: CvSectionTitles
  star: CvStarLabels
  contact: CvContactLabels
}

export const CV_LABELS: Record<Locale, CvLabels> = {
  es: {
    sections: {
      profile: 'Perfil profesional',
      skills: 'Habilidades técnicas',
      experience: 'Experiencia profesional',
      projects: 'Proyectos destacados',
      certifications: 'Certificaciones',
      education: 'Educación',
      languages: 'Idiomas',
    },
    star: {
      situation: 'Situación',
      task: 'Tarea',
      action: 'Acción',
      result: 'Resultado',
    },
    contact: {
      email: 'Email',
      phone: 'Teléfono',
      portfolio: 'Portafolio',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
  },
  en: {
    sections: {
      profile: 'Professional Profile',
      skills: 'Technical Skills',
      experience: 'Professional Experience',
      projects: 'Featured Projects',
      certifications: 'Certifications',
      education: 'Education',
      languages: 'Languages',
    },
    star: {
      situation: 'Situation',
      task: 'Task',
      action: 'Action',
      result: 'Result',
    },
    contact: {
      email: 'Email',
      phone: 'Phone',
      portfolio: 'Portfolio',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
  },
}
