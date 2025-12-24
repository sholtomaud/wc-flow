import { test, expect } from '@playwright/test';

test('flow-graph component is rendered', async ({ page }) => {
  await page.goto('/');

  // Check that the flow-graph element exists on the page
  const flowGraph = page.locator('flow-graph');
  await expect(flowGraph).toBeVisible();
});

test('zooms in and out with the mouse wheel', async ({ page }) => {
  await page.goto('/tests/test.html');

  await page.evaluate(() => {
    const graph = document.createElement('flow-graph');
    document.body.appendChild(graph);
  });

  const viewport = page.locator('flow-graph .flow-graph-viewport');

  // Zoom in
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, -100);
  await expect(viewport).toHaveCSS('transform', 'matrix(1.1, 0, 0, 1.1, -10, -10)');

  // Zoom out
  await page.mouse.wheel(0, 100);
  await expect(viewport).toHaveCSS('transform', 'matrix(0.99, 0, 0, 0.99, 1, 1)');
});

test('pans the graph with a mouse drag', async ({ page }) => {
  await page.goto('/tests/test.html');

  await page.evaluate(() => {
    const graph = document.createElement('flow-graph');
    document.body.appendChild(graph);
  });

  const viewport = page.locator('flow-graph .flow-graph-viewport');

  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();

  await expect(viewport).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 100, 100)');
});
