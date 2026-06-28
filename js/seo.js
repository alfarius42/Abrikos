/**
 * Breadcrumbs + JSON-LD structured data.
 * Requires <body data-page="…"> and optional #breadcrumbs-root after .page-header.
 */
(function () {
  var HOME = { label: 'Главная', path: '/' };

  var PAGES = {
    home: { crumbs: [] },
    rooms: { crumbs: [{ label: 'Наши номера', path: '/rooms' }] },
    territory: { crumbs: [{ label: 'Наша территория', path: '/territory' }] },
    price: { crumbs: [{ label: 'Прайс-лист', path: '/price' }] },
    privacy: { crumbs: [{ label: 'Политика ПД', path: '/privacy' }] },
    'room-1': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 1', path: '/rooms/1' },
      ],
      room: { name: 'Номер 1', path: '/rooms/1', area: 18, guests: 2 },
    },
    'room-2': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 2', path: '/rooms/2' },
      ],
      room: { name: 'Номер 2', path: '/rooms/2', area: 18, guests: 2 },
    },
    'room-3': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 3', path: '/rooms/3' },
      ],
      room: { name: 'Номер 3', path: '/rooms/3', area: 24, guests: 4 },
    },
    'room-4': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 4', path: '/rooms/4' },
      ],
      room: { name: 'Номер 4', path: '/rooms/4', area: 18, guests: 3 },
    },
    'room-5': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 5', path: '/rooms/5' },
      ],
      room: { name: 'Номер 5', path: '/rooms/5', area: 18, guests: 2 },
    },
    'room-6': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Номер 6', path: '/rooms/6' },
      ],
      room: { name: 'Номер 6', path: '/rooms/6', area: 18, guests: 2 },
    },
    'room-apartments': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Апартаменты', path: '/rooms/apartments' },
      ],
      room: { name: 'Апартаменты', path: '/rooms/apartments', area: 20, guests: 8 },
    },
    'room-kuban-house': {
      crumbs: [
        { label: 'Наши номера', path: '/rooms' },
        { label: 'Кубанский дом', path: '/rooms/kuban-house' },
      ],
      room: { name: 'Кубанский дом', path: '/rooms/kuban-house', area: 36, guests: 6 },
    },
  };

  function getConfig() {
    return window.SITE_CONFIG || {};
  }

  function absUrl(path) {
    var base = getConfig().siteUrl || 'https://abrikos-yeisk.ru';
    return base.replace(/\/$/, '') + path;
  }

  function injectJsonLd(data) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function buildBreadcrumbList(crumbs) {
    var items = [{ label: HOME.label, path: HOME.path }].concat(crumbs);
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map(function (item, index) {
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: absUrl(item.path),
        };
      }),
    };
  }

  function buildLodgingBusiness() {
    var cfg = getConfig();
    var legal = cfg.legal || {};
    var loc = cfg.location || {};
    var social = cfg.social || {};
    var sameAs = [];
    if (social.vk) sameAs.push(social.vk);
    if (social.telegram) sameAs.push(social.telegram);

    return {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: cfg.siteName || 'Гостевой дом «Абрикос»',
      description:
        document.querySelector('meta[name="description"]') &&
        document.querySelector('meta[name="description"]').getAttribute('content'),
      url: absUrl('/'),
      image: absUrl((cfg.seo && cfg.seo.ogImage) || '/img/hero.webp'),
      telephone: cfg.phones && cfg.phones[0] ? cfg.phones[0].href.replace('tel:', '') : undefined,
      email: cfg.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Советов, д. 12',
        addressLocality: 'Ейск',
        addressRegion: 'Краснодарский край',
        addressCountry: 'RU',
      },
      geo: loc.lat
        ? {
            '@type': 'GeoCoordinates',
            latitude: loc.lat,
            longitude: loc.lng,
          }
        : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    };
  }

  function buildHotelRoom(room) {
    var cfg = getConfig();
    return {
      '@context': 'https://schema.org',
      '@type': 'HotelRoom',
      name: room.name,
      url: absUrl(room.path),
      containedInPlace: {
        '@type': 'LodgingBusiness',
        name: cfg.siteName || 'Гостевой дом «Абрикос»',
        url: absUrl('/'),
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: room.area,
        unitCode: 'MTK',
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: room.guests,
      },
    };
  }

  function renderBreadcrumbs(crumbs) {
    var root = document.getElementById('breadcrumbs-root');
    if (!root || !crumbs.length) return;

    var nav = document.createElement('nav');
    nav.className = 'breadcrumbs';
    nav.setAttribute('aria-label', 'Хлебные крошки');

    var list = document.createElement('ol');
    list.className = 'breadcrumbs__list';

    var items = [{ label: HOME.label, path: HOME.path }].concat(crumbs);

    items.forEach(function (item, index) {
      var li = document.createElement('li');
      li.className = 'breadcrumbs__item';

      if (index === items.length - 1) {
        var current = document.createElement('span');
        current.className = 'breadcrumbs__current';
        current.setAttribute('aria-current', 'page');
        current.textContent = item.label;
        li.appendChild(current);
      } else {
        var link = document.createElement('a');
        link.className = 'breadcrumbs__link';
        link.href = item.path;
        link.textContent = item.label;
        li.appendChild(link);
      }

      list.appendChild(li);
    });

    nav.appendChild(list);
    root.appendChild(nav);
  }

  function init() {
    var pageId = document.body.getAttribute('data-page');
    if (!pageId) return;

    var page = PAGES[pageId];
    if (!page) return;

    if (page.crumbs && page.crumbs.length) {
      renderBreadcrumbs(page.crumbs);
      injectJsonLd(buildBreadcrumbList(page.crumbs));
    }

    if (pageId === 'home') {
      injectJsonLd(buildLodgingBusiness());
    }

    if (page.room) {
      injectJsonLd(buildHotelRoom(page.room));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
