/**
 * Конфигурация сайта.
 * @see prototype/guidelines/HANDOFF.md
 */
window.SITE_CONFIG = {
  siteName: 'Гостевой дом «Абрикос»',
  siteNameShort: 'Абрикос',
  siteTagline: 'Ейск',
  siteUrl: 'https://abrikos-yeisk.ru',

  seo: {
    ogImage: '/img/hero.webp',
    locale: 'ru_RU',
  },

  logo: {
    src: '/img/logo.webp',
    headerSrc: '/img/logo-header.webp',
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

  /** Карта на главной — OpenLayers + OpenStreetMap, без API-ключа */
  location: {
    address: 'Россия, Ейск, ул. Советов, д. 12',
    lat: 46.7194089,
    lng: 38.2660818,
    zoom: 15,
    mapLabel: '«Абрикос»',
    mapIcon: '/img/map-marker-house.svg',
    hint: '10 минут пешком до Азовского моря',
    /**
     * POI — координаты сверены с OpenStreetMap (2026-06).
     * icon — маркер на карте; mapLabel — короткая подпись в списке и popup.
     */
    pois: [
      {
        id: 'beach-kamenka',
        title: 'Пляж «Каменка»',
        mapLabel: 'Пляж «Каменка»',
        icon: '/img/map/poi-beach.svg',
        subtitle: 'Приморская набережная',
        hint: '~10 мин пешком',
        lat: 46.7188984,
        lng: 38.2612575,
      },
      {
        id: 'primorsky-park',
        title: 'Приморский парк',
        mapLabel: 'Приморский парк',
        icon: '/img/map/poi-park.svg',
        subtitle: 'Приморская набережная',
        hint: '~12 мин пешком',
        lat: 46.7166927,
        lng: 38.2599685,
      },
      {
        id: 'dolphinarium',
        title: 'Дельфинарий',
        mapLabel: 'Дельфинарий',
        icon: '/img/map/poi-dolphin.svg',
        subtitle: 'ул. Шмидта, 16/1',
        hint: '~15 мин пешком',
        lat: 46.7157929,
        lng: 38.2590893,
      },
      {
        id: 'aquapark-nemo',
        title: 'Аквапарк «НЕМО»',
        mapLabel: 'Аквапарк «НЕМО»',
        icon: '/img/map/poi-aquapark.svg',
        subtitle: 'ул. Шмидта, 6',
        hint: '~5 мин пешком',
        lat: 46.7212239,
        lng: 38.2652253,
      },
      {
        id: 'central-market',
        title: 'Центральный рынок',
        mapLabel: 'Центр. рынок',
        icon: '/img/map/poi-market.svg',
        subtitle: 'ул. Энгельса',
        hint: '~12 мин пешком',
        lat: 46.7101202,
        lng: 38.2769389,
      },
      {
        id: 'railway-station',
        title: 'Ж/д вокзал «Ейск»',
        mapLabel: 'Ж/д вокзал',
        icon: '/img/map/poi-train.svg',
        subtitle: 'Привокзальная площадь',
        hint: '~15 мин пешком',
        lat: 46.7163729,
        lng: 38.2829184,
      },
    ],
  },

  /** Яндекс.Метрика — пустая строка = не инициализировать */
  yandexMetrikaId: '88914059',

  /** Загружать Метрику только после принятия cookie */
  metrikaRequiresConsent: true,

  /**
   * agast.ru — переход по ссылке с кнопки «Забронировать».
   * openMode: link — новая вкладка (рекомендация поддержки); iframe — встраивание (Agast редиректит, в iframe часто «Welcome!»).
   * paramStyle: compact — hms_system_id=6931; spaced — hms_system_id= 6931.
   */
  agastSystemId: 6931,
  agastOpenMode: 'link',
  agastParamStyle: 'compact',

  /**
   * Яндекс.Карты — iframe embed или статичный скрин.
   * embed: код «Поделиться → HTML» из конструктора карт Яндекса.
   * image: путь к скриншоту, например /img/map.webp
   */
  yandexMapEmbedSrc: '',
  yandexMapImageSrc: '',

  /**
   * Google Таблица с тарифами — публичный CSV (gviz), без Google API и бэкенда.
   * Доступ: «Просмотр для всех, у кого есть ссылка» (или шире).
   * spreadsheetRef — base64 ID (не plaintext в config); URL запроса всё равно виден в Network.
   *
   * Раскладка (только эти ячейки): A1 — год; B2:F2 — месяцы; A3:F10 — строки (A название, B… цены).
   */
  pricesSheet: {
    enabled: true,
    spreadsheetRef: 'MXVhX21RcHV5eEZrLTd1MW5ybjg1aFVHZkFJVllPNVc1X3JSXzRrd2F1bzA=',
    gid: 0,
    layout: {
      yearCell: 'A1',
      monthsRange: 'B2:F2',
      dataRange: 'A3:F10',
    },
  },

  /**
   * Fallback до загрузки таблицы. Порядок categories[] = строки dataRange (1-я строка → 1-я категория).
   * bookId — только для кнопки «Забронировать» на деталках; названия и цены берутся из ячеек таблицы.
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
      { bookId: 'kuban-house', name: 'Кубанский дом', rates: [4900, 6900, 7900, 7900, 4900], priceFrom: 4900 },
    ],
  },
};
