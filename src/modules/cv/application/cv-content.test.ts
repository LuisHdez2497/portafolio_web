import { describe, expect, it } from 'vitest'
import type { Profile } from '@/modules/portfolio/domain/entities'
import type { SkillCategory } from '@/modules/skills/domain/entities'
import { buildCvDocument, type CvSourceData } from './cv-content'

const profile: Profile = {
  name: 'Luis Alfonso',
  location: 'México',
  summary: { es: 'Perfil general', en: 'General profile' },
  contact: { email: 'a@b.com', phone: '123', website: 'https://site', linkedin: 'https://linkedin', github: 'https://github' },
}

const skills: SkillCategory[] = [
  { id: 'frontend', order: 0, items: [{ name: 'React', image: '', color: '' }] },
  { id: 'mobile', order: 1, items: [{ name: 'Flutter', image: '', color: '' }] },
]

const source: CvSourceData = {
  profile,
  skills,
  experience: [
    {
      id: 'e1',
      position: { es: 'Dev', en: 'Developer' },
      company: 'ACME',
      location: 'Remoto',
      dateRange: '2020-2024',
      responsibilities: { es: ['Situación es'], en: ['Situation en'] },
      achievement: { es: 'Logro es', en: 'Achievement en' },
      order: 0,
    },
  ],
  projects: [
    {
      id: 'p1',
      title: { es: 'Plataforma', en: 'Platform' },
      description: { es: 'Multi-tenant', en: 'Multi-tenant' },
      technologies: ['Terraform', 'Azure'],
      repoUrl: 'https://repo',
      liveUrl: '',
      imageUrl: '',
      published: true,
      order: 0,
    },
  ],
  certifications: [
    {
      id: 'az900',
      name: 'AZ-900',
      issuer: 'Microsoft',
      status: { es: 'En preparación', en: 'In progress' },
      credentialUrl: '',
      published: true,
      order: 0,
    },
  ],
  education: [{ id: 'ed1', degree: { es: 'Ing.', en: 'Eng.' }, institution: 'UNI', status: { es: 'Terminado', en: 'Done' }, order: 0 }],
  languages: [{ id: 'l1', name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' }, order: 0 }],
}

describe('buildCvDocument', () => {
  it('nombra el archivo según el idioma', () => {
    expect(buildCvDocument(source, 'es').fileName).toContain('_ES.pdf')
    expect(buildCvDocument(source, 'en').fileName).toContain('_EN.pdf')
  })

  it('usa el resumen localizado', () => {
    expect(buildCvDocument(source, 'es').summary).toBe('Perfil general')
    expect(buildCvDocument(source, 'en').summary).toBe('General profile')
  })

  it('incluye todas las categorías de skills con su etiqueta i18n', () => {
    const groups = buildCvDocument(source, 'es').skillGroups
    expect(groups.map((g) => g.label)).toEqual(['Frontend', 'Mobile'])
    expect(groups[0].skills).toBe('React')
  })

  it('localiza la experiencia y compone el encabezado', () => {
    const [es] = buildCvDocument(source, 'es').experience
    expect(es.heading).toBe('Dev – ACME (Remoto)')
    expect(es.responsibilities).toEqual(['Situación es'])
    const [en] = buildCvDocument(source, 'en').experience
    expect(en.heading).toBe('Developer – ACME (Remote)')
    expect(en.achievement).toBe('Achievement en')
  })

  it('localiza los proyectos y usa el repo cuando no hay demo', () => {
    const [es] = buildCvDocument(source, 'es').projects
    expect(es.title).toBe('Plataforma')
    expect(es.technologies).toBe('Terraform, Azure')
    expect(es.url).toBe('https://repo')
  })

  it('localiza el estado de las certificaciones y conserva nombre y emisor', () => {
    const [es] = buildCvDocument(source, 'es').certifications
    expect(es.name).toBe('AZ-900')
    expect(es.issuer).toBe('Microsoft')
    expect(es.status).toBe('En preparación')
    expect(buildCvDocument(source, 'en').certifications[0].status).toBe('In progress')
  })

  it('usa las etiquetas de sección localizadas', () => {
    expect(buildCvDocument(source, 'en').sectionTitles.profile).toBe('Professional Profile')
    expect(buildCvDocument(source, 'es').sectionTitles.profile).toBe('Perfil profesional')
  })
})
