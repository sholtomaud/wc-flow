import { test, expect } from '@playwright/test';

test.describe('FlowPort', () => {
  test('displays label on hover', async ({ page }) => {
    await page.goto('/index.html');

    const port1 = page.locator('#node-1-port-1');
    await expect(port1).toBeVisible();

    const port2 = page.locator('#node-1-port-2');
    await expect(port2).toBeVisible();

    // Screenshot before hover
    await expect(page).toHaveScreenshot('ports-no-hover.png');

    await port1.hover();

    // Screenshot after hover
    await expect(page).toHaveScreenshot('ports-with-hover.png');

    const label = port1.locator('span');
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Output');
  });
});
