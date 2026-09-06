import { jsPDF } from 'jspdf'
import { describe, expect, it } from 'vitest'
import { UI_LABELS, type Locale } from '@/modules/i18n/domain/ui-labels'
import { SKILL_CELL_PADDING, SKILL_LABEL_WIDTH, skillRowLayout } from './cv-pdf-renderer'

const LOCALES: Locale[] = ['es', 'en']
const labelUsableWidth = SKILL_LABEL_WIDTH - SKILL_CELL_PADDING * 2

function newDoc() {
  return new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
}

function contentWidthOf(doc: jsPDF) {
  return doc.internal.pageSize.getWidth() - 30
}

function widestLine(doc: jsPDF, lines: string[], style: 'bold' | 'normal') {
  doc.setFont('helvetica', style)
  doc.setFontSize(10)
  return Math.max(...lines.map((line) => doc.getTextWidth(line)))
}

describe('etiquetas de categoría del CV', () => {
  it.each(LOCALES)('caben en una línea de su celda (%s)', (locale) => {
    const doc = newDoc()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const tooWide = Object.entries(UI_LABELS[locale].skillCategories)
      .map(([id, label]) => ({ id, label, width: doc.getTextWidth(label) }))
      .filter((entry) => entry.width > labelUsableWidth)

    expect(tooWide.map((entry) => `${entry.id}: "${entry.label}" ${entry.width.toFixed(1)}mm`)).toEqual([])
  })
})

describe('skillRowLayout', () => {
  it('mantiene etiqueta y valor dentro de sus celdas', () => {
    const doc = newDoc()
    const layout = skillRowLayout(doc, { label: 'DevOps e IaC', skills: 'Terraform, Docker, Bash' }, contentWidthOf(doc))

    expect(widestLine(doc, layout.labelLines, 'bold')).toBeLessThanOrEqual(labelUsableWidth)
    expect(widestLine(doc, layout.valueLines, 'normal')).toBeLessThanOrEqual(
      layout.valueWidth - SKILL_CELL_PADDING * 2,
    )
  })

  it('parte una etiqueta larga en varias líneas en lugar de desbordarla', () => {
    const doc = newDoc()
    const layout = skillRowLayout(
      doc,
      { label: 'IA y Desarrollo por Especificación', skills: 'Claude Code' },
      contentWidthOf(doc),
    )

    expect(layout.labelLines.length).toBeGreaterThan(1)
    expect(widestLine(doc, layout.labelLines, 'bold')).toBeLessThanOrEqual(labelUsableWidth)
  })

  it('crece la fila para alojar la columna más alta', () => {
    const doc = newDoc()
    const contentWidth = contentWidthOf(doc)
    const corta = skillRowLayout(doc, { label: 'Cloud', skills: 'Azure' }, contentWidth)
    const etiquetaLarga = skillRowLayout(
      doc,
      { label: 'Una Etiqueta Deliberadamente Larguísima Para La Celda', skills: 'Azure' },
      contentWidth,
    )
    const valorLargo = skillRowLayout(
      doc,
      { label: 'Cloud', skills: Array.from({ length: 40 }, (_, i) => `Herramienta ${i}`).join(', ') },
      contentWidth,
    )

    expect(etiquetaLarga.rowHeight).toBeGreaterThan(corta.rowHeight)
    expect(valorLargo.rowHeight).toBeGreaterThan(corta.rowHeight)
  })

  it('nunca deja una fila más baja que el mínimo legible', () => {
    const doc = newDoc()
    const layout = skillRowLayout(doc, { label: '', skills: '' }, contentWidthOf(doc))
    expect(layout.rowHeight).toBeGreaterThanOrEqual(9)
  })
})
