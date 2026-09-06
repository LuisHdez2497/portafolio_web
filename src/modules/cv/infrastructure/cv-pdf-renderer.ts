import { jsPDF } from 'jspdf'
import type { CvDocument, CvExperienceEntry, CvSkillGroup } from '../domain/entities'

type Rgb = [number, number, number]

const COLORS: Record<string, Rgb> = {
  primary: [0, 0, 0],
  secondary: [80, 80, 80],
  accent: [200, 150, 50],
  text: [40, 40, 40],
}

const MARGIN = 15
const IMAGE_SIZE = 30

export const SKILL_LABEL_WIDTH = 35
export const SKILL_CELL_PADDING = 3
const SKILL_LINE_HEIGHT = 4.5
const SKILL_MIN_ROW_HEIGHT = 9

interface RenderContext {
  doc: jsPDF
  pageWidth: number
  pageHeight: number
  contentWidth: number
  y: number
}

function createContext(): RenderContext {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  return {
    doc,
    pageWidth,
    pageHeight: doc.internal.pageSize.getHeight(),
    contentWidth: pageWidth - MARGIN * 2,
    y: MARGIN,
  }
}

function checkNewPage(ctx: RenderContext, requiredSpace: number): void {
  if (ctx.y + requiredSpace > ctx.pageHeight - MARGIN) {
    ctx.doc.addPage()
    ctx.y = MARGIN
  }
}

function centered(ctx: RenderContext, text: string, size: number, color: Rgb, style = 'normal'): void {
  ctx.doc.setFontSize(size)
  ctx.doc.setTextColor(...color)
  ctx.doc.setFont('helvetica', style)
  ctx.doc.text(text, (ctx.pageWidth - ctx.doc.getTextWidth(text)) / 2, ctx.y)
}

function centeredFit(ctx: RenderContext, text: string, maxSize: number, minSize: number, color: Rgb, style = 'normal'): void {
  ctx.doc.setFont('helvetica', style)
  let size = maxSize
  ctx.doc.setFontSize(size)
  while (size > minSize && ctx.doc.getTextWidth(text) > ctx.contentWidth) {
    size -= 0.5
    ctx.doc.setFontSize(size)
  }
  centered(ctx, text, size, color, style)
}

function sectionTitle(ctx: RenderContext, text: string): void {
  ctx.doc.setFontSize(14)
  ctx.doc.setTextColor(...COLORS.primary)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.text(text, MARGIN, ctx.y)
  ctx.y += 7
}

function renderHeader(ctx: RenderContext, document: CvDocument, imageBase64?: string): void {
  const startY = ctx.y
  if (imageBase64) {
    ctx.doc.addImage(imageBase64, 'JPEG', MARGIN, ctx.y, IMAGE_SIZE, IMAGE_SIZE)
  }
  centeredFit(ctx, document.name.toUpperCase(), 18, 12, COLORS.primary, 'bold')
  ctx.y += 10
  centered(ctx, document.location, 11, COLORS.secondary)
  ctx.y += 5
  const { contact, contactLabels } = document
  const mark = (channel: string) => (document.preferredChannel === channel ? ` (${contactLabels.preferred})` : '')
  const email = `${contactLabels.email}: ${contact.email}${mark('email')}`
  const whatsApp = `${contactLabels.whatsapp}: ${contact.phone}${mark('whatsapp')}`
  centered(ctx, `${email} | ${whatsApp}`, 10, COLORS.secondary)
  ctx.y += 4
  centered(ctx, `${contactLabels.portfolio}: ${contact.website}`, 10, COLORS.secondary)
  ctx.y += 4
  centered(ctx, `${contactLabels.linkedin}: ${contact.linkedin}`, 10, COLORS.secondary)
  ctx.y += 4
  centered(ctx, `${contactLabels.github}: ${contact.github}`, 10, COLORS.secondary)
  ctx.y = Math.max(ctx.y + 8, startY + IMAGE_SIZE + 5)
  ctx.doc.setDrawColor(...COLORS.accent)
  ctx.doc.setLineWidth(0.5)
  ctx.doc.line(MARGIN, ctx.y, ctx.pageWidth - MARGIN, ctx.y)
  ctx.y += 8
}

function renderSummary(ctx: RenderContext, document: CvDocument): void {
  sectionTitle(ctx, document.sectionTitles.profile)
  ctx.doc.setFontSize(10)
  ctx.doc.setTextColor(...COLORS.text)
  ctx.doc.setFont('helvetica', 'normal')
  const lines = ctx.doc.splitTextToSize(document.summary, ctx.contentWidth)
  ctx.doc.text(lines, MARGIN, ctx.y)
  ctx.y += lines.length * 4 + 6
}

function skillBlockBaseline(top: number, rowHeight: number, lineCount: number): number {
  return top + (rowHeight - lineCount * SKILL_LINE_HEIGHT) / 2 + 3.3
}

export interface SkillRowLayout {
  labelLines: string[]
  valueLines: string[]
  rowHeight: number
  valueWidth: number
}

export function skillRowLayout(doc: jsPDF, group: CvSkillGroup, contentWidth: number): SkillRowLayout {
  const valueWidth = contentWidth - SKILL_LABEL_WIDTH
  const inner = SKILL_CELL_PADDING * 2
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  const labelLines: string[] = doc.splitTextToSize(group.label, SKILL_LABEL_WIDTH - inner)
  doc.setFont('helvetica', 'normal')
  const valueLines: string[] = doc.splitTextToSize(group.skills, valueWidth - inner)
  const tallest = Math.max(labelLines.length, valueLines.length)
  return {
    labelLines,
    valueLines,
    rowHeight: Math.max(tallest * SKILL_LINE_HEIGHT + 4, SKILL_MIN_ROW_HEIGHT),
    valueWidth,
  }
}

function renderSkillRow(ctx: RenderContext, group: CvSkillGroup): void {
  const { labelLines, valueLines, rowHeight, valueWidth } = skillRowLayout(ctx.doc, group, ctx.contentWidth)
  checkNewPage(ctx, rowHeight + 2)

  ctx.doc.setFillColor(245, 245, 245)
  ctx.doc.rect(MARGIN, ctx.y, SKILL_LABEL_WIDTH, rowHeight, 'F')
  ctx.doc.setDrawColor(200, 200, 200)
  ctx.doc.rect(MARGIN, ctx.y, SKILL_LABEL_WIDTH, rowHeight, 'S')
  ctx.doc.rect(MARGIN + SKILL_LABEL_WIDTH, ctx.y, valueWidth, rowHeight, 'S')

  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(...COLORS.primary)
  ctx.doc.text(labelLines, MARGIN + SKILL_CELL_PADDING, skillBlockBaseline(ctx.y, rowHeight, labelLines.length))
  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(...COLORS.text)
  ctx.doc.text(
    valueLines,
    MARGIN + SKILL_LABEL_WIDTH + SKILL_CELL_PADDING,
    skillBlockBaseline(ctx.y, rowHeight, valueLines.length),
  )
  ctx.y += rowHeight
}

function renderSkills(ctx: RenderContext, document: CvDocument): void {
  checkNewPage(ctx, 40)
  sectionTitle(ctx, document.sectionTitles.skills)
  document.skillGroups.forEach((group) => renderSkillRow(ctx, group))
  ctx.y += 8
}

function starPrefix(document: CvDocument, index: number): string {
  const { situation, task, action } = document.starLabels
  if (index === 0) return `• ${situation}: `
  if (index === 1) return `• ${task}: `
  if (index === 2) return `• ${action}: `
  return '• '
}

function renderExperienceEntry(ctx: RenderContext, document: CvDocument, entry: CvExperienceEntry): void {
  checkNewPage(ctx, 35)
  ctx.doc.setFontSize(11)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(...COLORS.primary)
  ctx.doc.text(entry.heading, MARGIN, ctx.y)
  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(...COLORS.secondary)
  const date = `(${entry.dateRange})`
  ctx.doc.text(date, ctx.pageWidth - MARGIN - ctx.doc.getTextWidth(date), ctx.y)
  ctx.y += 5
  ctx.doc.setFontSize(9)
  ctx.doc.setTextColor(...COLORS.text)
  entry.responsibilities.forEach((responsibility, index) => {
    checkNewPage(ctx, 6)
    ctx.doc.setFont('helvetica', 'normal')
    const lines = ctx.doc.splitTextToSize(`${starPrefix(document, index)}${responsibility}`, ctx.contentWidth - 4)
    ctx.doc.text(lines, MARGIN + 2, ctx.y)
    ctx.y += lines.length * 3 + 1
  })
  checkNewPage(ctx, 6)
  const resultLines = ctx.doc.splitTextToSize(`• ${document.starLabels.result}: ${entry.achievement}`, ctx.contentWidth - 4)
  ctx.doc.text(resultLines, MARGIN + 2, ctx.y)
  ctx.y += resultLines.length * 3 + 6
}

function renderExperience(ctx: RenderContext, document: CvDocument): void {
  checkNewPage(ctx, 30)
  sectionTitle(ctx, document.sectionTitles.experience)
  document.experience.forEach((entry) => renderExperienceEntry(ctx, document, entry))
}

function renderProjects(ctx: RenderContext, document: CvDocument): void {
  if (document.projects.length === 0) return
  checkNewPage(ctx, 25)
  sectionTitle(ctx, document.sectionTitles.projects)
  document.projects.forEach((entry) => {
    checkNewPage(ctx, 16)
    ctx.doc.setFontSize(11)
    ctx.doc.setFont('helvetica', 'bold')
    ctx.doc.setTextColor(...COLORS.primary)
    ctx.doc.text(entry.title, MARGIN, ctx.y)
    ctx.y += 4.5
    ctx.doc.setFontSize(9)
    ctx.doc.setFont('helvetica', 'normal')
    ctx.doc.setTextColor(...COLORS.text)
    const lines = ctx.doc.splitTextToSize(entry.description, ctx.contentWidth - 4)
    ctx.doc.text(lines, MARGIN + 2, ctx.y)
    ctx.y += lines.length * 3.5 + 1
    ctx.doc.setTextColor(...COLORS.secondary)
    if (entry.technologies) {
      const stack = ctx.doc.splitTextToSize(entry.technologies, ctx.contentWidth - 4)
      ctx.doc.text(stack, MARGIN + 2, ctx.y)
      ctx.y += stack.length * 3.5 + 1
    }
    if (entry.url) {
      ctx.doc.text(entry.url, MARGIN + 2, ctx.y)
      ctx.y += 4
    }
    ctx.y += 2
  })
  ctx.y += 2
}

function renderCertifications(ctx: RenderContext, document: CvDocument): void {
  if (document.certifications.length === 0) return
  checkNewPage(ctx, 20)
  sectionTitle(ctx, document.sectionTitles.certifications)
  document.certifications.forEach((entry) => {
    checkNewPage(ctx, 10)
    ctx.doc.setFontSize(10)
    ctx.doc.setFont('helvetica', 'bold')
    ctx.doc.setTextColor(...COLORS.primary)
    ctx.doc.text(`${entry.name} – ${entry.issuer}`, MARGIN, ctx.y)
    ctx.doc.setFont('helvetica', 'normal')
    ctx.doc.setTextColor(...COLORS.secondary)
    const status = `(${entry.status})`
    ctx.doc.text(status, ctx.pageWidth - MARGIN - ctx.doc.getTextWidth(status), ctx.y)
    ctx.y += 6
  })
  ctx.y += 4
}

function renderEducation(ctx: RenderContext, document: CvDocument): void {
  checkNewPage(ctx, 20)
  sectionTitle(ctx, document.sectionTitles.education)
  document.education.forEach((entry) => {
    checkNewPage(ctx, 10)
    ctx.doc.setFontSize(10)
    ctx.doc.setFont('helvetica', 'bold')
    ctx.doc.setTextColor(...COLORS.primary)
    ctx.doc.text(entry.heading, MARGIN, ctx.y)
    ctx.doc.setFont('helvetica', 'normal')
    ctx.doc.setTextColor(...COLORS.secondary)
    const status = `(${entry.status})`
    ctx.doc.text(status, ctx.pageWidth - MARGIN - ctx.doc.getTextWidth(status), ctx.y)
    ctx.y += 6
  })
  ctx.y += 4
}

function renderLanguages(ctx: RenderContext, document: CvDocument): void {
  checkNewPage(ctx, 15)
  sectionTitle(ctx, document.sectionTitles.languages)
  ctx.doc.setFontSize(10)
  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(...COLORS.text)
  document.languages.forEach((entry) => {
    ctx.doc.text(`${entry.name}: ${entry.level}`, MARGIN, ctx.y)
    ctx.y += 5
  })
}

export function renderCvPdf(document: CvDocument, imageBase64?: string): void {
  const ctx = createContext()
  renderHeader(ctx, document, imageBase64)
  renderSummary(ctx, document)
  renderSkills(ctx, document)
  renderExperience(ctx, document)
  renderProjects(ctx, document)
  renderCertifications(ctx, document)
  renderEducation(ctx, document)
  renderLanguages(ctx, document)
  ctx.doc.save(document.fileName)
}
