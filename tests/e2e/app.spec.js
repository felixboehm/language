import { test, expect } from '@playwright/test';

test.describe('Language Learning App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the app loads
    await expect(page.locator('h1')).toContainText('Language Learning');
  });

  test('should display settings button', async ({ page }) => {
    await page.goto('/');
    
    // Check for settings button
    const settingsButton = page.locator('button[title="Settings"]');
    await expect(settingsButton).toBeVisible();
  });

  test('should be able to open settings', async ({ page }) => {
    await page.goto('/');
    
    // Click settings button
    const settingsButton = page.locator('button[title="Settings"]');
    await settingsButton.click();
    
    // Check that settings section is visible
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Show Translations')).toBeVisible();
    await expect(page.locator('text=Dark Mode')).toBeVisible();
  });
});
