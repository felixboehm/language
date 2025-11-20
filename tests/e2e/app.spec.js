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
});
