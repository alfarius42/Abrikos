/**
 * Рендер header, drawer и footer из SITE_CONFIG.
 */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const icons = window.SITE_ICONS || {};

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPhones(className) {
    return (cfg.phones || [])
      .map(function (p) {
        return (
          '<a class="' +
          className +
          '" href="' +
          escapeHtml(p.href) +
          '">' +
          icons.phone +
          '<span>' +
          escapeHtml(p.label) +
          '</span></a>'
        );
      })
      .join('');
  }

  function renderMobilePhoneDropdown() {
    const phones = cfg.phones || [];
    if (!phones.length) return '';

    return (
      '<div class="site-header__phone-dropdown">' +
      '<button type="button" class="site-header__phone-toggle" id="btn-phone-menu" aria-label="Выбрать номер для звонка" aria-expanded="false" aria-haspopup="listbox" aria-controls="phone-menu">' +
      icons.phone.replace('width="16"', 'width="19"').replace('height="16"', 'height="19"') +
      '</button>' +
      '<div class="site-header__phone-menu" id="phone-menu" role="listbox" hidden>' +
      phones
        .map(function (p) {
          return (
            '<a class="site-header__phone-menu-link" role="option" href="' +
            escapeHtml(p.href) +
            '">' +
            icons.phone +
            '<span>' +
            escapeHtml(p.label) +
            '</span></a>'
          );
        })
        .join('') +
      '</div></div>'
    );
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;

    const logo = cfg.logo || {};

    el.innerHTML =
      '<div class="site-header__inner container">' +
      '<button type="button" class="site-header__burger" id="btn-menu" aria-label="Меню" aria-expanded="false" aria-controls="site-drawer">' +
      icons.menu +
      '</button>' +
      '<button type="button" class="site-header__logo" id="site-logo">' +
      '<img src="' +
      escapeHtml(logo.src || '/img/logo.png') +
      '" alt="' +
      escapeHtml(logo.alt || cfg.siteName || '') +
      '" width="36" height="36" class="site-header__logo-img" />' +
      '<span class="site-header__logo-text site-header__logo-text--full">' +
      escapeHtml(cfg.siteName || 'Абрикос') +
      '</span>' +
      '<span class="site-header__logo-text site-header__logo-text--short">' +
      escapeHtml(cfg.siteNameShort || 'Абрикос') +
      '</span>' +
      '<span class="site-header__logo-tagline">' +
      escapeHtml(cfg.siteTagline || '') +
      '</span>' +
      '</button>' +
      '<div class="site-header__phones">' +
      renderPhones('site-header__phone') +
      '</div>' +
      renderMobilePhoneDropdown() +
      '<button type="button" class="btn-primary site-header__cta" id="btn-book">Забронировать</button>' +
      '</div>';
  }

  function renderDrawer() {
    const el = document.getElementById('site-drawer-root');
    if (!el) return;

    const navItems = [
      { label: 'Главная', href: '/' },
      { label: 'Наши номера', href: '/rooms' },
      { label: 'Прайс-лист', href: '/price' },
      { label: 'Политика ПД', href: '/privacy' },
    ];

    el.innerHTML =
      '<div class="site-drawer__overlay" id="drawer-overlay" hidden></div>' +
      '<aside class="site-drawer" id="site-drawer" aria-hidden="true">' +
      '<div class="site-drawer__head">' +
      '<span class="site-drawer__brand">' +
      escapeHtml(cfg.siteName || 'Абрикос') +
      '</span>' +
      '<button type="button" class="site-drawer__close" id="btn-drawer-close" aria-label="Закрыть меню">' +
      icons.close +
      '</button>' +
      '</div>' +
      '<nav class="site-drawer__nav" aria-label="Основная навигация">' +
      navItems
        .map(function (item) {
          return (
            '<a class="site-drawer__link" data-nav href="' +
            escapeHtml(item.href) +
            '">' +
            escapeHtml(item.label) +
            '<span class="site-drawer__link-arrow">' +
            icons.chevronRight +
            '</span></a>'
          );
        })
        .join('') +
      '</nav>' +
      '<div class="site-drawer__phones">' +
      renderPhones('site-drawer__phone') +
      (cfg.email
        ? '<a class="site-drawer__email" href="mailto:' +
          escapeHtml(cfg.email) +
          '">' +
          icons.mail +
          '<span>' +
          escapeHtml(cfg.email) +
          '</span></a>'
        : '') +
      '</div>' +
      '</aside>';
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;

    const social = cfg.social || {};
    const legal = cfg.legal || {};
    const year = new Date().getFullYear();

    el.innerHTML =
      '<div class="site-footer__wave" aria-hidden="true">' +
      '<svg viewBox="0 0 1440 48" preserveAspectRatio="none">' +
      '<path fill="var(--color-foam)" d="M0,32 C360,0 720,48 1080,24 C1260,12 1380,36 1440,32 L1440,0 L0,0 Z"/>' +
      '</svg></div>' +
      '<div class="site-footer__body container">' +
      '<div class="site-footer__grid">' +
      '<div class="site-footer__col">' +
      '<p class="site-footer__brand">' +
      escapeHtml(cfg.siteName || 'Абрикос') +
      '</p>' +
      '<p class="site-footer__tagline">На берегу Азовского моря, Ейск</p>' +
      '<p class="site-footer__address">' +
      escapeHtml(legal.address || '') +
      '</p>' +
      '<a class="site-footer__email" href="mailto:' +
      escapeHtml(cfg.email || '') +
      '">' +
      escapeHtml(cfg.email || '') +
      '</a>' +
      '</div>' +
      '<div class="site-footer__col">' +
      '<p class="site-footer__label">Навигация</p>' +
      '<a class="site-footer__link" data-nav href="/rooms">Наши номера</a>' +
      '<a class="site-footer__link" data-nav href="/price">Прайс-лист</a>' +
      '<a class="site-footer__link" data-nav href="/privacy">Политика ПД</a>' +
      '</div>' +
      '<div class="site-footer__col">' +
      '<p class="site-footer__label">Соцсети</p>' +
      '<div class="site-footer__social">' +
      (social.vk
        ? '<a class="site-footer__social-btn site-footer__social-btn--vk" href="' +
          escapeHtml(social.vk) +
          '" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте">ВК</a>'
        : '') +
      (social.telegram
        ? '<a class="site-footer__social-btn site-footer__social-btn--tg" href="' +
          escapeHtml(social.telegram) +
          '" target="_blank" rel="noopener noreferrer" aria-label="Telegram">TG</a>'
        : '') +
      (social.max
        ? '<a class="site-footer__social-btn site-footer__social-btn--max" href="' +
          escapeHtml(social.max) +
          '" target="_blank" rel="noopener noreferrer" aria-label="Max">M</a>'
        : '') +
      '</div></div></div>' +
      '<div class="site-footer__bottom">' +
      '<p>' +
      escapeHtml(legal.displayName || cfg.siteName || '') +
      '</p>' +
      '<p>© ' +
      year +
      ' ' +
      escapeHtml(cfg.siteName || 'Абрикос') +
      '</p>' +
      '</div></div>';
  }

  window.SiteShell = {
    render: function () {
      renderHeader();
      renderDrawer();
      renderFooter();
    },
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.SiteShell.render();
    document.dispatchEvent(new CustomEvent('shellrendered'));
  });
})();
