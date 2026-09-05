export interface SplitText {
  preview: string
  rest: string
}

export function splitAtSentences(text: string, count: number): SplitText {
  const sentences = text.split(/(?<=\.)\s+/)
  if (sentences.length <= count) {
    return { preview: text, rest: '' }
  }
  return {
    preview: sentences.slice(0, count).join(' '),
    rest: sentences.slice(count).join(' '),
  }
}
