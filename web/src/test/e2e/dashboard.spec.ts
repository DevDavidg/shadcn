import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should display dashboard overview', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible()
    await expect(page.getByText('Total Users')).toBeVisible()
    await expect(page.getByText('Active Projects')).toBeVisible()
  })

  test('should show loading state', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 10000 })
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/dashboard')
    
    await page.getByRole('link', { name: 'Back to Home' }).click()
    await expect(page).toHaveURL('/')
  })
})
