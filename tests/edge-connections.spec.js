import { test, expect } from '@playwright/test';

test.describe('Flow Edge', () => {
  test('should connect to ports', async ({ page }) => {
    await page.goto('/tests/test.html');

    await page.evaluate(() => {
      const graph = document.createElement('flow-graph');
      graph.innerHTML = `
        <flow-node id="node-1" style="top: 50px; left: 50px;">
          <flow-port id="node-1-port-1" slot="ports" style="right: -5px; top: calc(50% - 5px);"></flow-port>
        </flow-node>
        <flow-node id="node-2" style="top: 200px; left: 250px;">
          <flow-port id="node-2-port-1" slot="ports" style="left: -5px; top: calc(50% - 5px);"></flow-port>
        </flow-node>
        <flow-edge source="node-1" source-port="node-1-port-1" target="node-2" target-port="node-2-port-1"></flow-edge>
      `;
      document.body.appendChild(graph);
    });

    await page.waitForFunction(() => {
      const edge = document.querySelector('flow-edge');
      if (!edge || !edge.shadowRoot) return false;
      const path = edge.shadowRoot.querySelector('path');
      return path && path.getAttribute('d');
    });

    const d = await page.locator('flow-edge path').getAttribute('d');
    const pathPoints = d.match(/M([\d.]+),([\d.]+) C.+ ([\d.]+),([\d.]+)/);
    const [, startX, startY, endX, endY] = pathPoints.map(parseFloat);

    const portPositions = await page.evaluate(() => {
      const sourceNode = document.getElementById('node-1');
      const targetNode = document.getElementById('node-2');
      const sourcePort = document.getElementById('node-1-port-1');
      const targetPort = document.getElementById('node-2-port-1');

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

    expect(startX).toBeCloseTo(portPositions.sourceX);
    expect(startY).toBeCloseTo(portPositions.sourceY);
    expect(endX).toBeCloseTo(portPositions.targetX);
    expect(endY).toBeCloseTo(portPositions.targetY);
  });
});
