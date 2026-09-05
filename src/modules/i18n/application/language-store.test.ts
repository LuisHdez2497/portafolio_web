import { beforeEach, describe, expect, it } from 'vitest'
import { useLanguage } from './language-store'

describe('useLanguage', () => {
  beforeEach(() => {
    useLanguage.setState({ locale: 'es' })
  })

  it('inicia en español', () => {
    expect(useLanguage.getState().locale).toBe('es')
  })

  it('alterna entre es y en', () => {
    useLanguage.getState().toggle()
    expect(useLanguage.getState().locale).toBe('en')
    useLanguage.getState().toggle()
    expect(useLanguage.getState().locale).toBe('es')
  })

  it('permite fijar un locale explícito', () => {
    useLanguage.getState().setLocale('en')
    expect(useLanguage.getState().locale).toBe('en')
  })
})
