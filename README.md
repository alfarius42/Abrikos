# Гостевой дом «Абрикос»

Статический сайт **гостевого дома «Абрикос»** (Ейск) с онлайн-бронированием (agast.ru) и Яндекс.Метрикой.

- **Production:** vanilla HTML + CSS + JS (корень репозитория)
- **Прототип:** `prototype/` — React из Figma Make, только референс
- **Спецификация (источник истины):** [docs/SPEC.md](docs/SPEC.md)
- **План работ / спринты:** [docs/SPRINTS.md](docs/SPRINTS.md)
- **Reference-спецификация прототипа:** [prototype/guidelines/HANDOFF.md](prototype/guidelines/HANDOFF.md)
- **Репозиторий:** https://github.com/alfarius42/Abrikos (ветка `main`)

## Приоритет источников

1. [docs/SPEC.md](docs/SPEC.md)
2. `.cursor/rules/*.mdc` и [AGENTS.md](AGENTS.md)
3. `prototype/*` (только референс, не источник production-кода)

## Быстрый старт

```bash
# Просмотр production-сайта (нужен HTTP-сервер для History API)
npx --yes serve .

# Прототип для сверки визуала
cd prototype && npm i && npm run dev
```

## Структура

```
index.html          SPA-оболочка
css/                стили (tokens, layout, components, pages)
js/                 роутер, данные, рендер, аналитика, config
img/rooms/          фото номеров
prototype/          референс (не импортировать в production)
```

## Конфигурация

Заполнить `js/config.js`: телефоны, домен, ID Яндекс.Метрики, URL/код виджета agast.ru.

## Cursor

Правила агента: `.cursor/rules/`, инструкции: [AGENTS.md](AGENTS.md).
