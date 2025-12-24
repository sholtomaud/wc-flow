import { test, expect } from '@playwright/test';

test('visual regression test', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveScreenshot('main-page.png');
});
