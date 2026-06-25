# SPRINTS — roadmap и контроль выполнения

Документ ведется в связке с `docs/SPEC.md` и отражает фактический прогресс реализации.

## Статус спринтов (summary)

| Спринт | Название | Статус |
|--------|----------|--------|
| 0 | Документация и подготовка | Закрыт |
| 1 | Верстка и базовая логика | В работе |
| 2 | Яндекс.Метрика | Ожидает данных |
| 3 | Agast интеграция | Ожидает данных |
| 4 | Тестирование и стабилизация | В работе (e2e есть, покрытие расширяется) |
| 5 | Релиз и деплой | Ожидает |

---

## Sprint 0 — Документация и подготовка

**Статус:** закрыт.

- [x] Базовая спецификация и roadmap.
- [x] Модель веток `develop/main`.
- [x] Зафиксированы pending-зависимости заказчика.

---

## Sprint 1 — Верстка с заглушками

**Цель:** собрать production-сайт на текущем контенте с готовностью к подключению Метрики и Agast.

### 1.1 Header + Footer

**Статус:** закрыт.

- [x] sticky header, burger/drawer, CTA, телефоны.
- [x] footer с навигацией и соцссылками.
- [x] клик по логотипу: `/` -> scrollTop, с других страниц -> переход на `/` + scrollTop.

Покрытие: `tests/e2e/header-footer.spec.js`.

### 1.2 Главная

**Статус:** закрыт.

- [x] page header.
- [x] 4 шахматных блока.
- [x] CTA-баннер.
- [x] блок бронирования с `#booking-widget` и `#agast-widget-container`.

Покрытие: `tests/e2e/home.spec.js`.

### 1.3 Разводящая `/rooms`

**Статус:** закрыт.

- [x] сетка карточек из `js/data.js`.
- [x] бейдж площади, цена, переходы в `/rooms/:id`.
- [x] CTA бронирования категории (заглушка до Sprint 3).

Покрытие: `tests/e2e/rooms.spec.js`.

### 1.4 Деталка `/rooms/:id`

**Статус:** частично.

- [x] базовый роут и базовый контент.
- [ ] полноценная галерея main+thumbs.
- [ ] полный блок характеристик и оснащения.
- [ ] CTA бронирования категории как на `/rooms`.

Acceptance (для закрытия подэтапа):

- переключение превью работает;
- отображаются `features/capacity/beds`;
- CTA открывает бронирование выбранной категории (или заглушку Sprint 3).

### 1.5 Страница `/price`

**Статус:** в работе.

- [x] маршрут и навигационные ссылки.
- [ ] рендер страницы по контракту.
- [ ] таблица и условия (`PENDING_CONTENT` до тарифов).

Acceptance:

- `/price` открывается без 404;
- структура соответствует контракту в `SPEC.md`.

### 1.6 Политика ПД + cookies

**Статус:** закрыт.

- [x] страница `/privacy`.
- [x] баннер cookie и сохранение consent.

Покрытие: `tests/e2e/privacy-cookies.spec.js`.

---

## Sprint 2 — Яндекс.Метрика

**Статус:** ожидает `yandexMetrikaId`.

Задачи:

- [ ] заполнить ID в `js/config.js`.
- [ ] проверить `hit` на маршрутах SPA.
- [ ] проверить цели: `header_book_click`, `room_book_click`, `room_view`, `phone_click`, `booking_widget_view`, `cookie_accept`.
- [ ] убедиться, что до consent события не уходят, если `metrikaRequiresConsent = true`.

---

## Sprint 3 — Agast

**Статус:** ожидает данных Agast.

Задачи:

- [ ] подключить iframe (`agastIframeSrc`) или fallback (`agastHotelId`).
- [ ] заполнить `agastRoomId` для 7 категорий.
- [ ] довести `openRoomBooking(roomId)` до рабочего сценария выбора категории.
- [ ] проверить мобильный/десктопный рендер виджета.

---

## Sprint 4 — Тестирование и стабилизация

**Статус:** в работе (есть Playwright-контур).

### Автотесты (Playwright)

Текущие спек-файлы:

- `tests/e2e/header-footer.spec.js`
- `tests/e2e/home.spec.js`
- `tests/e2e/rooms.spec.js`
- `tests/e2e/privacy-cookies.spec.js`

План расширения:

- [ ] `/price`, `notFound`, `popstate/back-forward`.
- [ ] детальная `/rooms/:id` после завершения 1.4.
- [ ] сценарии заглушки/интеграции бронирования с внутренних страниц.

### Ручной QA перед релизом

- [ ] маршруты `/`, `/rooms`, `/rooms/:id`, `/price`, `/privacy`.
- [ ] адаптивность (iOS Safari, Android Chrome).
- [ ] SEO-блок: title/canonical/robots/sitemap.
- [ ] smoke интеграций: Метрика и Agast.

---

## Sprint 5 — Релиз и деплой

**Статус:** ожидает.

Поток:

1. Закрыть Sprint 1-4 на `develop`.
2. Перенести production-файлы в `main`.
3. Запушить `main`.
4. Деплой на Masterhost.
5. Постдеплой smoke-check.

Acceptance:

- production доступен по `https://abrikos-yeisk.ru`;
- критичных багов P0/P1 нет;
- маршруты и базовые сценарии работают.

---

## Backlog (`PENDING` от заказчика)

- финальная тарифная таблица для `/price`;
- `yandexMetrikaId`;
- параметры Agast (`agastIframeSrc` и/или `agastHotelId`, room ids);
- финальные фото в fixed naming;
- `sitemap.xml` перед production-релизом.
