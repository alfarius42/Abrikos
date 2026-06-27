import { test, expect } from '@playwright/test';

test.describe('Sprint 1.3 — Разводящая /rooms', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'accepted');
    });
    await page.goto('/rooms');
  });

  test('page header shows rooms title and subtitle', async ({ page }) => {
    await expect(page.locator('.page-header h1')).toContainText('Наши номера');
    await expect(page.locator('.page-header__subtitle')).toContainText('вариант размещения');
  });

  test('renders eight room cards', async ({ page }) => {
    const cards = page.locator('.room-card');
    await expect(cards).toHaveCount(8);
    await expect(cards.nth(0)).toContainText('Номер 1');
    await expect(cards.nth(0)).toContainText('Стандартный двухместный');
    await expect(cards.nth(6)).toContainText('Апартаменты');
    await expect(cards.nth(7)).toContainText('Кубанский дом');
  });

  test('each card shows area badge without prices on listing', async ({ page }) => {
    await expect(page.locator('.room-card').nth(0).locator('.room-card__area')).toHaveText('18 м²');
    await expect(page.locator('.room-card').nth(0).locator('.room-card__price')).toHaveCount(0);
    await expect(page.locator('.room-card').nth(1).locator('.room-card__area')).toHaveText('18 м²');
    await expect(page.locator('.room-card').nth(2).locator('.room-card__area')).toHaveText('24 м²');
    await expect(page.locator('.room-card').nth(2)).toContainText('Люкс');
    await expect(page.locator('.room-card').nth(4).locator('.room-card__area')).toHaveText('18 м²');
    await expect(page.locator('.room-card').nth(6).locator('.room-card__area')).toHaveText('20 м²');
    await expect(page.locator('.room-card').nth(7).locator('.room-card__area')).toHaveText('36 м²');
    await expect(page.locator('.room-card .room-card__price')).toHaveCount(0);
  });

  test('detail link navigates to room page without reload', async ({ page }) => {
    await page.locator('.room-card').nth(2).locator('.room-card__more').click();
    await expect(page).toHaveURL('/rooms/3');
    await expect(page.locator('.page-header h1')).toContainText('Номер 3');
    await expect(page.locator('#app-main')).toContainText('Просторный люкс');
  });

  test('apartments card links to /rooms/apartments', async ({ page }) => {
    await page.locator('.room-card').nth(6).locator('.room-card__title a').click();
    await expect(page).toHaveURL('/rooms/apartments');
    await expect(page.locator('.page-header h1')).toContainText('Апартаменты');
  });

  test('book CTA stub navigates home and marks pending room (Sprint 3 placeholder)', async ({
    page,
  }) => {
    await page.locator('.room-card').nth(1).locator('[data-room-book="2"]').click();
    await expect(page).toHaveURL(/\/\?room=2#booking-widget$/);
    await expect(page.locator('#agast-widget-container')).toHaveAttribute('data-pending-room', '2');
    await expect(page.locator('#booking-widget')).toBeInViewport();
  });

  test('book CTA from apartments card sets correct pending room id', async ({ page }) => {
    await page.locator('.room-card').nth(6).locator('[data-room-book="apartments"]').click();
    await expect(page).toHaveURL(/\/\?room=apartments#booking-widget$/);
    await expect(page.locator('#agast-widget-container')).toHaveAttribute(
      'data-pending-room',
      'apartments'
    );
  });
});
