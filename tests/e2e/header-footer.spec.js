import { test, expect } from '@playwright/test';

test.describe('Sprint 1.1 — Header + Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'accepted');
    });
    await page.goto('/');
  });

  test('header renders logo, phone dropdown and book CTA', async ({ page }) => {
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.site-header__logo-img')).toHaveAttribute('src', /logo-header\.webp/);
    await expect(page.locator('.site-header__logo-text--full')).toContainText('Гостевой дом «Абрикос»');
    await expect(page.locator('.site-header__logo-tagline')).toContainText('Ейск');
    await expect(page.locator('.site-header__logo-tagline')).not.toContainText('гостевой дом');
    await expect(page.locator('.site-header__phones')).toBeHidden();
    await expect(page.locator('#btn-phone-menu')).toBeVisible();
    await page.locator('#btn-phone-menu').click();
    await expect(page.locator('.site-header__phone-menu-link')).toHaveCount(2);
    await expect(page.locator('#btn-book')).toContainText('Забронировать');
  });

  test('desktop header opens phone dropdown with both numbers', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('.site-header__phones')).toBeHidden();
    await expect(page.locator('#btn-phone-menu')).toBeVisible();
    await page.locator('#btn-phone-menu').click();
    await expect(page.locator('#phone-menu')).toBeVisible();
    const links = page.locator('.site-header__phone-menu-link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute('href', 'tel:+79637551055');
    await expect(links.nth(1)).toHaveAttribute('href', 'tel:+79057052657');

    await links.nth(0).click();
    await expect(page.locator('#phone-copy-toast')).toContainText('8 963 755 10 55');
    await expect(page).toHaveURL('/');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('8 963 755 10 55');
  });

  test('mobile header shows short brand name and logo', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.site-header__logo-text--short')).toBeVisible();
    await expect(page.locator('.site-header__logo-text--short')).toHaveText('Абрикос');
    await expect(page.locator('.site-header__logo-text--full')).toBeHidden();
    await expect(page.locator('.site-header__logo-img')).toHaveAttribute('src', /logo-header\.webp/);
  });

  test('mobile header opens phone dropdown with clickable numbers', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('#btn-phone-menu')).toBeVisible();
    await expect(page.locator('#phone-menu')).toBeHidden();

    await page.locator('#btn-phone-menu').click();
    await expect(page.locator('#phone-menu')).toBeVisible();

    const links = page.locator('.site-header__phone-menu-link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute('href', 'tel:+79637551055');
    await expect(links.nth(1)).toHaveAttribute('href', 'tel:+79057052657');
    await expect(links.nth(0)).toContainText('8 963 755 10 55');

    await links.nth(0).click();
    await expect(page.locator('#phone-copy-toast')).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('footer and drawer email use mailto links', async ({ page }) => {
    await expect(page.locator('.site-footer__email')).toHaveAttribute('href', 'mailto:savin@rosevent.ru');
    await page.locator('#btn-menu').click();
    await expect(page.locator('.site-drawer__email')).toHaveAttribute('href', 'mailto:savin@rosevent.ru');
  });

  test('footer renders nav, social links and legal block', async ({ page }) => {
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('.site-footer__link[href="/rooms"]')).toBeVisible();
    await expect(page.locator('.site-footer__social-btn--vk')).toHaveAttribute(
      'href',
      'https://vk.com/abrikos_yeisk_hotel'
    );
    await expect(page.locator('.site-footer__social-btn--tg')).toHaveAttribute(
      'href',
      'https://t.me/abrikos_yeisk_hotel'
    );
    await expect(page.locator('.site-footer__email')).toHaveAttribute('href', 'mailto:savin@rosevent.ru');
    await expect(page.locator('.site-footer__address')).toContainText('ул. Советов');
  });

  test('burger opens and closes drawer', async ({ page }) => {
    await page.locator('#btn-menu').click();
    await expect(page.locator('#site-drawer')).toHaveClass(/is-open/);
    await expect(page.locator('.site-drawer__link[href="/rooms"]')).toBeVisible();
    await page.locator('#drawer-overlay').click();
    await expect(page.locator('#site-drawer')).not.toHaveClass(/is-open/);
  });

  test('book CTA opens Agast from header on home', async ({ page, context }) => {
    const popupPromise = context.waitForEvent('page');
    await page.locator('#btn-book').click();
    const popup = await popupPromise;

    await expect(popup).toHaveURL(/booking-online\.agast\.ru\/booking\/rooms$/);
    await popup.close();
  });

  test('logo on home scrolls to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.locator('#site-logo').click();
    await page.waitForFunction(() => window.scrollY < 50, { timeout: 3000 });
    await expect(page).toHaveURL('/');
  });

  test('logo from another page navigates home and scrolls top', async ({ page }) => {
    await page.locator('.site-footer__link[href="/rooms"]').click();
    await expect(page).toHaveURL('/rooms');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.locator('#site-logo').click();
    await expect(page).toHaveURL('/');
    await page.waitForFunction(() => window.scrollY < 50, { timeout: 3000 });
  });

  test('header gets glass effect on scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 100));
    await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
  });
});
