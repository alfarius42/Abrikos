# Гостевой дом «Абрикос»

Статический сайт гостевого дома «Абрикос» (Ейск) с онлайн-бронированием и аналитикой.

## О проекте

- Production: vanilla HTML + CSS + JS (без React и сборщиков).
- Текущая архитектура: MPA (отдельные HTML-страницы и обычные ссылки).
- Прототип: `prototype/` (только референс, код оттуда в production не копируется).

**Статус:** функциональная база готова. До production — подключение Agast, итоговое тестирование и деплой. Подробнее: [docs/SPRINTS.md](docs/SPRINTS.md).

## Источники и документы

- Спецификация: [docs/SPEC.md](docs/SPEC.md)
- Дорожная карта: [docs/SPRINTS.md](docs/SPRINTS.md)
- Медиа: [docs/MEDIA.md](docs/MEDIA.md)
- Модель веток и деплой: [docs/BRANCHES.md](docs/BRANCHES.md)
- Референс прототипа: [prototype/guidelines/HANDOFF.md](prototype/guidelines/HANDOFF.md)

Приоритет источников:

1. `docs/SPEC.md`
2. Остальные документы в `docs/` и этот README
3. Правила в `.cursor/rules/` и `AGENTS.md`
4. `prototype/*` как визуальный референс

## Ветки и деплой

- `develop` — основная ветка разработки (полный репозиторий).
- `main` — production-only (только публичный сайт).
- Деплой на `abrikos-yeisk.ru` выполняется из `main`.

## Быстрый старт

```bash
# локальный просмотр сайта
npx --yes serve .
```

## Автотесты (Playwright)

```bash
cd tests
npm i
npm test
```

## Структура репозитория

```text
index.html
404.html
rooms/              index + 1..6 + apartments + kuban-house
territory/          index.html
price/              index.html
privacy/            index.html
css/                reset, tokens, layout, components, pages
js/                 config, navigation, header, booking, gallery, map, prices, seo, cookies, analytics, bootstrap, utils
img/                logo, favicon, rooms, territory, map POI
docs/               спецификация и спринты
tests/              Playwright e2e
scripts/            dev-скрипты патча HTML
prototype/          референс из Figma Make
```

## Конфигурация

Ключевые данные задаются в `js/config.js`:

- контакты, соцсети, навигация;
- `siteUrl`, карта и POI (`location`);
- тарифы 2026 (`prices`, `pricesSheet`);
- ID Яндекс.Метрики (`yandexMetrikaId`);
- параметры Agast (`agastIframeSrc`, `agastHotelId`) — **ещё не заполнены**.

## Полезное

- Правила агента: `.cursor/rules/`
- Инструкции для работы с репо: `AGENTS.md`
