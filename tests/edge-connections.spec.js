import { test, expect } from '@playwright/test';

test.describe('Flow Edge', () => {
  test('should connect to nodes and update on drag', async ({ page }) => {
    await page.goto('/tests/test.html');

    await page.evaluate(() => {
      const graph = document.createElement('flow-graph');
      graph.innerHTML = `
        <flow-node id="node-1" style="top: 50px; left: 50px;"></flow-node>
        <flow-node id="node-2" style="top: 200px; left: 250px;"></flow-node>
        <flow-edge source="node-1" target="node-2"></flow-edge>
      `;
      document.body.appendChild(graph);
    });

    const getPathD = () => page.locator('flow-edge path').getAttribute('d');

    await page.waitForFunction(() => {
      const edge = document.querySelector('flow-edge');
      if (!edge || !edge.shadowRoot) return false;
      const path = edge.shadowRoot.querySelector('path');
      return path && path.getAttribute('d');
    });

    const initialD = await getPathD();
    expect(initialD).not.toBeNull();
    expect(initialD).toContain('M');
    expect(initialD).toContain('C');

    const node1 = page.locator('flow-node#node-1');
    await node1.hover();
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();

    const finalD = await getPathD();
    expect(finalD).not.toBe(initialD);
    expect(finalD).toContain('M');
    expect(finalD).toContain('C');
  });
});
