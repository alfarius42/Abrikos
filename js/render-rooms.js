/**
 * Rooms listing renderer.
 */
(function () {
  window.PageRenderers = window.PageRenderers || {};

  const escapeHtml = window.RenderShared?.escapeHtml;
  const renderPageHeader = window.RenderShared?.renderPageHeader;
  const icons = window.SITE_ICONS || {};

  function renderRoomCard(room) {
    return (
      '<article class="room-card">' +
      '<a class="room-card__media" data-nav href="/rooms/' +
      escapeHtml(room.id) +
      '" tabindex="-1" aria-hidden="true">' +
      '<img src="' +
      escapeHtml(room.imageUrl) +
      '" alt="' +
      escapeHtml(room.name) +
      '" loading="lazy" width="800" height="600" />' +
      '</a>' +
      '<div class="room-card__body">' +
      '<div class="room-card__head">' +
      '<h2 class="room-card__title">' +
      '<a data-nav href="/rooms/' +
      escapeHtml(room.id) +
      '">' +
      escapeHtml(room.name) +
      '</a></h2>' +
      '<span class="room-card__area">' +
      escapeHtml(room.area) +
      ' м²</span>' +
      '</div>' +
      '<p class="room-card__tagline">' +
      escapeHtml(room.tagline) +
      '</p>' +
      '<div class="room-card__meta">' +
      '<p class="room-card__price">' +
      escapeHtml(room.price) +
      '</p>' +
      '<a class="room-card__more" data-nav href="/rooms/' +
      escapeHtml(room.id) +
      '">' +
      'Подробнее ' +
      icons.chevronRight +
      '</a>' +
      '</div>' +
      '<button type="button" class="btn-primary room-card__book" data-room-book="' +
      escapeHtml(room.id) +
      '">Забронировать</button>' +
      '</div></article>'
    );
  }

  window.PageRenderers.rooms = function (root) {
    const rooms = window.SITE_DATA?.rooms || [];
    const cards = rooms.map(renderRoomCard).join('');

    root.innerHTML =
      renderPageHeader(
        'Наши номера',
        'Выберите подходящий вариант размещения — от уютного стандарта до просторных апартаментов.'
      ) +
      '<section class="rooms-page">' +
      '<div class="container">' +
      '<div class="rooms-grid">' +
      cards +
      '</div></div></section>';
  };
})();
