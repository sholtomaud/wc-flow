import { test, expect } from '@playwright/test';

test.describe('Flow Edge', () => {
  test('should connect to ports', async ({ page }) => {
    await page.goto('/tests/test.html');

    const port1 = page.locator('#port-1');
    const port2 = page.locator('#port-2');

    const port1BoundingBox = await port1.boundingBox();
    const port2BoundingBox = await port2.boundingBox();

    await page.mouse.move(
      port1BoundingBox.x + port1BoundingBox.width / 2,
      port1BoundingBox.y + port1BoundingBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      port2BoundingBox.x + port2BoundingBox.width / 2,
      port2BoundingBox.y + port2BoundingBox.height / 2
    );
    await page.mouse.up();

    await page.waitForFunction(() => {
      const edge = document.querySelector('flow-edge');
      if (!edge || !edge.shadowRoot) return false;
      const path = edge.shadowRoot.querySelector('path');
      return path && path.getAttribute('d');
    });

    const d = await page.evaluate(() => {
      const edge = document.querySelector('flow-edge');
      return edge.shadowRoot.querySelector('path').getAttribute('d');
    });

    const pathPoints = d.match(/M([\d.]+),([\d.]+) C.+ ([\d.]+),([\d.]+)/);
    const [, startX, startY, endX, endY] = pathPoints.map(parseFloat);

    const portPositions = await page.evaluate(() => {
      const sourceNode = document.getElementById('node-1');
      const targetNode = document.getElementById('node-2');
      const sourcePort = document.getElementById('port-1');
      const targetPort = document.getElementById('port-2');

      const sourcePortStyle = window.getComputedStyle(sourcePort);
      const targetPortStyle = window.getComputedStyle(targetPort);

      const sourcePortWidth = parseFloat(sourcePortStyle.width);
      const sourcePortHeight = parseFloat(sourcePortStyle.height);
      const targetPortWidth = parseFloat(targetPortStyle.width);
      const targetPortHeight = parseFloat(targetPortStyle.height);

      return {
        sourceX: sourceNode.offsetLeft + sourcePort.offsetLeft + sourcePortWidth / 2,
        sourceY: sourceNode.offsetTop + sourcePort.offsetTop + sourcePortHeight / 2,
        targetX: targetNode.offsetLeft + targetPort.offsetLeft + targetPortWidth / 2,
        targetY: targetNode.offsetTop + targetPort.offsetTop + targetPortHeight / 2,
      };
    });

    const edge = page.locator('flow-graph > flow-edge:not([id="edge-1"])');
    await expect(edge).toHaveAttribute('source', 'node-1');
    await expect(edge).toHaveAttribute('source-port', 'port-1');
    await expect(edge).toHaveAttribute('target', 'node-2');
    await expect(edge).toHaveAttribute('target-port', 'port-2');
  });
});
