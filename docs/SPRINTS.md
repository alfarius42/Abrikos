# SPRINTS — roadmap и контроль выполнения

Связан с `docs/SPEC.md`, отражает фактический статус MPA-проекта.

## Статус спринтов (summary)

| Спринт | Название | Статус |
|--------|----------|--------|
| 0 | Документация и подготовка | Закрыт |
| 0.1 | Миграция на MPA + синхронизация docs | Закрыт |
| 1 | Верстка и базовая логика | Закрыт |
| 2 | Яндекс.Метрика | Закрыт (код) |
| 3 | Agast интеграция | Ожидает данных |
| 4 | Итоговое тестирование | Ожидает |
| 5 | Релиз и деплой | Ожидает |

**Итого:** функциональная база сайта готова. До production остаются подключение Agast, финальный QA и деплой.

---

## Sprint 0 — Документация и подготовка

**Статус:** закрыт.

- [x] Базовая спецификация и roadmap.
- [x] Git-модель `develop/main`.
- [x] Зафиксированы `PENDING` зависимости заказчика.

---

## Sprint 0.1 — Миграция на MPA и обновление документации

**Статус:** закрыт.

### Выполнено по коду

- [x] Введена MPA-структура страниц:
  - `/index.html`
  - `/rooms/index.html`
  - `/rooms/1..6/index.html`
  - `/rooms/apartments/index.html`
  - `/rooms/kuban-house/index.html`
  - `/territory/index.html`
  - `/price/index.html`
  - `/privacy/index.html`
  - `/404.html`
- [x] Удален SPA runtime (`router`, `render*`, `shell`, `data`).
- [x] Обновлены сценарии CTA бронирования (`/?room=<id>#booking-widget`).
- [x] Обновлены `.htaccess` и `sitemap.xml`.

### Выполнено по документации

- [x] Переписан `docs/SPEC.md` под MPA.
- [x] Обновлен `docs/SPRINTS.md`.
- [x] Синхронизированы `README.md`, `docs/BRANCHES.md`, `AGENTS.md`, `.cursor/rules`.

### Acceptance

- [x] Сайт работает как набор статических HTML.
- [x] Прямой заход на страницы работает без SPA fallback.
- [x] Документация синхронизирована с MPA.
- [x] Тестовый контракт обновлен под MPA.

---

## Sprint 1 — Верстка и базовая логика (MPA baseline)

**Статус:** закрыт.

### 1.1 Header + Footer

- [x] Sticky header, drawer, CTA, телефоны.
- [x] Footer с навигацией, соцссылками и контактами.
- [x] Логотип: на `/` скролл вверх, на других страницах переход на `/`.
- [x] Пункт «Наша территория» в навигации.

### 1.2 Главная

- [x] Page header.
- [x] 4 шахматных блока.
- [x] CTA-баннер.
- [x] `#booking-widget` и `#agast-widget-container`.
- [x] SEO-блок (текст + структурированные данные).
- [x] Интерактивная карта OpenLayers с POI (пляж, парк, дельфинарий, аквапарк, рынок, вокзал).

### 1.3 `/rooms`

- [x] 8 карточек категорий (`1..6`, `apartments`, `kuban-house`).
- [x] Площадь, цена «от …», переходы в деталки.
- [x] CTA бронирования категории.
- [x] Локальные WebP-фото вместо placeholder.

### 1.4 `/rooms/:id`

- [x] Все 8 детальных страниц.
- [x] Галерея thumbs/main.
- [x] Характеристики и оснащение.
- [x] CTA бронирования категории.

### 1.5 `/territory`

- [x] Галерея территории (6 фото).
- [x] Список удобств на территории.

### 1.6 `/price`

- [x] Структура страницы по контракту.
- [x] Таблица категорий с тарифами 2026.
- [x] Загрузка актуальных цен из Google Sheets (`js/prices.js`) с fallback в `config.js`; валидация строк, кэш v2.

### 1.7 `/privacy` + cookies

- [x] Политика ПД.
- [x] Cookie-banner с сохранением consent.

### 1.8 SEO и медиа

- [x] Уникальные `title`, `description`, `canonical`, OG на всех страницах.
- [x] `js/seo.js` — хлебные крошки и JSON-LD.
- [x] `sitemap.xml` со всеми маршрутами.
- [x] Логотип и favicon: `img/logo.webp`, `img/favicon-32.webp`.

---

## Sprint 2 — Яндекс.Метрика

**Статус:** закрыт (код готов, smoke на production — в Sprint 4).

- [x] ID в `js/config.js` (`88914059`).
- [x] Цели: `header_book_click`, `room_book_click`, `phone_click`, `cookie_accept`.
- [x] До consent события не уходят при `metrikaRequiresConsent = true`.
- [x] Pageview при загрузке страницы через `js/bootstrap.js`.

---

## Sprint 3 — Agast

**Статус:** ожидает данных Agast.

- [ ] Подключить iframe (`agastIframeSrc`) или fallback (`agastHotelId`).
- [ ] Привязать room IDs при необходимости.
- [ ] Проверить сценарий CTA бронирования на всех страницах.
- [ ] Проверить мобильный/десктопный рендер виджета.

---

## Sprint 4 — Итоговое тестирование

**Статус:** ожидает.

### Автотесты (Playwright)

Текущие файлы:

- `tests/e2e/header-footer.spec.js`
- `tests/e2e/home.spec.js`
- `tests/e2e/rooms.spec.js`
- `tests/e2e/privacy-cookies.spec.js`
- `tests/e2e/routing.spec.js`

План:

- [ ] Прогнать полный набор e2e на `develop`.
- [ ] Расширить проверку `/404`, `/territory`, `/rooms/kuban-house` и SEO-мета.
- [ ] Smoke по `/price` и бронированию с query/hash.

### Ручной QA перед релизом

- [ ] URL: `/`, `/rooms`, `/rooms/:id`, `/territory`, `/price`, `/privacy`, `404`.
- [ ] Адаптивность (iOS Safari, Android Chrome).
- [x] Телефоны: desktop — копирование в буфер, mobile — `tel:` (см. `docs/SPEC.md` §4.4).
- [ ] SEO: `title`, `canonical`, `robots`, `sitemap`.
- [ ] Smoke Метрики и Agast на production-домене.

---

## Sprint 5 — Релиз и деплой

**Статус:** ожидает.

1. Закрыть Sprint 3–4 на `develop`.
2. Синхронизировать production-файлы в `main`.
3. Деплой на Masterhost.
4. Постдеплой smoke-check.

---

## Backlog (`PENDING` от заказчика)

- Параметры Agast (`agastIframeSrc` и/или `agastHotelId`).
