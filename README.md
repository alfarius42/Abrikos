# Гостевой дом «Абрикос»

Статический сайт гостевого дома «Абрикос» (Ейск) с онлайн-бронированием и аналитикой.

## О проекте

- Production: vanilla HTML + CSS + JS (без React и сборщиков).
- Текущая архитектура: MPA (отдельные HTML-страницы и обычные ссылки).
- Прототип: `prototype/` (только референс, код оттуда в production не копируется).

## Источники и документы

- Спецификация: [docs/SPEC.md](docs/SPEC.md)
- Дорожная карта: [docs/SPRINTS.md](docs/SPRINTS.md)
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
rooms/              index + 1..6 + apartments
price/              index.html
privacy/            index.html
css/                reset, tokens, layout, components, pages
js/                 config, navigation, header, booking, gallery, cookies, analytics, utils
img/                logo и изображения
docs/               спецификация и спринты
tests/              Playwright e2e
prototype/          референс из Figma Make
```

## Конфигурация

Ключевые данные задаются в `js/config.js`:

- контакты и соцсети;
- `siteUrl`;
- ID Яндекс.Метрики (`yandexMetrikaId`);
- параметры Agast (`agastIframeSrc`, `agastHotelId`).

## Полезное

- Правила агента: `.cursor/rules/`
- Инструкции для работы с репо: `AGENTS.md`
