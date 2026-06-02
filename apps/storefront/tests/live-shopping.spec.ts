import { test, expect } from '@playwright/test';

export default {
  use: {
    baseURL: 'http://localhost:3000',
  },
};

test('live shopping flow', async ({ page }) => {
  await page.goto('/live');
  await expect(page.locator('h1')).toContainText('Live Shopping');
});
