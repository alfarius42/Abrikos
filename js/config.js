/**
 * Конфигурация сайта.
 * @see prototype/guidelines/HANDOFF.md
 */
window.SITE_CONFIG = {
  siteName: 'Гостевой дом «Абрикос»',
  siteNameShort: 'Абрикос',
  siteTagline: 'Ейск',
  siteUrl: 'https://abrikos-yeisk.ru',

  logo: {
    src: '/img/logo.png',
    alt: 'Гостевой дом «Абрикос», Ейск',
  },

  phones: [
    { label: '8 963 755 10 55', href: 'tel:+79637551055' },
    { label: '8 905 705 26 57', href: 'tel:+79057052657' },
  ],

  email: 'savin@rosevent.ru',

  social: {
    vk: 'https://vk.com/abrikos_yeisk_hotel',
    telegram: 'https://t.me/abrikos_yeisk_hotel',
    max: 'https://max.ru/join/PcwYNn-KgjZOx5ikMEHi51jpMbY4C7YYBMmuiKVkWuE',
  },

  nav: [
    { label: 'Главная', href: '/' },
    { label: 'Наши номера', href: '/rooms' },
    { label: 'Прайс-лист', href: '/price' },
    { label: 'Политика ПД', href: '/privacy' },
  ],

  legal: {
    /** Управление физлицом, без ИНН/ОГРН на сайте */
    operatorType: 'individual',
    operatorName: 'Савин Александр Сергеевич',
    displayName: 'Гостевой дом «Абрикос»',
    address: 'Россия, Ейск, ул. Советов, д. 12',
    inn: null,
    ogrn: null,
  },

  /** Карта на главной — Leaflet + OpenStreetMap, без API-ключа */
  location: {
    address: 'Россия, Ейск, ул. Советов, д. 12',
    lat: 46.7194089,
    lng: 38.2660818,
    zoom: 15,
    mapLabel: '«Абрикос»',
    hint: '10 минут пешком до Азовского моря',
    /**
     * POI — координаты сверены с OpenStreetMap (2026-06).
     * mapLabel — короткая подпись на плашке карты.
     */
    pois: [
      {
        id: 'beach-kamenka',
        title: 'Пляж «Каменка»',
        mapLabel: 'Пляж «Каменка»',
        subtitle: 'Приморская набережная',
        hint: '~10 мин пешком',
        lat: 46.7188984,
        lng: 38.2612575,
      },
      {
        id: 'primorsky-park',
        title: 'Приморский парк',
        mapLabel: 'Приморский парк',
        subtitle: 'Приморская набережная',
        hint: '~12 мин пешком',
        lat: 46.7166927,
        lng: 38.2599685,
      },
      {
        id: 'dolphinarium',
        title: 'Дельфинарий',
        mapLabel: 'Дельфинарий',
        subtitle: 'ул. Шмидта, 16/1',
        hint: '~15 мин пешком',
        lat: 46.7157929,
        lng: 38.2590893,
      },
      {
        id: 'aquapark-nemo',
        title: 'Аквапарк «НЕМО»',
        mapLabel: 'Аквапарк «НЕМО»',
        subtitle: 'ул. Шмидта, 6',
        hint: '~5 мин пешком',
        lat: 46.7212239,
        lng: 38.2652253,
      },
      {
        id: 'central-market',
        title: 'Центральный рынок',
        mapLabel: 'Центр. рынок',
        subtitle: 'ул. Энгельса',
        hint: '~12 мин пешком',
        lat: 46.7101202,
        lng: 38.2769389,
      },
      {
        id: 'railway-station',
        title: 'Ж/д вокзал «Ейск»',
        mapLabel: 'Ж/д вокзал',
        subtitle: 'Привокзальная площадь',
        hint: '~15 мин пешком',
        lat: 46.7163729,
        lng: 38.2829184,
      },
    ],
  },

  /** Яндекс.Метрика — пустая строка = не инициализировать */
  yandexMetrikaId: '',

  /** Загружать Метрику только после принятия cookie */
  metrikaRequiresConsent: true,

  /**
   * agast.ru — iframe из ЛК или loader.js.
   * Указать src iframe или hotel ID когда будет от agast.
   */
  agastIframeSrc: '',
  agastHotelId: '',

  /**
   * Яндекс.Карты — iframe embed или статичный скрин.
   * embed: код «Поделиться → HTML» из конструктора карт Яндекса.
   * image: путь к скриншоту, например /img/map.webp
   */
  yandexMapEmbedSrc: '',
  yandexMapImageSrc: '',

  /**
   * Тарифы 2026 — источник: «Стоимость номеров Ейск 26.xlsx»
   * Цены за ночь (₽) по месяцам; priceFrom — минимум для карточек «от … ₽/ночь»
   */
  prices: {
    year: 2026,
    months: ['Май', 'Июнь', 'Июль', 'Август', 'Сентябрь'],
    categories: [
      { bookId: '1', name: 'Номер 1', rates: [3000, 5000, 5500, 5500, 3000], priceFrom: 3000 },
      { bookId: '2', name: 'Номер 2', rates: [3000, 5000, 5500, 5500, 3000], priceFrom: 3000 },
      { bookId: '3', name: 'Номер 3', rates: [3500, 5500, 6000, 6000, 3500], priceFrom: 3500 },
      { bookId: '4', name: 'Номер 4', rates: [3000, 5000, 5500, 5500, 3000], priceFrom: 3000 },
      { bookId: '5', name: 'Номер 5', rates: [2500, 3500, 4000, 4000, 3000], priceFrom: 2500 },
      { bookId: '6', name: 'Номер 6', rates: [3000, 5000, 5500, 5500, 3000], priceFrom: 3000 },
      { bookId: 'apartments', name: 'Апартаменты', rates: [5900, 7900, 8900, 8900, 5900], priceFrom: 5900 },
      { bookId: null, name: 'Кубанский дом', rates: [4900, 6900, 7900, 7900, 4900], priceFrom: 4900 },
    ],
  },
};
