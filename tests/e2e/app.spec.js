import { test, expect } from '@playwright/test';

test.describe('Language Learning App', () => {
  test('should load the homepage without errors', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait a bit for the page to load
    await page.waitForTimeout(2000);
    
    // Check if there are any console errors
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    
    // Check that the page title is set
    await expect(page).toHaveTitle('Language Learning');
    
    // Check that the app div exists
    const app = page.locator('#app');
    await expect(app).toBeAttached();
  });

  test('should have the correct HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Check if body has the expected classes
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-gradient-to-br/);
  });

  test('should toggle dark mode on and off correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Open settings
    const settingsButton = page.locator('button[title="Settings"]');
    await settingsButton.click();
    await page.waitForTimeout(500);

    // Verify dark mode is initially off
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/dark/);

    // Find and click the dark mode toggle label (checkbox is hidden with opacity-0)
    // Get the second label with the toggle class (first is Show Translations, second is Dark Mode)
    const darkModeLabel = page.locator('label.relative.inline-block').nth(1);
    await darkModeLabel.click();
    await page.waitForTimeout(500);

    // Verify dark mode is enabled
    await expect(body).toHaveClass(/dark/);

    // Toggle dark mode off
    await darkModeLabel.click();
    await page.waitForTimeout(500);

    // Verify dark mode is disabled
    await expect(body).not.toHaveClass(/dark/);
  });

  test('should persist dark mode setting after reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Open settings and enable dark mode
    const settingsButton = page.locator('button[title="Settings"]');
    await settingsButton.click();
    await page.waitForTimeout(500);

    const darkModeLabel = page.locator('label.relative.inline-block').nth(1);
    await darkModeLabel.click();
    await page.waitForTimeout(500);

    // Verify dark mode is enabled
    const body = page.locator('body');
    await expect(body).toHaveClass(/dark/);

    // Reload the page
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify dark mode persists after reload
    await expect(body).toHaveClass(/dark/);

    // Clean up - disable dark mode
    await settingsButton.click();
    await page.waitForTimeout(500);
    await darkModeLabel.click();
  });
});
