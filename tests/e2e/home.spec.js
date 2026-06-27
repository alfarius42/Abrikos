import { test, expect } from '@playwright/test';

test.describe('Sprint 1.2 — Главная', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'accepted');
    });
    await page.goto('/');
  });

  test('page header shows guest house title and subtitle', async ({ page }) => {
    await expect(page.locator('.page-header h1')).toContainText('Гостевой дом «Абрикос»');
    await expect(page.locator('.page-header__subtitle')).toContainText('8 номеров');
    await expect(page.locator('.page-header__subtitle')).not.toContainText('мини-отель');
  });

  test('renders four chess blocks from data', async ({ page }) => {
    const blocks = page.locator('.home-block');
    await expect(blocks).toHaveCount(4);
    await expect(blocks.nth(0)).toContainText('Добро пожаловать в Абрикос');
    await expect(blocks.nth(0)).toContainText('Гостевой дом «Абрикос»');
    await expect(blocks.nth(3)).toContainText('8 вариантов размещения');
  });

  test('chess blocks use fixed image paths as placeholders', async ({ page }) => {
    await expect(page.locator('.home-block__image-wrap img').nth(0)).toHaveAttribute(
      'src',
      '/img/home-block-1.webp'
    );
    await expect(page.locator('.home-block__image-wrap img').nth(3)).toHaveAttribute(
      'src',
      '/img/home-block-4.webp'
    );
  });

  test('map section appears before booking widget with external links', async ({ page }) => {
    await expect(page.locator('#location')).toBeVisible();
    await expect(page.locator('#home-map-title')).toContainText('Как нас найти');
    await expect(page.locator('.home-map__address')).toContainText('ул. Советов, д. 12');
    await expect(page.locator('#home-map-canvas')).toBeVisible();
    await expect(page.locator('#home-map-link-yandex')).toHaveAttribute('href', /yandex\.ru\/maps/);
    await expect(page.locator('#home-map-link-2gis')).toHaveAttribute('href', /2gis\.ru/);

    const mapBox = await page.locator('#location').boundingBox();
    const bookingBox = await page.locator('#booking-widget').boundingBox();
    expect(mapBox.y).toBeLessThan(bookingBox.y);
  });

  test('desktop chess blocks alternate text and image columns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    const firstGrid = page.locator('.home-blocks .home-block').nth(0).locator('.home-block__grid');
    const firstText = await firstGrid.locator('.home-block__text').boundingBox();
    const firstMedia = await firstGrid.locator('.home-block__media').boundingBox();
    expect(firstText.x).toBeLessThan(firstMedia.x);

    const secondGrid = page.locator('.home-blocks .home-block').nth(1).locator('.home-block__grid');
    const secondText = await secondGrid.locator('.home-block__text').boundingBox();
    const secondMedia = await secondGrid.locator('.home-block__media').boundingBox();
    expect(secondMedia.x).toBeLessThan(secondText.x);
  });

  test('booking section has required ids and placeholder', async ({ page }) => {
    await expect(page.locator('#booking-widget')).toBeVisible();
    await expect(page.locator('#agast-widget-container')).toBeVisible();
    await expect(page.locator('.agast-placeholder')).toContainText('agast.ru');
  });

  test('mobile layout puts text before image in content blocks', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const firstGrid = page.locator('.home-block').first().locator('.home-block__grid');
    const mediaBox = await firstGrid.locator('.home-block__media').boundingBox();
    const textBox = await firstGrid.locator('.home-block__text').boundingBox();
    expect(textBox.y).toBeLessThan(mediaBox.y);
  });
});
