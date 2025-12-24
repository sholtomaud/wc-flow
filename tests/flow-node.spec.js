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
});
