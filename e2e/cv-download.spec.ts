import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

async function waitForHome(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Luis Alfonso Hernández/i })).toBeVisible()
}

async function downloadCv(page: Page, buttonName: RegExp) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: buttonName }).click(),
  ])
  return download
}

test('descarga el CV en español como un PDF con contenido', async ({ page }) => {
  await waitForHome(page)
  const download = await downloadCv(page, /descargar cv/i)
  expect(download.suggestedFilename()).toBe('CV_LuisAlfonsoHernandez_ES.pdf')
  const buffer = readFileSync(await download.path())
  expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  expect(buffer.byteLength).toBeGreaterThan(10_000)
})

test('descarga el CV en inglés al cambiar el idioma', async ({ page }) => {
  await waitForHome(page)
  await page.getByRole('button', { name: 'English' }).click()
  const download = await downloadCv(page, /download cv/i)
  expect(download.suggestedFilename()).toBe('CV_LuisAlfonsoHernandez_EN.pdf')
  const buffer = readFileSync(await download.path())
  expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-')
})

test('el toggle de idioma traduce las secciones de la página', async ({ page }) => {
  await waitForHome(page)
  await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible()
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible()
  await page.getByRole('button', { name: 'Español' }).click()
  await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible()
})
