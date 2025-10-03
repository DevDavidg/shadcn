import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('heading', { name: 'Next SSR Starter' })).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('link', { name: 'Get Started' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: 'Next SSR Starter' })).toBeVisible()
    
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: 'Next SSR Starter' })).toBeVisible()
  })
})
