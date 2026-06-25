/**
 * Room detail renderer.
 */
(function () {
  window.PageRenderers = window.PageRenderers || {};

  const escapeHtml = window.RenderShared?.escapeHtml;
  const renderPageHeader = window.RenderShared?.renderPageHeader;
  const icons = window.SITE_ICONS || {};

  function renderFeatures(features) {
    return (features || [])
      .map(function (feature) {
        return '<li class="room-detail__feature">' + escapeHtml(feature) + '</li>';
      })
      .join('');
  }

  function renderThumbnails(room) {
    return (room.gallery || [])
      .map(function (imageUrl, index) {
        return (
          '<button type="button" class="room-detail__thumb' +
          (index === 0 ? ' is-active' : '') +
          '" data-gallery-thumb data-target-image="' +
          escapeHtml(imageUrl) +
          '" aria-label="Фото ' +
          escapeHtml(index + 1) +
          '">' +
          '<img src="' +
          escapeHtml(imageUrl) +
          '" alt="' +
          escapeHtml(room.name) +
          '" loading="lazy" />' +
          '</button>'
        );
      })
      .join('');
  }

  function bindGallery(root) {
    const mainImage = root.querySelector('[data-gallery-main]');
    if (!mainImage) return;

    root.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const nextSrc = thumb.getAttribute('data-target-image');
        if (!nextSrc) return;

        mainImage.setAttribute('src', nextSrc);
        root.querySelectorAll('[data-gallery-thumb]').forEach(function (item) {
          item.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
    });
  }

  window.PageRenderers.room = function (root, route) {
    const room = (window.SITE_DATA?.rooms || []).find(function (item) {
      return item.id === route.id;
    });

    if (!room) {
      root.innerHTML =
        '<section class="page-not-found">' +
        '<div class="container">' +
        '<h2>Номер не найден</h2>' +
        '<p>Проверьте ссылку или вернитесь к списку номеров.</p>' +
        '<a class="btn-primary" data-nav href="/rooms">Все номера</a>' +
        '</div></section>';
      return;
    }

    const mainImage = room.gallery?.[0] || room.imageUrl;

    root.innerHTML =
      renderPageHeader(room.name, room.tagline) +
      '<section class="room-detail">' +
      '<div class="container">' +
      '<a class="room-detail__back" data-nav href="/rooms">' +
      icons.chevronRight +
      '<span>К списку номеров</span></a>' +
      '<div class="room-detail__grid">' +
      '<div class="room-detail__gallery">' +
      '<div class="room-detail__main-image-wrap">' +
      '<img class="room-detail__main-image" data-gallery-main src="' +
      escapeHtml(mainImage) +
      '" alt="' +
      escapeHtml(room.name) +
      '" loading="lazy" width="1200" height="800" />' +
      '</div>' +
      '<div class="room-detail__thumbs">' +
      renderThumbnails(room) +
      '</div>' +
      '</div>' +
      '<div class="room-detail__content">' +
      '<p class="room-detail__description">' +
      escapeHtml(room.description) +
      '</p>' +
      '<dl class="room-detail__stats">' +
      '<div><dt>Площадь</dt><dd>' +
      escapeHtml(room.area) +
      ' м²</dd></div>' +
      '<div><dt>Вместимость</dt><dd>до ' +
      escapeHtml(room.capacity) +
      ' гостей</dd></div>' +
      '<div><dt>Кровати</dt><dd>' +
      escapeHtml(room.beds) +
      '</dd></div>' +
      '</dl>' +
      '<p class="room-detail__price">' +
      escapeHtml(room.price) +
      '</p>' +
      '<ul class="room-detail__features">' +
      renderFeatures(room.features) +
      '</ul>' +
      '<button type="button" class="btn-primary room-detail__book" data-room-book="' +
      escapeHtml(room.id) +
      '">Забронировать этот номер</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>';

    bindGallery(root);
  };
})();
