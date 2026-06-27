# SPEC — source of truth

**Статус:** актуально после перехода на MPA (Sprint 0.1 закрыт).

## 1) Проект и приоритет источников

- Проект: сайт гостевого дома «Абрикос», Ейск, ул. Советов, д. 12.
- Production-домен: `https://abrikos-yeisk.ru`.
- Оператор: физическое лицо (ИНН/ОГРН на сайте не публикуются).
- Архитектура: многостраничный статический сайт (MPA) на vanilla HTML + CSS + JS.

### 1.1 Приоритет источников

1. `docs/SPEC.md`.
2. Документы `docs/` и `README.md`.
3. Правила в `.cursor/rules/*.mdc` и `AGENTS.md`.
4. `prototype/` и `prototype/guidelines/HANDOFF.md` только как референс визуала/UX.

## 2) Технологии, ветки и архитектура

### 2.1 Технический стек

- HTML5, CSS3, vanilla JS (без React/Vite/сборки для production).
- Навигация через физические страницы и обычные `<a href>`.
- Развертывание как статика на Masterhost.

### 2.2 Git-модель и деплой

- `develop` — разработка (полный репозиторий).
- `main` — production-only (только публичный сайт).
- Детали: `docs/BRANCHES.md`.

### 2.3 Что уходит на production

```text
index.html
404.html
.htaccess
robots.txt
sitemap.xml
rooms/index.html
rooms/1/index.html
rooms/2/index.html
rooms/3/index.html
rooms/4/index.html
rooms/5/index.html
rooms/6/index.html
rooms/apartments/index.html
price/index.html
privacy/index.html
css/
js/
img/
```

Не попадает в production: `prototype/`, `docs/`, `.cursor/`, `tests/`, dev-артефакты.

### 2.4 Архитектура рендера

| Слой | Файлы | Роль |
|------|-------|------|
| Страницы | `index.html`, `rooms/**`, `price/index.html`, `privacy/index.html`, `404.html` | Статический контент маршрутов |
| Shell-поведение | `js/header.js` | Drawer, phone dropdown, CTA, логотип/скролл |
| Навигация и бронирование | `js/navigation.js`, `js/booking.js` | Переход на главную к виджету с `?room=` и `#booking-widget` |
| Интерактив деталей | `js/gallery.js` | Галерея на `/rooms/:id` |
| Интеграции | `js/analytics.js`, `js/cookies.js` | Consent и Метрика |
| Конфиг | `js/config.js` | Контакты, соцсети, IDs интеграций |

Удалено из runtime: `js/router.js`, `js/render*.js`, `js/shell.js`, `js/data.js`.

### 2.5 Маршруты (URL → файл)

- `/` → `index.html`
- `/rooms` → `rooms/index.html`
- `/rooms/1` → `rooms/1/index.html`
- `/rooms/2` → `rooms/2/index.html`
- `/rooms/3` → `rooms/3/index.html`
- `/rooms/4` → `rooms/4/index.html`
- `/rooms/5` → `rooms/5/index.html`
- `/rooms/6` → `rooms/6/index.html`
- `/rooms/apartments` → `rooms/apartments/index.html`
- `/price` → `price/index.html`
- `/privacy` → `privacy/index.html`
- Неизвестный путь → `404.html` (через `.htaccess`)

## 3) Данные и контент

### 3.1 Конфиг (`js/config.js`)

Обязательные поля:

- `siteName`, `siteTagline`, `siteUrl`;
- `phones[]`, `email`, `social`;
- `legal`;
- `yandexMetrikaId`, `metrikaRequiresConsent`;
- `agastIframeSrc`, `agastHotelId`.

### 3.2 Контент страниц

- Контент страниц хранится в HTML-файлах.
- JS не используется как основной рендер страниц.
- Маркетинговая формулировка «8 номеров» допустима при 7 категориях размещения.

## 4) UI/UX требования

### 4.1 Общие

- Шрифт: Inter.
- Токены: `css/tokens.css`.
- CTA «Забронировать»: фон `#FBBF24`, текст `#0F2A5C`.
- Mobile-first без тяжелых анимаций.

### 4.2 Обязательные блоки

- Header + drawer + footer + cookie banner на всех страницах.
- Главная: page header, 4 блока, CTA-баннер, `#booking-widget`.
- `/rooms`: карточки категорий.
- `/rooms/:id`: галерея, характеристики, CTA.
- `/price`: контрактная структура с `PENDING_CONTENT`.
- `/privacy`: политика ПД.

### 4.3 Поведение логотипа

| Где клик | Поведение |
|----------|-----------|
| На `/` | Плавный скролл вверх |
| На других страницах | Переход на `/` |

## 5) Контракт `/price`

1. Заголовок страницы.
2. Блок про сезонность/актуальность.
3. Таблица тарифов.
4. Что включено.
5. Доп. условия.
6. CTA к бронированию.

## 6) Медиа

- Логотип и favicon: `img/logo.png` (header, вкладка, Apple Touch Icon). Архив старого favicon: `img/archive/favicon.svg`.
- Карта файлов: `docs/MEDIA.md`.
- Основной формат фото: WebP (AVIF опционально).
- Соотношение: `4:3`.

## 7) Интеграции

### 7.1 Яндекс.Метрика

Цели:

- `header_book_click`
- `room_book_click`
- `phone_click`
- `cookie_accept`

Требования:

- До consent события не отправлять при `metrikaRequiresConsent = true`.
- Pageview отправляется при загрузке страницы.

### 7.2 Agast

Приоритет:

1. iframe (`agastIframeSrc`)
2. fallback loader (`agastHotelId`)

Сценарии:

- Header CTA: переход на `/#booking-widget`.
- Пономерный CTA: переход на `/?room=<id>#booking-widget`.

## 8) SEO и техтребования

- На каждой странице заданы собственные `title`, `description`, `canonical`.
- `robots.txt` и `sitemap.xml` обязательны.
- `.htaccess` на MPA: `DirectoryIndex` + `ErrorDocument 404 /404.html`, без SPA-fallback.

## 9) Юридический блок и cookies

- `/privacy` обязателен.
- Cookie-banner обязателен (`accepted`/`declined` в `localStorage`).

## 10) Автотесты (Playwright)

```bash
cd tests
npm i
npm test
```

Тестовый контракт: реальные MPA-URL и межстраничная навигация без клиентского роутера.

## 11) Актуальный статус

- Sprint 0: закрыт.
- Sprint 0.1 (MPA + docs): закрыт.
- Sprint 1: функциональная база закрыта на MPA.
- Sprint 2/3/4/5: в очереди по roadmap.
