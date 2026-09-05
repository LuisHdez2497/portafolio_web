import { describe, expect, it } from 'vitest'
import { splitAtSentences } from './summary'

describe('splitAtSentences', () => {
  it('separa el texto en las primeras N frases y el resto', () => {
    const text = 'Uno aquí. Dos con Node.js incluido. Tres al final. Cuatro.'
    const { preview, rest } = splitAtSentences(text, 2)
    expect(preview).toBe('Uno aquí. Dos con Node.js incluido.')
    expect(rest).toBe('Tres al final. Cuatro.')
  })

  it('no divide dentro de abreviaturas como Node.js', () => {
    const text = 'Uso Node.js y React. Segundo punto.'
    expect(splitAtSentences(text, 1).preview).toBe('Uso Node.js y React.')
  })

  it('devuelve todo el texto sin resto cuando hay pocas frases', () => {
    const text = 'Una sola frase.'
    expect(splitAtSentences(text, 2)).toEqual({ preview: 'Una sola frase.', rest: '' })
  })
})
