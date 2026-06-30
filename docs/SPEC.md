# SPEC — source of truth



**Статус:** функциональная база готова (Sprint 0–2 закрыты). До production: Agast, итоговое тестирование, деплой.



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

rooms/kuban-house/index.html

territory/index.html

price/index.html

privacy/index.html

css/

js/

img/

```



Не попадает в production: `prototype/`, `docs/`, `.cursor/`, `tests/`, `scripts/`, dev-артефакты.



### 2.4 Архитектура рендера



| Слой | Файлы | Роль |

|------|-------|------|

| Страницы | `index.html`, `rooms/**`, `territory/index.html`, `price/index.html`, `privacy/index.html`, `404.html` | Статический контент маршрутов |

| Shell-поведение | `js/header.js` | Drawer, phone dropdown, копирование/звонок по tel, CTA, логотип/скролл |

| Навигация и бронирование | `js/navigation.js`, `js/booking.js` | Переход на главную к виджету с `?room=` и `#booking-widget` |

| Интерактив деталей | `js/gallery.js` | Галерея на `/rooms/:id` и `/territory` |

| Карта | `js/map.js` | OpenLayers + OSM на главной, POI из `config.location` |

| Тарифы | `js/prices.js` | Таблица `/price` из Google Sheets с fallback |

| SEO | `js/seo.js` | Хлебные крошки и JSON-LD по `data-page` |

| Bootstrap | `js/bootstrap.js` | Инициализация аналитики после DOM |

| Интеграции | `js/analytics.js`, `js/cookies.js` | Consent и Метрика |

| Конфиг | `js/config.js` | Контакты, соцсети, карта, тарифы, IDs интеграций |



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

- `/rooms/kuban-house` → `rooms/kuban-house/index.html`

- `/territory` → `territory/index.html`

- `/price` → `price/index.html`

- `/privacy` → `privacy/index.html`

- Неизвестный путь → `404.html` (через `.htaccess`)



## 3) Данные и контент



### 3.1 Конфиг (`js/config.js`)



Обязательные поля:



- `siteName`, `siteTagline`, `siteUrl`;

- `seo`, `logo`;

- `phones[]`, `email`, `social`, `nav`;

- `legal`;

- `location` (карта и POI);

- `yandexMetrikaId`, `metrikaRequiresConsent`;

- `agastIframeSrc`, `agastHotelId`;

- `prices` (локальные тарифы для `/price` и карточек номеров);



### 3.2 Контент страниц



- Контент страниц хранится в HTML-файлах.

- JS не используется как основной рендер страниц.

- 8 категорий размещения: номера 1–6, апартаменты, Кубанский дом. Маркетинговая формулировка «8 номеров» соответствует фактическому фонду.



## 4) UI/UX требования



### 4.1 Общие



- Шрифт: Inter.

- Токены: `css/tokens.css`.

- CTA «Забронировать»: фон `#FBBF24`, текст `#0F2A5C`.

- Mobile-first без тяжелых анимаций.



### 4.2 Обязательные блоки



- Header + drawer + footer + cookie banner на всех страницах.

- Главная: page header, 4 блока, карта, CTA-баннер, SEO-блок, `#booking-widget`.

- `/rooms`: карточки 8 категорий.

- `/rooms/:id`: галерея, характеристики, CTA.

- `/territory`: галерея и список удобств.

- `/price`: контрактная структура, таблица тарифов 2026.

- `/privacy`: политика ПД.



### 4.3 Поведение логотипа



| Где клик | Поведение |

|----------|-----------|

| На `/` | Плавный скролл вверх |

| На других страницах | Переход на `/` |



### 4.4 Телефоны (`a[href^="tel:"]`)



| Viewport | Поведение по клику |

|----------|-------------------|

| Desktop (`> 760px`) | Копирование номера в буфер обмена + toast «Номер скопирован: …» |

| Mobile (`≤ 760px`) | Переход в приложение «Телефон» с преднабранным номером (`tel:`) |



- Обработчик в `js/header.js`, без бэкенда.

- Цель Метрики `phone_click` — на всех кликах.

- Ссылки `tel:` в HTML сохраняются для SEO, fallback и мобильных устройств.



### 4.5 Email (`a[href^="mailto:"]`)



| Viewport | Поведение по клику |

|----------|-------------------|

| Mobile (`≤ 760px`) | Переход в почтовый клиент (`mailto:`) |

| Desktop (`> 760px`) | `mailto:` если ОС открывает клиент; иначе копирование адреса + toast «Адрес скопирован: …» |



- Обработчик в `js/header.js` (проверка blur окна для fallback).

- Цель Метрики `email_click` — на всех кликах.



## 5) Контракт `/price`



1. Заголовок страницы.

2. Блок про сезонность/актуальность.

3. Таблица тарифов (локальные данные из `config.js`).

   Порядок `prices.categories[]` задаёт порядок строк в таблице и привязку `bookId` на кнопках бронирования.

4. Что включено.

5. Доп. условия.

6. CTA к бронированию.



## 6) Медиа



- Логотип: `img/logo.webp` (шапка), `img/logo.png` (fallback), favicon: `img/favicon-32.webp`.

- OG-обложка: `img/hero.webp`.

- Карта файлов: `docs/MEDIA.md`.

- Основной формат фото: WebP (AVIF опционально).

- Соотношение: `4:3`.



## 7) Интеграции



### 7.1 Яндекс.Метрика



ID: `88914059` (в `js/config.js`).



Цели:



- `header_book_click`

- `room_book_click`

- `phone_click`

- `cookie_accept`



Требования:



- До consent события не отправлять при `metrikaRequiresConsent = true`.

- Pageview отправляется при загрузке страницы.



### 7.2 Agast



**Статус:** не подключён — `agastIframeSrc` и `agastHotelId` пустые.



Приоритет:



1. iframe (`agastIframeSrc`)

2. fallback loader (`agastHotelId`)



Сценарии:



- Header CTA: переход на `/#booking-widget`.

- Пономерный CTA: переход на `/?room=<id>#booking-widget`.



## 8) SEO и техтребования



- На каждой странице заданы собственные `title`, `description`, `canonical`, OG.

- `js/seo.js` — хлебные крошки и JSON-LD (`LodgingBusiness`, `HotelRoom`).

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

- Sprint 1 (верстка, контент, карта, SEO, медиа): закрыт.

- Sprint 2 (Метрика): закрыт в коде.

- Sprint 3 (Agast): ожидает данных от agast.ru.

- Sprint 4 (итоговое тестирование): ожидает.

- Sprint 5 (деплой): ожидает.

