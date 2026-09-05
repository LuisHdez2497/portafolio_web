import { expect, test } from '@playwright/test'

test('la home carga y muestra el nombre', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Luis Alfonso Hernández/i })).toBeVisible()
})
