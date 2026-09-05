import { describe, expect, it } from 'vitest'
import { projectFormSchema } from './dto'

const valid = {
  title: { es: 'Portafolio', en: '' },
  description: { es: 'Un portafolio bilingüe', en: '' },
  technologies: ['React', 'Firebase'],
  repoUrl: 'https://github.com/user/repo',
  liveUrl: '',
  imageUrl: '',
  published: false,
}

describe('projectFormSchema', () => {
  it('acepta un proyecto válido con demo vacío', () => {
    expect(projectFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rechaza un título sin español', () => {
    expect(projectFormSchema.safeParse({ ...valid, title: { es: '', en: 'Portfolio' } }).success).toBe(false)
  })

  it('rechaza una descripción sin español', () => {
    expect(projectFormSchema.safeParse({ ...valid, description: { es: '', en: 'A portfolio' } }).success).toBe(false)
  })

  it('rechaza una URL de repositorio inválida', () => {
    expect(projectFormSchema.safeParse({ ...valid, repoUrl: 'github.com/user' }).success).toBe(false)
  })

  it('acepta URLs vacías como opcionales', () => {
    expect(projectFormSchema.safeParse({ ...valid, repoUrl: '', liveUrl: '' }).success).toBe(true)
  })
})
