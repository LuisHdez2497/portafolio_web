export type Locale = 'es' | 'en'

export interface UiLabels {
  subtitle: string
  tagline: string
  sections: {
    skills: string
    experience: string
    education: string
    languages: string
    certifications: string
    projects: string
    contact: string
  }
  actions: {
    downloadCV: string
    viewGithub: string
    viewCode: string
    viewDemo: string
    viewCredential: string
    showMore: string
    showLess: string
    showEarlierRoles: string
    showRecentRolesOnly: string
  }
  contact: {
    email: string
    whatsapp: string
    location: string
    linkedin: string
    github: string
    preferred: string
  }
  skillCategories: {
    mobile: string
    frontend: string
    backend: string
    databases: string
    cloud: string
    devops: string
    tools: string
  }
}

export const UI_LABELS: Record<Locale, UiLabels> = {
  es: {
    subtitle: 'Desarrollador Sr · Arquitectura de Soluciones y DevOps',
    tagline: 'Arquitecturas que un equipo puede sostener',
    sections: {
      skills: 'Stack Tecnológico',
      experience: 'Experiencia',
      education: 'Educación',
      languages: 'Idiomas',
      certifications: 'Certificaciones',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    actions: {
      downloadCV: 'Descargar CV',
      viewGithub: 'Ver GitHub',
      viewCode: 'Ver código',
      viewDemo: 'Ver demo',
      viewCredential: 'Ver credencial',
      showMore: 'Ver más',
      showLess: 'Ver menos',
      showEarlierRoles: 'Ver empleos anteriores',
      showRecentRolesOnly: 'Ver solo los recientes',
    },
    contact: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      location: 'Ubicación',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      preferred: 'Preferido',
    },
    skillCategories: {
      mobile: 'Mobile',
      frontend: 'Frontend',
      backend: 'Backend',
      databases: 'Bases de Datos',
      cloud: 'Cloud',
      devops: 'DevOps e IaC',
      tools: 'Herramientas',
    },
  },
  en: {
    subtitle: 'Senior Developer · Solutions Architecture & DevOps',
    tagline: 'Architecture a team can sustain',
    sections: {
      skills: 'Tech Stack',
      experience: 'Experience',
      education: 'Education',
      languages: 'Languages',
      certifications: 'Certifications',
      projects: 'Projects',
      contact: 'Contact',
    },
    actions: {
      downloadCV: 'Download CV',
      viewGithub: 'View GitHub',
      viewCode: 'View code',
      viewDemo: 'View demo',
      viewCredential: 'View credential',
      showMore: 'Show more',
      showLess: 'Show less',
      showEarlierRoles: 'Show earlier roles',
      showRecentRolesOnly: 'Show recent only',
    },
    contact: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      location: 'Location',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      preferred: 'Preferred',
    },
    skillCategories: {
      mobile: 'Mobile',
      frontend: 'Frontend',
      backend: 'Backend',
      databases: 'Databases',
      cloud: 'Cloud',
      devops: 'DevOps & IaC',
      tools: 'Tools',
    },
  },
}
