import { describe, expect, it } from 'vitest'
import { toProject, toProjectDocument } from './projects-mapper'

describe('toProject', () => {
  it('mapea los campos bilingües y las tecnologías', () => {
    const project = toProject('p1', {
      title: { es: 'Portafolio', en: 'Portfolio' },
      description: { es: 'Sitio bilingüe', en: 'Bilingual site' },
      technologies: ['React', 'Firebase'],
      repoUrl: 'https://github.com/user/repo',
      liveUrl: 'https://example.com',
      imageUrl: '',
      published: true,
      order: 2,
    })
    expect(project).toEqual({
      id: 'p1',
      title: { es: 'Portafolio', en: 'Portfolio' },
      description: { es: 'Sitio bilingüe', en: 'Bilingual site' },
      technologies: ['React', 'Firebase'],
      repoUrl: 'https://github.com/user/repo',
      liveUrl: 'https://example.com',
      imageUrl: '',
      published: true,
      order: 2,
    })
  })

  it('rellena campos faltantes con vacíos', () => {
    expect(toProject('x', {})).toEqual({
      id: 'x',
      title: { es: '', en: '' },
      description: { es: '', en: '' },
      technologies: [],
      repoUrl: '',
      liveUrl: '',
      imageUrl: '',
      published: false,
      order: 0,
    })
  })
})

describe('toProjectDocument', () => {
  it('incluye solo los campos provistos', () => {
    expect(toProjectDocument({ repoUrl: 'https://github.com/user/repo' })).toEqual({
      repoUrl: 'https://github.com/user/repo',
    })
  })
})
