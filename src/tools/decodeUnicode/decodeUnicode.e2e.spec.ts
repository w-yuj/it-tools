import { test, expect } from '@playwright/test';

test.describe('Tool - DecodeUnicode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decodeUnicode');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('DecodeUnicode - IT Tools');
  });

  test('', async ({ page }) => {

  });
});