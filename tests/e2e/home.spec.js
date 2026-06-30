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
    await expect(page.locator('.page-header h1')).toContainText('Ейск');
    await expect(page.locator('.page-header__subtitle')).toContainText('8 номеров');
    await expect(page.locator('.page-header__subtitle')).toContainText('5 минут');
    await expect(page.locator('.page-header__subtitle')).not.toContainText('мини-отель');
  });

  test('page has exactly one h1 and valid heading hierarchy', async ({ page }) => {
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText('Гостевой дом «Абрикос» в Ейске');

    await expect(page.locator('#home-welcome-title')).toHaveCount(1);
    await expect(page.locator('#home-highlights-title')).toHaveCount(1);
    await expect(page.locator('.home-block__text h3')).toHaveCount(3);
    await expect(page.locator('main h2')).toHaveCount(6);
    await expect(page.locator('#home-about-title')).toBeVisible();
    await expect(page.locator('#home-map-title')).toBeVisible();
    await expect(page.locator('#booking-widget-title')).toBeVisible();
    await expect(page.locator('.home-about h3')).toHaveCount(2);
  });

  test('welcome section, chess blocks and highlights render in order', async ({ page }) => {
    await expect(page.locator('.home-welcome')).toContainText('Добро пожаловать в «Абрикос»');
    await expect(page.locator('#home-welcome-title')).toContainText('Добро пожаловать');
    await expect(page.locator('.home-welcome')).toContainText('5 минут');

    const blocks = page.locator('.home-block');
    await expect(blocks).toHaveCount(3);
    await expect(blocks.nth(0)).toContainText('Море — в пяти минутах от порога');
    await expect(blocks.nth(2)).toContainText('8 вариантов размещения');

    await expect(page.locator('.home-highlights__item')).toHaveCount(6);
    await expect(page.locator('#home-highlights-title')).toContainText('Почему отдыхают');

    const welcomeBox = await page.locator('.home-welcome').boundingBox();
    const highlightsBox = await page.locator('.home-highlights').boundingBox();
    expect(welcomeBox.y).toBeLessThan(highlightsBox.y);
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

  test('about section with amenities appears before map', async ({ page }) => {
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#home-about-title')).toContainText('О гостевом доме');
    await expect(page.locator('.home-about__amenities')).toContainText('Можно с животными');
    await expect(page.locator('.home-about__terms')).toContainText('3 суток');

    const aboutBox = await page.locator('#about').boundingBox();
    const mapBox = await page.locator('#location').boundingBox();
    expect(aboutBox.y).toBeLessThan(mapBox.y);
  });

  test('map section appears before booking widget with external links', async ({ page }) => {
    await expect(page.locator('#location')).toBeVisible();
    await expect(page.locator('#home-map-title')).toContainText('Как нас найти');
    await expect(page.locator('.home-map__address')).toContainText('ул. Советов, д. 12');
    await expect(page.locator('#home-map-canvas')).toBeVisible();
    await expect(page.locator('#home-map-link-yandex')).toHaveAttribute('href', /yandex\.ru\/maps/);
    await expect(page.locator('#home-map-link-2gis')).toHaveAttribute('href', /2gis\.ru/);
    await expect(page.locator('#home-map-poi-legend')).toContainText('Пляж «Каменка»');
    await expect(page.locator('#home-map-poi-legend')).toContainText('Ж/д вокзал');
    await expect(page.locator('.home-map__panel')).toBeVisible();
    await expect(page.locator('.home-map__panel #home-map-canvas')).toBeVisible();

    const mapBox = await page.locator('#location').boundingBox();
    const bookingBox = await page.locator('#booking-widget').boundingBox();
    expect(mapBox.y).toBeLessThan(bookingBox.y);
  });

  test('desktop welcome title aligns with page header h1', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    const headerTitle = await page.locator('.page-header h1').boundingBox();
    const welcomeTitle = await page.locator('#home-welcome-title').boundingBox();
    expect(Math.abs(headerTitle.x - welcomeTitle.x)).toBeLessThanOrEqual(2);
  });

  test('desktop chess blocks alternate text and image columns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    const firstGrid = page.locator('.home-blocks .home-block').nth(0).locator('.home-block__grid');
    const firstText = await firstGrid.locator('.home-block__text').boundingBox();
    const firstMedia = await firstGrid.locator('.home-block__media').boundingBox();
    expect(firstMedia.x).toBeLessThan(firstText.x);

    const secondGrid = page.locator('.home-blocks .home-block').nth(1).locator('.home-block__grid');
    const secondText = await secondGrid.locator('.home-block__text').boundingBox();
    const secondMedia = await secondGrid.locator('.home-block__media').boundingBox();
    expect(secondText.x).toBeLessThan(secondMedia.x);
  });

  test('booking section opens Agast in new tab without URL in HTML', async ({ page, context }) => {
    await expect(page.locator('#booking-widget')).toBeVisible();
    await expect(page.locator('#btn-booking-open')).toBeVisible();
    await expect(page.locator('#agast-widget-container')).toBeHidden();

    const html = await page.content();
    expect(html).not.toContain('booking-online.agast.ru');
    expect(html).not.toContain('hms_system_id');

    const popupPromise = context.waitForEvent('page');
    await page.locator('#btn-booking-open').click();
    const popup = await popupPromise;

    await expect(popup).toHaveURL(/booking-online\.agast\.ru\/booking\/rooms$/);
    await popup.close();
  });

  test('mobile layout puts text before image in welcome block', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const welcomeGrid = page.locator('.home-welcome .home-block__grid');
    const mediaBox = await welcomeGrid.locator('.home-block__media').boundingBox();
    const textBox = await welcomeGrid.locator('.home-block__text').boundingBox();
    expect(textBox.y).toBeLessThan(mediaBox.y);
  });
});
