import { expect, test, type Page } from '@playwright/test'

const PREVIEW_COUNT = 3

async function waitForExperience(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible()
}

function roleCards(page: Page) {
  return page.locator('#experience-list > article')
}

test('la experiencia se recorta a los tres empleos más recientes', async ({ page }) => {
  await waitForExperience(page)
  await expect(roleCards(page)).toHaveCount(PREVIEW_COUNT)
})

test('el botón despliega los empleos anteriores y vuelve a recortarlos', async ({ page }) => {
  await waitForExperience(page)
  const toggle = page.getByRole('button', { name: 'Ver empleos anteriores' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()

  const expanded = page.getByRole('button', { name: 'Ver solo los recientes' })
  await expect(expanded).toHaveAttribute('aria-expanded', 'true')
  expect(await roleCards(page).count()).toBeGreaterThan(PREVIEW_COUNT)

  await expanded.click()
  await expect(roleCards(page)).toHaveCount(PREVIEW_COUNT)
})

test('el botón de expandir también se traduce al inglés', async ({ page }) => {
  await waitForExperience(page)
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('button', { name: 'Show earlier roles' })).toBeVisible()
})
