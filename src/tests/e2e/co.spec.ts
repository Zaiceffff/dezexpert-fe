// e2e — smoke для /co
import { test, expect } from '@playwright/test';

test('co form loads', async ({ page }) => {
  await page.goto('/co?id=test-partner');
  await expect(page.getByRole('heading', { name: /Предварительный расчёт/i })).toBeVisible();
});


