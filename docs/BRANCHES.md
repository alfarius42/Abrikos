# Ветки и деплой

## develop — разработка

- Основная рабочая ветка
- Полное содержимое репозитория: production-сайт, `prototype/`, `docs/`, правила Cursor
- Деплой dev/staging: всё из ветки, **кроме секретов** (см. `.gitignore`: `.env`, `.env.local` и т.п.)
- На сервер не выкладывать: `node_modules/`, `prototype/node_modules/`, `prototype/dist/`

## main — production

- Только публичный сайт, без dev-артефактов
- Допустимые пути:

```
index.html
.htaccess
robots.txt
css/
js/
img/
```

- Не должно быть: `prototype/`, `docs/`, `.cursor/`, `AGENTS.md`, npm-зависимостей

## Поток работы

1. Коммиты разработки — в `develop`
2. Перед релизом — синхронизация production-файлов в `main`
3. Деплой на **abrikos-yeisk.ru** — только с `main`

## Секреты

- Реальные ID Яндекс.Метрики, agast и прочие ключи — только локально или в `.env` (не в git)
- В репозитории — placeholder в `js/config.js`
