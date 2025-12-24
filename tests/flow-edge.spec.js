import { test, expect } from '@playwright/test';

test.describe('FlowEdge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('renders with default path', async ({ page }) => {
    await page.evaluate(() => {
      const edge = document.createElement('flow-edge');
      document.body.appendChild(edge);
    });

    const edge = page.locator('flow-edge');
    await expect(edge).toBeVisible();
    const path = edge.locator('path');
    await expect(path).toHaveAttribute('d', 'M0,0 C50,0 50,100 100,100');
  });

  test('updates path when d attribute is changed', async ({ page }) => {
    await page.evaluate(() => {
      const edge = document.createElement('flow-edge');
      edge.setAttribute('d', 'M10,10 C20,20 80,80 90,90');
      document.body.appendChild(edge);
    });

    const edge = page.locator('flow-edge');
    const path = edge.locator('path');
    await expect(path).toHaveAttribute('d', 'M10,10 C20,20 80,80 90,90');
  });
});
