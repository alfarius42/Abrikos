# SPEC — source of truth

**Статус:** утверждена (кроме блоков с пометкой `PENDING`).

## 1) Проект и приоритет источников

- Проект: сайт гостевого дома «Абрикос», Ейск, ул. Советов, д. 12.
- Домен production: `https://abrikos-yeisk.ru`.
- Оператор: физическое лицо (ИНН/ОГРН на сайте не публикуются).
- Стек: статический SPA на vanilla HTML + CSS + JS, без backend.

### Приоритет источников

1. Этот документ (`docs/SPEC.md`)
2. Текущие project rules (`.cursor/rules/*.mdc`, `AGENTS.md`)
3. Прототип и HANDOFF (`prototype/`) только как референс визуала/UX/контента

Код из `prototype/` в production не копируется.

## 2) Технологии и архитектура

### 2.1 Технический стек

- HTML5, CSS3, vanilla JS (без React/Vite/сборки в production).
- SPA-навигация через History API (`pushState`, `popstate`).
- Развертывание как статического сайта на виртуальном хостинге (masterhost).

### 2.2 Структура репозитория и что уходит на хостинг

Репозиторий — это не «одна папка со всем подряд». Файлы разложены по назначению.

**Весь репозиторий:**

```text
Abrikos/                         ← корень git-репозитория
├── index.html                     ┐
├── css/                           │
├── js/                            ├── production-сайт (заливается на хостинг)
├── img/                           │
├── robots.txt                     │
├── .htaccess                      ┘
├── docs/                          ← документация (только в репо, на сайт не выкладывается)
│   ├── SPEC.md
│   └── SPRINTS.md
├── prototype/                     ← React-референс из Figma Make (не на хостинг)
├── AGENTS.md, README.md           ← для разработки
└── .cursor/                       ← правила Cursor (не на хостинг)
```

**На Masterhost (каталог домена `abrikos-yeisk.ru`) заливается только:**

```text
index.html
css/
js/
img/
robots.txt
sitemap.xml           ← когда будет готов
.htaccess
```

Папки `docs/`, `prototype/`, `.cursor/` на хостинг **не** попадают.

**Состав папок production:**

```text
css/          reset.css, tokens.css, layout.css, components.css, pages.css
js/           config.js, data.js, router.js, render.js, header.js, cookies.js, analytics.js
img/          logo.jfif, rooms/ (фото номеров по fixed naming из §6)
```

### 2.3 Страницы: один HTML, разный контент через JS

**Нет** — отдельные страницы **не** делаются отдельными `.html` файлами (`rooms.html`, `price.html` и т.д.).

Модель — **SPA (Single Page Application)**:

| Что | Как устроено |
|-----|----------------|
| HTML-оболочка | Один файл [`index.html`](../index.html): header, `<main id="app-main">`, footer, cookie-баннер |
| «Страницы» | Виртуальные маршруты в адресной строке (`/`, `/rooms`, `/price`…) |
| Смена контента | [`js/router.js`](../js/router.js) ловит URL → [`js/render.js`](../js/render.js) подставляет разметку в `#app-main` |
| Стили | Общие в `css/layout.css`, `css/components.css`; по страницам — `css/pages.css` |
| Данные | Контакты в `js/config.js`, номера и тексты — `js/data.js` |

```text
Пользователь открывает /rooms
        ↓
router.js определяет маршрут
        ↓
render.js → renderRooms() → HTML внутрь #app-main
        ↓
URL в браузере меняется без перезагрузки (History API)
```

Логическое разделение по «страницам» — в **JS-функциях рендера** (сейчас в одном `render.js`; при росте можно вынести в `js/pages/home.js`, `js/pages/rooms.js` и т.д.), а не в отдельных HTML-файлах.

Для SEO и закладок URL остаются «настоящими» (`/rooms/3`), но физически сервер отдаёт один `index.html` (см. `.htaccess` fallback).

### 2.4 Маршруты

- `/` — главная
- `/rooms` — разводящая номеров
- `/rooms/:id` — детальная номера (`1..6`, `apartments`)
- `/price` — страница прайс-листа (новая, отсутствует в prototype)
- `/privacy` — политика ПД

## 3) Данные и контент

### 3.1 Глобальная конфигурация (`js/config.js`)

Источник бизнес-данных:

- `siteName`: Гостевой дом «Абрикос»
- `siteTagline`: гостевой дом · Ейск
- `siteUrl`: `https://abrikos-yeisk.ru`
- Телефоны: `8 963 755 10 55`, `8 905 705 26 57`
- Email: `savin@rosevent.ru`
- Адрес: `Россия, Ейск, ул. Советов, д. 12`
- Соцсети:
  - VK: `https://vk.com/abrikos_yeisk_hotel`
  - Telegram: `https://t.me/abrikos_yeisk_hotel`
  - Max: `https://max.ru/join/PcwYNn-KgjZOx5ikMEHi51jpMbY4C7YYBMmuiKVkWuE`
- Метрика:
  - `yandexMetrikaId`: pending
  - `metrikaRequiresConsent`: `true`
- Agast:
  - `agastIframeSrc`: pending
  - `agastHotelId`: pending

### 3.2 Контент страниц и номера (`js/data.js`)

- `homeBlocks`: 4 шахматных блока главной.
- `rooms`: 7 категорий размещения (номера `1..6`, `apartments`) с обязательными полями:
  - `id`, `name`, `tagline`, `description`
  - `area`, `capacity`, `beds`
  - `features[]`, `price`
  - `imageUrl`, `gallery[]`
  - `agastRoomId` — идентификатор категории в Agast для бронирования **именно этого** номера (`PENDING` до настройки в ЛК agast)

**Обязательное поведение бронирования по номерам:**

С каждой категории размещения должен быть переход к бронированию **конкретно этого номера** в Agast, а не только в общий виджет без выбора:

| Место на сайте | Действие |
|----------------|----------|
| Карточка на `/rooms` | CTA «Забронировать» (или эквивалент) → бронирование выбранной категории в Agast |
| Детальная `/rooms/:id` | CTA «Забронировать» → та же категория в Agast |
| Строка прайса `/price` | CTA в строке таблицы → бронирование соответствующей категории |

Техническая реализация (после получения кодов от agast):

1. В `js/data.js` у каждой записи `rooms[]` заполнить `agastRoomId`.
2. Общая функция (например `js/booking.js`): `openRoomBooking(roomId)` — формирует URL/параметры iframe или вызывает API виджета agast с `agastRoomId`.
3. Если пользователь не на главной — сначала переход на `/`, затем скролл к `#booking-widget` и инициализация виджета с выбранным номером (аналогично header CTA, но с контекстом `roomId`).
4. Событие Метрики: `room_book_click` с `{ room_id }`.

Формат deep-link / параметров iframe — `PENDING` до документации agast; в `js/config.js` можно держать шаблон `agastBookingBaseUrl` или маппинг `agastRoomIds`.

До загрузки реальных фото допустимы заглушки/временные URL. Рекомендуется заранее согласовать пути к изображениям по fixed naming (§6).

## 4) UI/UX требования

Базовый визуал и поведение — по `prototype/guidelines/HANDOFF.md`, с адаптацией под актуальные реквизиты проекта.

### 4.1 Общие требования

- Шрифт: Inter.
- Цветовые токены: использовать переменные в `css/tokens.css`.
- Основной CTA «Забронировать»: фон `#FBBF24`, текст `#0F2A5C`.
- Mobile-first адаптив, без тяжелых анимаций.

### 4.2 Обязательные блоки страниц

- Header + burger/drawer + телефоны + CTA.
- Footer + навигация + соцсети.
- Главная: page header, 4 контент-блока, CTA-баннер, блок бронирования.
- Разводящая номеров: сетка карточек + CTA бронирования по категории (§3.2).
- Деталка номера: галерея + характеристики + оснащение + CTA бронирования этой категории (§3.2).
- Прайс (`/price`): отдельный шаблон/таблица + CTA по строкам (контракт ниже).
- Privacy (`/privacy`) + cookie banner.

### 4.3 Логотип в header (кликабельный)

Логотип (`img/logo.jfif` + название) — единая кликабельная зона в header и в шапке burger-drawer.

| Текущий маршрут | Поведение по клику |
|-----------------|-------------------|
| Уже главная (`/`) | Без смены URL: прокрутка в **верх видимой области** (`window.scrollTo({ top: 0, behavior: 'smooth' })`). При необходимости — повторный рендер главной, если контент мог быть в промежуточном состоянии. |
| Любая другая страница | Переход на `/` через роутер, затем прокрутка в верх видимой области (не к `#booking-widget`). |

Логотип не открывает бронирование и не дублирует CTA «Забронировать».

## 5) Контракт страницы `/price` (PENDING по данным)

Страница обязательно включается в IA и роутинг, но бизнес-данные цены и правила пока не финализированы.

### 5.1 Минимальный контракт структуры

1. Заголовок страницы (`PageHeader`).
2. Блок «Актуальность цен / сезонность».
3. Основная таблица тарифов.
4. Блок «Что входит в стоимость».
5. Блок «Дополнительные услуги/условия» (если применимо).
6. CTA-кнопка к блоку бронирования (`#booking-widget`).

### 5.2 Контракт таблицы (будет заполнен после данных заказчика)

Обязательные поля таблицы:

- Категория номера
- Период/сезон
- Цена за ночь
- Минимальный срок проживания (если есть)
- Примечание

Статус: `PENDING_CONTENT` до получения тарифной сетки.

## 6) Правила медиа и фиксированный нейминг файлов

### 6.1 Директории

- Логотип: `img/logo.jfif` (уже задан).
- Фото номеров: `img/rooms/`.

### 6.2 Фиксированные имена для загрузки из uploads

Используем именно эти имена, чтобы автоподмена в шаблонах была предсказуемой.

Для главной:

- `home-block-1.webp`
- `home-block-2.webp`
- `home-block-3.webp`
- `home-block-4.webp`

Для карточек/деталок номеров:

- `room-1-main.webp`, `room-1-gallery-1.webp`, `room-1-gallery-2.webp`, `room-1-gallery-3.webp`
- `room-2-main.webp`, `room-2-gallery-1.webp`, `room-2-gallery-2.webp`, `room-2-gallery-3.webp`
- `room-3-main.webp`, `room-3-gallery-1.webp`, `room-3-gallery-2.webp`, `room-3-gallery-3.webp`
- `room-4-main.webp`, `room-4-gallery-1.webp`, `room-4-gallery-2.webp`, `room-4-gallery-3.webp`
- `room-5-main.webp`, `room-5-gallery-1.webp`, `room-5-gallery-2.webp`, `room-5-gallery-3.webp`
- `room-6-main.webp`, `room-6-gallery-1.webp`, `room-6-gallery-2.webp`, `room-6-gallery-3.webp`
- `room-apartments-main.webp`, `room-apartments-gallery-1.webp`, `room-apartments-gallery-2.webp`, `room-apartments-gallery-3.webp`

Рекомендации:

- Формат основной: WebP (допустим AVIF вторым форматом позже).
- Соотношение сторон: `4:3`.
- Ориентир по размеру: 1600px по ширине для master-версии.

## 7) Интеграции

## 7.1 Яндекс.Метрика

Обязательные события:

- `header_book_click`
- `room_book_click` (с `room_id`)
- `room_view` (с `room_id`)
- `phone_click`
- `booking_widget_view`
- `cookie_accept`

Обязательное условие: загрузка метрики только после consent при `metrikaRequiresConsent = true`.

Для SPA обязательны `hit` на смене маршрута.

### 7.2 Agast

Приоритет интеграции:

1. iframe (`agastIframeSrc`)
2. fallback loader.js (`agastHotelId`)

Точка встраивания: контейнер `#agast-widget-container` в секции `#booking-widget`.

**Два сценария бронирования:**

| Сценарий | Источник | Поведение |
|----------|----------|-----------|
| Общий | CTA «Забронировать» в header | Переход на `/` (если нужно) → скролл к `#booking-widget` → виджет без предвыбранного номера |
| По категории | CTA на карточке, деталке, в прайсе (§3.2) | То же, но виджет открывается с `agastRoomId` выбранной категории |

Идентификаторы категорий в Agast хранятся в `rooms[].agastRoomId` (`PENDING`). После подключения — проверить на staging, что каждая из 7 категорий открывает правильный номер в виджете.

## 8) SEO и техтребования

- Корректные `title/description/canonical` для маршрутов.
- `robots.txt` и `sitemap.xml` на production-домен.
- OpenGraph минимум: `og:title`, `og:type`, `og:image` (когда будет финальный ассет).
- SPA fallback на хостинге через `.htaccess`.

## 9) Юридический блок и cookies

- В политике ПД указывать оператора как физлицо.
- ИНН/ОГРН не публиковать.
- Cookie banner обязателен:
  - `accepted` / `declined` сохраняются в `localStorage`.
  - При `accepted` разрешается инициализация метрики.

## 10) Статус документации

- Спецификация **утверждена** для старта Sprint 1 (верстка).
- **Sprint 0 закрыт** (2026-06-25).
- Остаются `PENDING`: тарифная таблица `/price`, ID Метрики, коды Agast и `agastRoomId` по категориям.

## 11) Definition of Done (этап документации)

Этап документации считается завершенным, когда:

1. `docs/SPEC.md` покрывает технологии, контент, роуты, интеграции и правила ассетов.
2. `docs/SPRINTS.md` содержит исполнимую декомпозицию по спринтам.
3. В README есть ссылки на документы и порядок приоритетов.
4. Раздел `/price` явно имеет статус pending-content до предоставления тарифной таблицы.
