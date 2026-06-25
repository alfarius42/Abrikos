/**
 * Privacy page renderer.
 */
(function () {
  window.PageRenderers = window.PageRenderers || {};

  const escapeHtml = window.RenderShared?.escapeHtml;
  const renderPageHeader = window.RenderShared?.renderPageHeader;

  function renderSectionsHtml() {
    const sections = window.PrivacyContent?.getSections ? window.PrivacyContent.getSections() : [];
    return sections
      .map(function (section, index) {
        const divider =
          index < sections.length - 1
            ? '<div class="privacy-section__divider" aria-hidden="true"></div>'
            : '';

        return (
          '<article class="privacy-section">' +
          '<h2 class="privacy-section__title">' +
          escapeHtml(section.title) +
          '</h2>' +
          '<div class="privacy-section__body">' +
          section.body +
          '</div>' +
          divider +
          '</article>'
        );
      })
      .join('');
  }

  window.PageRenderers.privacy = function (root) {
    root.innerHTML =
      renderPageHeader('Политика обработки персональных данных') +
      '<section class="privacy-page">' +
      '<div class="container privacy-page__inner">' +
      '<div class="privacy-card">' +
      '<p class="privacy-card__date">Дата вступления в силу: 01.01.2026</p>' +
      renderSectionsHtml() +
      '</div></div></section>';
  };
})();
