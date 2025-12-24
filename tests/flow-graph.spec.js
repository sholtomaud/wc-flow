import { test, expect } from '@playwright/test';

test('flow-graph component is rendered', async ({ page }) => {
  await page.goto('/');

  // Check that the flow-graph element exists on the page
  const flowGraph = page.locator('flow-graph');
  await expect(flowGraph).toBeVisible();
});

test.describe('FlowGraph', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('zooms in and out with the mouse wheel', async ({ page }) => {
    // Zoom in
    await page.mouse.move(10, 10);
    await page.mouse.wheel(0, -100);

    let transform = await page.evaluate(() => {
      const graph = document.querySelector('flow-graph');
      const viewport = graph.shadowRoot.querySelector('.flow-graph-viewport');
      return window.getComputedStyle(viewport).transform;
    });
    expect(transform).toBe('matrix(1.1, 0, 0, 1.1, -1, -1)');

    // Zoom out
    await page.mouse.wheel(0, 100);

    transform = await page.evaluate(() => {
      const graph = document.querySelector('flow-graph');
      const viewport = graph.shadowRoot.querySelector('.flow-graph-viewport');
      return window.getComputedStyle(viewport).transform;
    });
    const scale = parseFloat(transform.split(',')[0].replace('matrix(', ''));
    expect(scale).toBeCloseTo(0.99);
  });

  test('pans the graph with a mouse drag', async ({ page }) => {
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();

    const transform = await page.evaluate(() => {
      const graph = document.querySelector('flow-graph');
      const viewport = graph.shadowRoot.querySelector('.flow-graph-viewport');
      return window.getComputedStyle(viewport).transform;
    });
    expect(transform).toBe('matrix(1, 0, 0, 1, 100, 100)');
  });
});
