import { test, expect } from '@playwright/test';

test.describe('Tool - Solid color png generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solid-color-png-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Solid color png generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});