import { test, expect } from '@playwright/test';

test('flow-graph component is rendered', async ({ page }) => {
  await page.goto('/');

  // Check that the flow-graph element exists on the page
  const flowGraph = page.locator('flow-graph');
  await expect(flowGraph).toBeVisible();
});
