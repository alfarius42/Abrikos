/**
 * Рендер страниц SPA.
 */
(function () {
  const icons = window.SITE_ICONS || {};

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  function renderHomeBlocks() {
    const blocks = window.SITE_DATA?.homeBlocks || [];
    return blocks
      .map(function (block, i) {
        const reversed = i % 2 === 1;
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

  function renderHome(root) {
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
  }

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

  function renderRooms(root) {
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
      renderPageHeader(room.name) +
      '<div class="container" style="padding:40px 16px">' +
      '<p><a data-nav href="/rooms">← Все номера</a></p>' +
      '<p style="margin-top:16px">' +
      escapeHtml(room.description) +
      '</p>' +
      '<p style="margin-top:16px;font-weight:800;color:var(--color-coral)">' +
      escapeHtml(room.price) +
      '</p></div>';
  }

  function getPrivacySections() {
    const cfg = window.SITE_CONFIG || {};
    const legal = cfg.legal || {};
    const phones = (cfg.phones || [])
      .map(function (p) {
        return p.label;
      })
      .join(', ');
    const name = legal.displayName || cfg.siteName || 'Гостевой дом «Абрикос»';
    const address = legal.address || '';
    const email = cfg.email || '';

    return [
      {
        title: '1. Общие положения',
        text:
          'Настоящая политика составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных владельцем ' +
          name +
          ' (далее — Оператор).',
      },
      {
        title: '2. Оператор',
        text:
          name +
          ' (управление физическим лицом). Адрес: ' +
          address +
          '. Телефон: ' +
          phones +
          '. Email: ' +
          email +
          '.',
      },
      {
        title: '3. Цели обработки',
        text:
          'Исполнение договора на оказание услуг размещения; обратная связь с гостем (звонки, e-mail); информирование об акциях (с согласия субъекта); исполнение требований законодательства РФ.',
      },
      {
        title: '4. Перечень данных',
        text:
          'Фамилия, имя, отчество; номер телефона; адрес электронной почты; паспортные данные для оформления проживания согласно требованиям ФМС; данные об оплате (без хранения реквизитов карты).',
      },
      {
        title: '5. Cookies и аналитика',
        text:
          'Сайт использует файлы cookie для улучшения работы и анализа посещаемости. Cookie не содержат персональных данных. Вы вправе отключить cookie в настройках браузера — это может повлиять на работу сайта.',
      },
      {
        title: '6. Права субъекта',
        text:
          'Субъект вправе получать сведения об обработке своих данных, требовать уточнения, блокировки или уничтожения, отзывать согласие, обжаловать действия Оператора в Роскомнадзоре.',
      },
      {
        title: '7. Хранение и защита',
        text:
          'Оператор применяет организационные и технические меры для защиты данных от неправомерного доступа. Срок хранения — не более 3 лет с последнего взаимодействия, если иное не предусмотрено законом.',
      },
      {
        title: '8. Изменения политики',
        text:
          'Оператор вправе вносить изменения. Новая редакция вступает в силу с момента публикации. Действующая редакция: 01.01.2026.',
      },
    ];
  }

  function renderPrivacySectionsHtml() {
    const sections = getPrivacySections();
    return sections
      .map(function (s, i) {
        const divider =
          i < sections.length - 1
            ? '<div class="privacy-section__divider" aria-hidden="true"></div>'
            : '';
        return (
          '<article class="privacy-section">' +
          '<h2 class="privacy-section__title">' +
          escapeHtml(s.title) +
          '</h2>' +
          '<p class="privacy-section__text">' +
          escapeHtml(s.text) +
          '</p>' +
          divider +
          '</article>'
        );
      })
      .join('');
  }

  function renderPrivacy(root) {
    root.innerHTML =
      renderPageHeader('Политика обработки персональных данных') +
      '<section class="privacy-page">' +
      '<div class="container privacy-page__inner">' +
      '<div class="privacy-card">' +
      renderPrivacySectionsHtml() +
      '</div></div></section>';
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
