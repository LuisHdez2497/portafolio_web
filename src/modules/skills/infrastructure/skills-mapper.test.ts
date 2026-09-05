import { describe, expect, it } from 'vitest'
import { toSkillCategory, toSkillCategoryDocument } from './skills-mapper'

describe('skills-mapper', () => {
  it('mapea la categoría con sus items', () => {
    expect(
      toSkillCategory('backend', {
        items: [{ name: 'Node.js', image: 'https://icon', color: '#339933' }],
        order: 2,
      }),
    ).toEqual({
      id: 'backend',
      items: [{ name: 'Node.js', image: 'https://icon', color: '#339933' }],
      order: 2,
    })
  })

  it('usa items vacíos y order 0 por defecto', () => {
    expect(toSkillCategory('x', {})).toEqual({ id: 'x', items: [], order: 0 })
  })

  it('mapea un parcial a documento', () => {
    expect(toSkillCategoryDocument({ order: 3 })).toEqual({ order: 3 })
  })
})
