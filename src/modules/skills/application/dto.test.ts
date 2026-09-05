import { describe, expect, it } from 'vitest'
import { skillFormSchema } from './dto'

const valid = { name: 'React', image: 'https://cdn.jsdelivr.net/icon.svg', color: '#61DAFB' }

describe('skillFormSchema', () => {
  it('acepta una skill válida', () => {
    expect(skillFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rechaza una skill sin nombre', () => {
    expect(skillFormSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rechaza una skill sin imagen', () => {
    expect(skillFormSchema.safeParse({ ...valid, image: '' }).success).toBe(false)
  })

  it('rechaza una imagen que no es URL http(s)', () => {
    expect(skillFormSchema.safeParse({ ...valid, image: 'icono' }).success).toBe(false)
    expect(skillFormSchema.safeParse({ ...valid, image: 'https://sinhost' }).success).toBe(false)
  })
})
