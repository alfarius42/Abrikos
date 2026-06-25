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

  test('CTA banner links to rooms with 8 variants text', async ({ page }) => {
    await expect(page.locator('.home-cta__banner')).toContainText('Посмотрите наши номера');
    await expect(page.locator('.home-cta__banner')).toContainText('8 вариантов размещения');
    await page.locator('.home-cta__btn').click();
    await expect(page).toHaveURL('/rooms');
  });

  test('booking section has required ids and placeholder', async ({ page }) => {
    await expect(page.locator('#booking-widget')).toBeVisible();
    await expect(page.locator('#agast-widget-container')).toBeVisible();
    await expect(page.locator('.agast-placeholder')).toContainText('agast.ru');
  });

  test('mobile layout puts image before text in chess blocks', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const firstGrid = page.locator('.home-block').first().locator('.home-block__grid');
    const mediaBox = await firstGrid.locator('.home-block__media').boundingBox();
    const textBox = await firstGrid.locator('.home-block__text').boundingBox();
    expect(mediaBox.y).toBeLessThan(textBox.y);
  });
});
