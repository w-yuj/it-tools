import { test, expect } from '@playwright/test';

test.describe('Tool - ImageCompressor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ImageCompressor');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('ImageCompressor - IT Tools');
  });

  test('', async ({ page }) => {

  });
});