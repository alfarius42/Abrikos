/**
 * Home page renderer.
 */
(function () {
  window.PageRenderers = window.PageRenderers || {};

  const renderPageHeader = window.RenderShared?.renderPageHeader;
  const renderBookingWidget = window.RenderShared?.renderBookingWidget;
  const escapeHtml = window.RenderShared?.escapeHtml;
  const icons = window.SITE_ICONS || {};

  function renderHomeBlocks() {
    const blocks = window.SITE_DATA?.homeBlocks || [];
    return blocks
      .map(function (block, index) {
        const reversed = index % 2 === 1;
        return (
          '<section class="home-block">' +
          '<div class="container">' +
          '<div class="home-block__grid' +
          (reversed ? ' home-block__grid--reverse' : '') +
          '">' +
          '<div class="home-block__text">' +
          '<h2>' +
          escapeHtml(block.heading) +
          '</h2>' +
          '<p>' +
          escapeHtml(block.text) +
          '</p>' +
          '</div>' +
          '<div class="home-block__media">' +
          '<div class="home-block__image-wrap">' +
          '<img src="' +
          escapeHtml(block.imageUrl) +
          '" alt="' +
          escapeHtml(block.imageAlt) +
          '" loading="lazy" width="900" height="675" />' +
          '</div></div></div></div></section>'
        );
      })
      .join('');
  }

  function renderHomeCta() {
    const cta = window.SITE_DATA?.homeCta || {};
    return (
      '<section class="home-cta">' +
      '<div class="container">' +
      '<div class="home-cta__banner">' +
      '<div class="home-cta__copy">' +
      '<h2>' +
      escapeHtml(cta.title || 'Посмотрите наши номера') +
      '</h2>' +
      '<p>' +
      escapeHtml(cta.text || '') +
      '</p>' +
      '</div>' +
      '<a class="btn-primary home-cta__btn" data-nav href="/rooms">' +
      escapeHtml(cta.button || 'Все номера') +
      ' ' +
      icons.chevronRight +
      '</a>' +
      '</div></div></section>'
    );
  }

  window.PageRenderers.home = function (root) {
    const home = window.SITE_DATA?.home || {};
    const cfg = window.SITE_CONFIG || {};

    root.innerHTML =
      renderPageHeader(
        home.title || cfg.siteName || 'Гостевой дом «Абрикос»',
        home.subtitle ||
          'Уютный отдых на берегу Азовского моря в Ейске — 8 номеров от стандарта до апартаментов.'
      ) +
      '<div class="home-blocks">' +
      renderHomeBlocks() +
      '</div>' +
      renderHomeCta() +
      renderBookingWidget();
  };
})();
