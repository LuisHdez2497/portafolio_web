import { describe, expect, it } from 'vitest'
import { onlyPublished } from './publishing'

const items = [
  { id: 'a', published: true },
  { id: 'b', published: false },
  { id: 'c', published: true },
]

describe('onlyPublished', () => {
  it('conserva solo los elementos publicados, en su orden original', () => {
    expect(onlyPublished(items).map((item) => item.id)).toEqual(['a', 'c'])
  })

  it('devuelve una lista vacía cuando nada está publicado', () => {
    expect(onlyPublished([{ id: 'a', published: false }])).toEqual([])
  })

  it('no muta la lista original', () => {
    const original = [...items]
    onlyPublished(items)
    expect(items).toEqual(original)
  })
})
