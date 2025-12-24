import { test, expect } from '@playwright/test';

test.describe('FlowNode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('renders with default label', async ({ page }) => {
    await page.evaluate(() => {
      const node = document.createElement('flow-node');
      document.body.appendChild(node);
    });

    const node = page.locator('flow-node');
    await expect(node).toBeVisible();
    await expect(node).toHaveAttribute('label', 'Node');
    await expect(node.locator('span')).toHaveText('Node');
  });

  test('updates label when attribute is changed', async ({ page }) => {
    await page.evaluate(() => {
      const node = document.createElement('flow-node');
      node.setAttribute('label', 'Initial Label');
      document.body.appendChild(node);
      node.setAttribute('label', 'Updated Label');
    });

    const node = page.locator('flow-node');
    await expect(node.locator('span')).toHaveText('Updated Label');
  });

  test('renders slotted content instead of label', async ({ page }) => {
    await page.evaluate(() => {
      const node = document.createElement('flow-node');
      node.innerHTML = '<div>Custom Content</div>';
      document.body.appendChild(node);
    });

    const node = page.locator('flow-node');
    // Ensure we are targeting the slotted div, not the one in the shadow DOM
    await expect(node.locator('div:not(.flow-node)')).toHaveText('Custom Content');
    await expect(node.locator('span')).toHaveText('');
  });

  test('drags the node to a new position', async ({ page }) => {
    await page.evaluate(() => {
      const node = document.createElement('flow-node');
      node.style.top = '100px';
      node.style.left = '100px';
      document.body.appendChild(node);
    });

    const node = page.locator('flow-node');
    const boundingBox = await node.boundingBox();

    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100);
    await page.mouse.up();

    await expect(node).toHaveCSS('top', '200px');
    await expect(node).toHaveCSS('left', '200px');
  });

  test('drags the node correctly on a zoomed graph', async ({ page }) => {
    await page.evaluate(() => {
      const graph = document.createElement('flow-graph');
      const node = document.createElement('flow-node');
      node.style.top = '100px';
      node.style.left = '100px';
      graph.appendChild(node);
      document.body.appendChild(graph);
    });

    const graph = page.locator('flow-graph');
    const node = page.locator('flow-node');

    // Zoom in on the graph
    await graph.hover();
    await page.mouse.wheel(0, -200); // Zoom in more aggressively

    const boundingBox = await node.boundingBox();
    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100);
    await page.mouse.up();

    const zoom = await graph.evaluate(el => getComputedStyle(el).getPropertyValue('--flow-zoom'));
    const zoomFactor = parseFloat(zoom) || 1;

    const finalTop = await node.evaluate(el => el.style.top);
    const finalLeft = await node.evaluate(el => el.style.left);

    // The drag distance should be scaled by the zoom factor
    expect(parseFloat(finalTop)).toBeCloseTo(100 + (100 / zoomFactor));
    expect(parseFloat(finalLeft)).toBeCloseTo(100 + (100 / zoomFactor));
  });
});
