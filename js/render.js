/**
 * Рендер страниц — заглушка; полная вёрстка по HANDOFF в следующих итерациях.
 */
(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderBookingWidget() {
    const cfg = window.SITE_CONFIG || {};
    if (cfg.agastIframeSrc) {
      return (
        '<section id="booking-widget">' +
        '<div class="container">' +
        '<h2>Онлайн-бронирование</h2>' +
        '<p>Выберите даты и номер — подтвердим бронирование в течение часа.</p>' +
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
      '<h2>Онлайн-бронирование</h2>' +
      '<div id="agast-widget-container">' +
      '<div class="agast-placeholder">' +
      '<p><strong>Виджет agast.ru</strong></p>' +
      '<p>Укажите <code>agastIframeSrc</code> в js/config.js</p>' +
      '</div></div></div></section>'
    );
  }

  function renderHome(root) {
    root.innerHTML =
      '<div class="page-header container">' +
      '<h1>Мини-отель «Абрикос»</h1>' +
      '<p style="color:rgba(255,255,255,0.72);margin-top:10px">Уютный отдых на берегу Азовского моря в Ейске.</p>' +
      '</div>' +
      '<p class="container" style="padding:48px 16px">Главная страница — в разработке. См. прототип и HANDOFF.md.</p>' +
      renderBookingWidget();
  }

  function renderRooms(root) {
    const rooms = window.SITE_DATA?.rooms || [];
    const cards = rooms
      .map(function (room) {
        return (
          '<article class="room-card">' +
          '<a data-nav href="/rooms/' +
          escapeHtml(room.id) +
          '">' +
          '<h2>' +
          escapeHtml(room.name) +
          '</h2>' +
          '<p>' +
          escapeHtml(room.price) +
          '</p></a></article>'
        );
      })
      .join('');

    root.innerHTML =
      '<div class="page-header container"><h1>Наши номера</h1></div>' +
      '<section class="container" style="padding:52px 16px;display:grid;gap:22px">' +
      cards +
      '</section>';
  }

  function renderRoomDetail(id, root) {
    const room = (window.SITE_DATA?.rooms || []).find(function (r) {
      return r.id === id;
    });

    if (!room) {
      root.innerHTML =
        '<p class="container" style="padding-top:120px">Номер не найден. <a data-nav href="/rooms">Все номера</a></p>';
      return;
    }

    root.innerHTML =
      '<div class="page-header container"><h1>' +
      escapeHtml(room.name) +
      '</h1></div>' +
      '<div class="container" style="padding:40px 16px">' +
      '<p><a data-nav href="/rooms">← Все номера</a></p>' +
      '<p style="margin-top:16px">' +
      escapeHtml(room.description) +
      '</p>' +
      '<p style="margin-top:16px;font-weight:800;color:var(--color-coral)">' +
      escapeHtml(room.price) +
      '</p></div>';
  }

  function renderPrivacy(root) {
    root.innerHTML =
      '<div class="page-header container"><h1>Политика обработки персональных данных</h1></div>' +
      '<section class="container" style="padding:48px 16px">' +
      '<p>Текст политики — см. прототип PrivacyPage и HANDOFF §9.</p>' +
      '</section>';
  }

  window.renderPage = function (route, root) {
    switch (route.name) {
      case 'home':
        renderHome(root);
        break;
      case 'rooms':
        renderRooms(root);
        break;
      case 'room':
        renderRoomDetail(route.id, root);
        break;
      case 'privacy':
        renderPrivacy(root);
        break;
      default:
        root.innerHTML =
          '<p class="container" style="padding-top:120px">Страница не найдена. <a data-nav href="/">На главную</a></p>';
    }
  };
})();
