# SPEC — source of truth

**Статус:** актуализировано на Sprint 1 (частично), с пометками `PENDING` для данных заказчика и интеграций.

## 1) Проект и приоритет источников

- Проект: сайт гостевого дома «Абрикос», Ейск, ул. Советов, д. 12.
- Production-домен: `https://abrikos-yeisk.ru`.
- Оператор: физическое лицо (ИНН/ОГРН на сайте не публикуются).
- Текущая архитектура: статический сайт на vanilla HTML + CSS + JS.

### 1.1 Приоритет источников

1. Этот документ (`docs/SPEC.md`).
2. Документы проекта в `docs/` и `README.md`.
3. Правила разработки (`.cursor/rules/*.mdc`, `AGENTS.md`) как исполняемые ограничения.
4. `prototype/` и `prototype/guidelines/HANDOFF.md` только как референс визуала/UX, без копирования кода.

При противоречии приоритет всегда выше у `SPEC.md`.

## 2) Технологии, ветки и архитектура

### 2.1 Технический стек

- HTML5, CSS3, vanilla JS (без React/Vite/сборки для production).
- Клиентская навигация через History API (`pushState`, `popstate`).
- Развертывание как статика на Masterhost.

### 2.2 Git-модель и деплой

- Ветка разработки: `develop` (полный репозиторий).
- Production-ветка: `main` (только публичный сайт).
- Подробности: `docs/BRANCHES.md`.

### 2.3 Что уходит на production

В production (`main`) должны быть только:

```text
index.html
.htaccess
robots.txt
sitemap.xml   ← PENDING (добавить перед релизом)
css/
js/
img/
```

На production не попадают: `prototype/`, `docs/`, `.cursor/`, `tests/`, dev-артефакты.

### 2.4 Архитектура рендера

Текущая версия использует единый `index.html` и клиентский рендер в `#app-main`:

| Слой | Файл(ы) | Роль |
|------|---------|------|
| Shell-разметка | `js/shell.js` | Header, drawer, footer |
| Shell-поведение | `js/header.js` | Меню, scroll, CTA, телефоны |
| Роутинг | `js/router.js` | Матчинг URL, рендер, meta/title, routechange |
| Страницы | `js/render.js` + `js/render-*.js` | Фасад рендера и модульные рендереры home/rooms/room/price/privacy |
| Бронирование | `js/booking.js` | Пономерный сценарий бронирования (заглушка до Sprint 3) |
| Интеграции | `js/analytics.js`, `js/cookies.js` | Consent и Метрика |
| Данные | `js/config.js`, `js/data.js` | Конфиг и контент |

### 2.5 Маршруты

- `/` — главная.
- `/rooms` — разводящая номеров.
- `/rooms/:id` — детальная (`1..6`, `apartments`).
- `/price` — прайс (контрактная страница, контент частично `PENDING`).
- `/privacy` — политика ПД.

## 3) Данные и контент

### 3.1 Конфиг (`js/config.js`)

Минимальный обязательный набор:

- `siteName`, `siteTagline`, `siteUrl`.
- `logo.src` (текущий формат: `img/logo.png`), `logo.alt`.
- `phones[]`, `email`, `social`.
- `legal` (оператор как физлицо, без обязательной публикации ИНН/ОГРН).
- `yandexMetrikaId` (`PENDING`), `metrikaRequiresConsent`.
- `agastIframeSrc`/`agastHotelId` (`PENDING`).

### 3.2 Данные страниц (`js/data.js`)

- `home`, `homeCta`, `homeBlocks`.
- `rooms[]` — 7 категорий размещения (`1..6`, `apartments`).

`rooms[]` обязательные поля:

- `id`, `name`, `tagline`, `description`.
- `area`, `capacity`, `beds`.
- `features[]`, `price`.
- `imageUrl`, `gallery[]`.
- `agastRoomId` (`PENDING` до данных Agast).

Примечание по контенту: в маркетинговых текстах допустима формулировка «8 номеров», при этом в данных рендера используется 7 категорий размещения.

## 4) UI/UX требования

### 4.1 Общие

- Шрифт: Inter.
- Токены только через `css/tokens.css`.
- CTA «Забронировать»: фон `#FBBF24`, текст `#0F2A5C`.
- Mobile-first без тяжелых анимаций.

### 4.2 Обязательные блоки

- Shell: header + drawer + footer.
- Главная: page header, 4 блока, CTA-баннер, `#booking-widget`.
- `/rooms`: сетка карточек, площадь, цена, CTA в деталку и бронирование.
- `/rooms/:id`: галерея, характеристики, оснащение, CTA.
- `/price`: структура страницы по контракту (ниже).
- `/privacy`: политика ПД + cookie banner.

### 4.3 Поведение логотипа

| Где клик | Поведение |
|----------|-----------|
| На `/` | Плавный скролл в верх страницы |
| На другом маршруте | Переход на `/`, затем скролл в верх |

Логотип не заменяет CTA бронирования.

## 5) Контракт `/price`

### 5.1 Минимальная структура

1. Заголовок страницы.
2. Блок про сезонность/актуальность.
3. Таблица тарифов.
4. Что включено в стоимость.
5. Доп. условия/услуги.
6. CTA к бронированию.

### 5.2 Таблица (данные `PENDING`)

Колонки:

- Категория.
- Период/сезон.
- Цена за ночь.
- Минимальный срок (если есть).
- Примечание.

## 6) Медиа и fixed naming

- Логотип: `img/logo.png`.
- Фото номеров: `img/rooms/`.

Базовые фиксированные имена:

- `home-block-1.webp` ... `home-block-4.webp`.
- `room-1-main.webp` ... `room-apartments-gallery-3.webp`.

Рекомендации:

- Основной формат: WebP (AVIF опционально).
- Соотношение сторон: `4:3`.
- Master-ширина: около 1600px.

## 7) Интеграции

### 7.1 Яндекс.Метрика

Цели:

- `header_book_click`
- `room_book_click`
- `room_view`
- `phone_click`
- `booking_widget_view`
- `cookie_accept`

Требования:

- При `metrikaRequiresConsent = true` не отправлять события до consent.
- Для SPA отправлять `hit` при смене маршрута.

### 7.2 Agast

Приоритет:

1. iframe (`agastIframeSrc`)
2. fallback loader (`agastHotelId`)

Два сценария:

| Сценарий | Откуда | Поведение |
|----------|--------|-----------|
| Общий | Header CTA | Переход на `/` (если нужно) + скролл к `#booking-widget` |
| Пономерный | Карточка/деталка/прайс | То же + контекст выбранной категории |

До Sprint 3 допускается заглушка с `data-pending-room`.

## 8) SEO и техтребования

- Корректные `title` и `canonical` по маршрутам.
- `meta description` и OG-теги допускаются как базовые до расширения per-route.
- `robots.txt` обязателен; `sitemap.xml` — `PENDING`.
- `.htaccess` должен обеспечивать fallback на `index.html` для History API.

## 9) Юридический блок и cookies

- `/privacy` обязателен для оператора-физлица.
- Cookie-banner обязателен:
  - `accepted`/`declined` сохраняются в `localStorage`;
  - метрика инициализируется только по правилам consent.

## 10) Автотесты (Playwright)

- Расположение: `tests/`.
- Покрытие Sprint 1: shell, home, rooms, privacy/cookies.
- Базовый запуск:

```bash
cd tests
npm i
npm test
```

## 11) Актуальный статус

- Sprint 0: закрыт.
- Sprint 1:
  - 1.1 header/footer: закрыт;
  - 1.2 главная: закрыт;
  - 1.3 `/rooms`: закрыт;
  - 1.4 `/rooms/:id`: частично;
  - 1.5 `/price`: в работе;
  - 1.6 privacy/cookies: закрыт.
- Sprint 2/3/4/5: ожидают.
