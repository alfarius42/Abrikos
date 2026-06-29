import { test, expect } from '@playwright/test';

test.describe('Sprint 1.6 — Privacy + cookies', () => {
  test('cookie banner appears for new users', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#cookie-banner')).toBeVisible();
    await expect(page.locator('.cookie-banner__text')).toContainText('cookie');
  });

  test('accept saves consent and hides banner', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-accept').click();
    await expect(page.locator('#cookie-banner')).toBeHidden();
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('cookie-consent')))
      .toBe('accepted');
    await page.reload();
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('decline saves consent and hides banner', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-decline').click();
    await expect(page.locator('#cookie-banner')).toBeHidden();
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('cookie-consent')))
      .toBe('declined');
    await page.reload();
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('privacy page renders all policy sections', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'accepted');
    });
    await page.goto('/');
    await page.locator('.site-footer__link[href="/privacy"]').click();
    await expect(page).toHaveURL('/privacy');
    await expect(page).toHaveTitle(/Политика ПД/);
    await expect(page.locator('.privacy-card')).toBeVisible();
    await expect(page.locator('.privacy-card__date')).toContainText('01.01.2026');
    await expect(page.locator('.privacy-section')).toHaveCount(9);
    await expect(page.locator('.privacy-section__title').first()).toContainText('Общие положения');
    await expect(page.locator('.privacy-section__body').first()).toContainText('Савин Александр Владимирович');
    await expect(page.locator('.privacy-section__body').nth(2)).toContainText('AGAST');
  });
});
