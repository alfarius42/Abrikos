# SPRINTS — roadmap и контроль выполнения

Связан с `docs/SPEC.md`, отражает фактический статус MPA-проекта.

## Статус спринтов (summary)

| Спринт | Название | Статус |
|--------|----------|--------|
| 0 | Документация и подготовка | Закрыт |
| 0.1 | Миграция на MPA + синхронизация docs | Закрыт |
| 1 | Верстка и базовая логика | Закрыт |
| 2 | Яндекс.Метрика | Ожидает данных |
| 3 | Agast интеграция | Ожидает данных |
| 4 | Тестирование и стабилизация | В работе |
| 5 | Релиз и деплой | Ожидает |

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

### 1.2 Главная

- [x] Page header.
- [x] 4 шахматных блока.
- [x] CTA-баннер.
- [x] `#booking-widget` и `#agast-widget-container`.

### 1.3 `/rooms`

- [x] 7 карточек категорий.
- [x] Площадь, цена, переходы в деталки.
- [x] CTA бронирования категории.

### 1.4 `/rooms/:id`

- [x] Все 7 детальных страниц (`1..6`, `apartments`).
- [x] Галерея thumbs/main.
- [x] Характеристики и оснащение.
- [x] CTA бронирования категории.

### 1.5 `/price`

- [x] Структура страницы по контракту.
- [x] Таблица категорий.
- [x] Маркер `PENDING_CONTENT` для финальных тарифов.

### 1.6 `/privacy` + cookies

- [x] Политика ПД.
- [x] Cookie-banner с сохранением consent.

---

## Sprint 2 — Яндекс.Метрика

**Статус:** ожидает `yandexMetrikaId`.

- [ ] Заполнить ID в `js/config.js`.
- [ ] Проверить pageview и цели: `header_book_click`, `room_book_click`, `phone_click`, `cookie_accept`.
- [ ] Проверить, что до consent события не уходят при `metrikaRequiresConsent = true`.

---

## Sprint 3 — Agast

**Статус:** ожидает данных Agast.

- [ ] Подключить iframe (`agastIframeSrc`) или fallback (`agastHotelId`).
- [ ] Привязать room IDs при необходимости.
- [ ] Проверить сценарий CTA бронирования на всех страницах.
- [ ] Проверить мобильный/десктопный рендер виджета.

---

## Sprint 4 — Тестирование и стабилизация

**Статус:** в работе.

### Автотесты (Playwright)

Текущие файлы:

- `tests/e2e/header-footer.spec.js`
- `tests/e2e/home.spec.js`
- `tests/e2e/rooms.spec.js`
- `tests/e2e/privacy-cookies.spec.js`
- `tests/e2e/routing.spec.js`

План:

- [ ] Расширить проверку `/404` и SEO-мета.
- [ ] Добавить детальные проверки для `/rooms/:id` (галерея/характеристики).
- [ ] Добавить smoke по `/price` и бронированию с query/hash.

### Ручной QA перед релизом

- [ ] URL: `/`, `/rooms`, `/rooms/:id`, `/price`, `/privacy`, `404`.
- [ ] Адаптивность (iOS Safari, Android Chrome).
- [ ] SEO: `title`, `canonical`, `robots`, `sitemap`.
- [ ] Smoke Метрики и Agast.

---

## Sprint 5 — Релиз и деплой

**Статус:** ожидает.

1. Закрыть Sprint 2-4 на `develop`.
2. Синхронизировать production-файлы в `main`.
3. Деплой на Masterhost.
4. Постдеплой smoke-check.

---

## Backlog (`PENDING` от заказчика)

- Финальная тарифная таблица для `/price`.
- `yandexMetrikaId`.
- Параметры Agast (`agastIframeSrc` и/или `agastHotelId`).
- Финальные фото в fixed naming.
