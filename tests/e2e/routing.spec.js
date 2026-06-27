import { test, expect } from '@playwright/test';

test.describe('Routing contracts — price, notFound, popstate', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'accepted');
    });
  });

  test('/price renders contract page (not 404)', async ({ page }) => {
    await page.goto('/price');
    await expect(page).toHaveURL('/price');
    await expect(page.locator('.page-header h1')).toContainText('Прайс');
    await expect(page.locator('.price-page')).toBeVisible();
    await expect(page.locator('.price-table')).toBeVisible();
    await expect(page.locator('#price-table-body tr')).toHaveCount(8);
    await expect(page.locator('#price-table-body')).toContainText('Кубанский дом');
    await expect(page.locator('#price-table-body')).toContainText('5 500 ₽');
    await expect(page.locator('.page-not-found')).toHaveCount(0);
  });

  test('unknown route shows notFound screen and returns home', async ({ page }) => {
    await page.goto('/missing-route');
    await expect(page).toHaveURL('/missing-route');
    await expect(page.locator('.page-not-found')).toBeVisible();
    await page.locator('.page-not-found a[href="/"]').click();
    await expect(page).toHaveURL(/\/(#booking-widget)?$/);
    await expect(page.locator('.page-header h1')).toContainText('Гостевой дом «Абрикос»');
    await expect(page.locator('.page-header h1')).toContainText('Ейск');
  });

  test('popstate works for browser back/forward', async ({ page }) => {
    await page.goto('/');
    await page.locator('#btn-menu').click();
    await page.locator('.site-drawer__link[href="/rooms"]').click();
    await expect(page).toHaveURL('/rooms');

    await page.locator('.room-card').first().locator('.room-card__more').click();
    await expect(page).toHaveURL('/rooms/1');
    await expect(page.locator('.room-detail')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL('/rooms');
    await expect(page.locator('.rooms-grid')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.locator('.home-block')).toHaveCount(4);

    await page.goForward();
    await expect(page).toHaveURL('/rooms');
    await expect(page.locator('.rooms-grid')).toBeVisible();
  });

  test('header booking from /rooms navigates home and scrolls to widget', async ({ page }) => {
    await page.goto('/rooms');
    await page.locator('#btn-book').click();
    await expect(page).toHaveURL(/\/(#booking-widget)?$/);
    await expect(page.locator('#booking-widget')).toBeInViewport();
  });
});
