const { test, expect } = require('@playwright/test');

test.describe('checkContact_cy_1_js - Generated Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.udaykumar.tech/');
    await page.waitForLoadState('networkidle');
  });
  test('Application functionality test', async ({ page }) => {
      await page.goto('https://www.udaykumar.tech/');
  await page.waitForLoadState('networkidle');
      expect(page.url()).toBe('https://www.udaykumar.tech/');
      await page.locator('input#name').fill('Uday Kumar');
      await expect(page.locator('input#name')).toHaveValue('Uday Kumar');
      await page.locator('#outlined-basic').fill('7670848696');
      await expect(page.locator('#outlined-basic')).toHaveValue('7670848696');
      await page.locator('#emailID').fill('udaykumarvalapudasu@gmail.com');
      await expect(page.locator('#emailID')).toHaveValue('udaykumarvalapudasu@gmail.com');
  });
});
