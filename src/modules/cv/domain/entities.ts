interface CvContact {
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
}

export interface CvSkillGroup {
  label: string
  skills: string
}

export interface CvExperienceEntry {
  heading: string
  dateRange: string
  responsibilities: string[]
  achievement: string
}

export interface CvProjectEntry {
  title: string
  description: string
  technologies: string
  url: string
}

export interface CvCertificationEntry {
  name: string
  issuer: string
  status: string
}

export interface CvEducationEntry {
  heading: string
  status: string
}

export interface CvLanguageEntry {
  name: string
  level: string
}

export interface CvSectionTitles {
  profile: string
  skills: string
  experience: string
  projects: string
  certifications: string
  education: string
  languages: string
}

export interface CvStarLabels {
  situation: string
  task: string
  action: string
  result: string
}

export interface CvContactLabels {
  email: string
  phone: string
  portfolio: string
  linkedin: string
  github: string
}

export interface CvDocument {
  fileName: string
  name: string
  location: string
  contact: CvContact
  contactLabels: CvContactLabels
  summary: string
  sectionTitles: CvSectionTitles
  starLabels: CvStarLabels
  skillGroups: CvSkillGroup[]
  experience: CvExperienceEntry[]
  projects: CvProjectEntry[]
  certifications: CvCertificationEntry[]
  education: CvEducationEntry[]
  languages: CvLanguageEntry[]
}
