import { test, expect } from '@playwright/test';

test.describe('FlowNode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('renders with default label', async ({ page }) => {
    const node = page.locator('#node-1');
    await expect(node).toBeVisible();
    await expect(node).toHaveAttribute('label', 'Node');

    const label = await page.evaluate(() => {
      const node = document.querySelector('#node-1');
      return node.shadowRoot.querySelector('span').textContent;
    });
    expect(label).toBe('Node');
  });

  test('updates label when attribute is changed', async ({ page }) => {
    const node = page.locator('#node-1');
    await node.evaluate(el => el.setAttribute('label', 'Updated Label'));

    await page.waitForFunction(() => {
      const node = document.querySelector('#node-1');
      return node.shadowRoot.querySelector('span').textContent === 'Updated Label';
    });

    const label = await page.evaluate(() => {
      const node = document.querySelector('#node-1');
      return node.shadowRoot.querySelector('span').textContent;
    });
    expect(label).toBe('Updated Label');
  });

  test('renders slotted content instead of label', async ({ page }) => {
    const node = page.locator('#node-1');
    await page.evaluate(() => {
      const node = document.querySelector('#node-1');
      node.innerHTML = '<div>Custom Content</div>';
    });

    // Ensure we are targeting the slotted div, not the one in the shadow DOM
    await expect(node.locator('div').first()).toHaveText('Custom Content');

    const label = await page.evaluate(() => {
      const node = document.querySelector('#node-1');
      return node.shadowRoot.querySelector('span').textContent;
    });
    expect(label).toBe('');
  });

  test('drags the node to a new position', async ({ page }) => {
    const node = page.locator('#node-1');
    const boundingBox = await node.boundingBox();

    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100);
    await page.mouse.up();

    // Initial position is 100, 100
    await expect(node).toHaveCSS('top', '200px');
    await expect(node).toHaveCSS('left', '200px');
  });

  test('drags the node correctly on a zoomed graph', async ({ page }) => {
    const graph = page.locator('flow-graph');
    const node = page.locator('#node-1');

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

    const finalTop = await node.evaluate(el => parseFloat(el.style.top));
    const finalLeft = await node.evaluate(el => parseFloat(el.style.left));

    // The drag distance should be scaled by the zoom factor
    expect(finalTop).toBeCloseTo(100 + (100 / zoomFactor));
    expect(finalLeft).toBeCloseTo(100 + (100 / zoomFactor));
  });
});
