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

  legal: {
    /** Управление физлицом, без ИНН/ОГРН на сайте */
    operatorType: 'individual',
    displayName: 'Гостевой дом «Абрикос»',
    address: 'Россия, Ейск, ул. Советов, д. 12',
    inn: null,
    ogrn: null,
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
};
