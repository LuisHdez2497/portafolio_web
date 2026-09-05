import { expect, test, type Page } from '@playwright/test'

async function waitForContact(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Contacto' })).toBeVisible()
}

test('WhatsApp abre una conversación en vez de marcar una llamada', async ({ page }) => {
  await waitForContact(page)
  const whatsApp = page.getByRole('link', { name: /whatsapp/i })
  await expect(whatsApp).toBeVisible()
  await expect(whatsApp).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+$/)
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
})

test('el canal preferido se señala una sola vez', async ({ page }) => {
  await waitForContact(page)
  await expect(page.getByText('Preferido', { exact: true })).toHaveCount(1)
})

test('las etiquetas de contacto se traducen al inglés', async ({ page }) => {
  await waitForContact(page)
  await expect(page.getByText('Ubicación', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible()
  await expect(page.getByText('Location', { exact: true })).toBeVisible()
  await expect(page.getByText('Preferred', { exact: true })).toHaveCount(1)
})
