import { describe, expect, it } from 'vitest'
import { UI_LABELS } from './ui-labels'

function collectKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') {
    return [prefix]
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('UI_LABELS', () => {
  it('tiene el par es/en con exactamente las mismas claves', () => {
    expect(collectKeys(UI_LABELS.es).sort()).toEqual(collectKeys(UI_LABELS.en).sort())
  })

  it('traduce el tagline en la versión en inglés (H-I18N-1)', () => {
    expect(UI_LABELS.en.tagline).toBe('Architecture a team can sustain')
    expect(UI_LABELS.en.tagline).not.toBe(UI_LABELS.es.tagline)
  })

  it('mantiene el subtitle coherente entre idiomas (H-I18N-2)', () => {
    expect(UI_LABELS.es.subtitle).toContain('Arquitectura')
    expect(UI_LABELS.en.subtitle).toContain('Architecture')
    expect(UI_LABELS.es.subtitle).toContain('DevOps')
    expect(UI_LABELS.en.subtitle).toContain('DevOps')
  })

  it('declara el puesto real y deja la arquitectura como enfoque (H-I18N-3)', () => {
    expect(UI_LABELS.es.subtitle).toContain('Desarrollador')
    expect(UI_LABELS.en.subtitle).toContain('Developer')
    expect(UI_LABELS.es.subtitle.startsWith('Arquitecto')).toBe(false)
    expect(UI_LABELS.en.subtitle.startsWith('Solutions Architect')).toBe(false)
  })
})
