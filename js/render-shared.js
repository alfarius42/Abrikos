/**
 * Shared render helpers for page modules.
 */
(function () {
  const icons = window.SITE_ICONS || {};

  function escapeHtml(value) {
    return window.SiteUtils?.escapeHtml ? window.SiteUtils.escapeHtml(value) : String(value);
  }

  function renderPageHeader(title, subtitle) {
    return (
      '<header class="page-header">' +
      '<div class="container">' +
      '<h1>' +
      escapeHtml(title) +
      '</h1>' +
      (subtitle
        ? '<p class="page-header__subtitle">' + escapeHtml(subtitle) + '</p>'
        : '') +
      '</div></header>'
    );
  }

  function renderBookingWidget() {
    const cfg = window.SITE_CONFIG || {};
    if (cfg.agastIframeSrc) {
      return (
        '<section id="booking-widget">' +
        '<div class="container">' +
        '<h2 class="booking-widget__title">Онлайн-бронирование</h2>' +
        '<p class="booking-widget__lead">Выберите даты и номер — подтвердим бронирование в течение часа.</p>' +
        '<div id="agast-widget-container">' +
        '<iframe src="' +
        escapeHtml(cfg.agastIframeSrc) +
        '" title="Бронирование agast.ru" loading="lazy"></iframe>' +
        '</div></div></section>'
      );
    }

    return (
      '<section id="booking-widget">' +
      '<div class="container">' +
      '<h2 class="booking-widget__title">Онлайн-бронирование</h2>' +
      '<p class="booking-widget__lead">Выберите даты и номер — подтвердим бронирование в течение часа.</p>' +
      '<div id="agast-widget-container">' +
      '<div class="agast-placeholder">' +
      '<div class="agast-placeholder__icon" aria-hidden="true">🗓</div>' +
      '<p class="agast-placeholder__title"><strong>Виджет бронирования agast.ru</strong></p>' +
      '<p class="agast-placeholder__text">Здесь размещается виджет системы бронирования.<br>Укажите <code>agastIframeSrc</code> в js/config.js</p>' +
      '<a class="btn-primary agast-placeholder__link" href="https://agast.ru" target="_blank" rel="noopener noreferrer">' +
      'Перейти к бронированию ' +
      icons.externalLink +
      '</a>' +
      '</div></div></div></section>'
    );
  }

  function renderNotFound() {
    return (
      '<section class="page-not-found">' +
      '<div class="container">' +
      '<h2>Страница не найдена</h2>' +
      '<p>Проверьте адрес или вернитесь на главную.</p>' +
      '<a class="btn-primary" data-nav href="/">На главную</a>' +
      '</div></section>'
    );
  }

  window.RenderShared = {
    escapeHtml: escapeHtml,
    renderPageHeader: renderPageHeader,
    renderBookingWidget: renderBookingWidget,
    renderNotFound: renderNotFound,
  };
})();
