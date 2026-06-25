# Abrikos — инструкции для AI-агента

## Проект

Статический сайт **гостевого дома «Абрикос»** (Ейск, ул. Советов, д. 12). Оператор — физлицо. Production — **vanilla HTML/CSS/JS** в корне репозитория.

## Перед работой

1. Прочитать `prototype/guidelines/HANDOFF.md` при задачах по UI, роутингу или интеграциям
2. Сверять визуал с `prototype/src/app/App.tsx` — **не копировать код** (см. `.cursor/rules/prototype-reference.mdc`)
3. Константы и placeholder-ID — в `js/config.js`

## Репозиторий

- GitHub: https://github.com/alfarius42/Abrikos
- **develop** — разработка (полный репо, деплой dev/staging без секретов)
- **main** — production-only (сайт без `prototype/` и dev-файлов)
- Подробнее: `docs/BRANCHES.md`
- Коммит и push — только по запросу пользователя

## Локальный просмотр

Статика без сборки. Любой HTTP-сервер из корня, например:

```bash
npx --yes serve .
# или
python -m http.server 8080
```

History API требует сервер (не `file://`).

## Прототип (опционально)

```bash
cd prototype && npm i && npm run dev
```

Только для визуальной сверки; production не зависит от npm.

## Чеклист перед деплоем

См. `prototype/guidelines/HANDOFF.md` §11.
