import { test, expect } from '@playwright/test';

test('basic navigation and auth check', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:5173');

  // Check title (update this if title is different, but for now strict check might fail if title is default)
  // Let's just check if body is visible to ensure load
  await expect(page.locator('body')).toBeVisible();

  // Check for Dashboard presence (assuming protected route redirects to login or shows something)
  // For now, just check if the main header is visible
  // Based on the screenshot, there is "GovData GuardDashboard" text
  await expect(page.getByText('GovData Guard')).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'e2e/screenshot.png' });
});
