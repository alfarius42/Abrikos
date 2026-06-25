# Мини-отель «Абрикос» — Техническое задание на разработку сайта
## Прототип → Production HTML + CSS + JS

---

## 1. Контекст проекта

**Заказчик:** ООО «Комплексные мероприятия»  
**Объект:** Мини-отель «Абрикос», г. Ейск, Краснодарский край  
**Задача:** Разработать сайт-визитку с онлайн-бронированием на чистом HTML + CSS + JS (без фреймворков)  
**Прототип:** React-приложение в данном репозитории (`src/app/App.tsx`)

---

## 2. Цветовая палитра

```
Небо / Основной   #3B82F6  — хэдер, футер, бейджи, заголовки страниц
Небо дневное      #60A5FA  — градиенты, hover-состояния, акценты
Небо бледное      #EBF4FF  — фоны карточек, приглушённые секции
Морской песок     #FFFDF2  — фон страниц, области с текстом
Ейское солнце     #FBBF24  — ВСЕ главные CTA-кнопки («Забронировать»)
Закатный коралл   #EF4444  — цены, важные акценты
Сочная зелень     #10B981  — удобства, природа, теги
Тёмно-синий       #0F2A5C  — основной текст, фон заголовков страниц
Средний синий     #4A6FA5  — второстепенный текст, подписи
Белый             #FFFFFF  — фон карточек, текст на тёмном
```

**Правила применения:**
- Кнопка «Забронировать» **всегда** `#FBBF24` фон + `#0F2A5C` текст, fontWeight 700
- Цена номера — `#EF4444`
- Бейджи площади (18 м²) — `#3B82F6` фон + белый текст
- Теги удобств: Wi-Fi/Кондиционер → голубой (`#EBF4FF`/`#3B82F6`), Кухня/Холодильник → зелёный (`#ECFDF5`/`#10B981`), Балкон/Вид → золотой (`#FFFBEB`/`#D97706`), остальные — бледно-синий

---

## 3. Типографика

```
Гарнитура:  Inter (Google Fonts)
Подключить: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap
```

| Элемент             | Размер | Вес | Цвет    |
|---------------------|--------|-----|---------|
| H1 (заголовок стр.) | 34–44px | 800 | #FFFFFF (на тёмном фоне) |
| H2 (секция)         | 24px   | 800 | #0F2A5C |
| Название номера     | 18px   | 800 | #0F2A5C |
| Body                | 15px   | 400 | #0F2A5C, opacity 0.88 |
| Подписи, теги       | 12–13px | 500 | #4A6FA5 |
| Цена                | 16–24px | 800 | #EF4444 |
| Кнопки              | 15px   | 700 | — |

---

## 4. Структура сайта

```
/                   → Главная страница
/rooms              → Каталог номеров (разводящая)
/rooms/1            → Номер 1 (детальная)
/rooms/2            → Номер 2 (детальная)
/rooms/3            → Номер 3 (детальная)
/rooms/4            → Номер 4 (детальная)
/rooms/5            → Номер 5 (детальная)
/rooms/6            → Номер 6 (детальная)
/rooms/apartments   → Апартаменты (детальная)
/privacy            → Политика персональных данных
```

Навигация реализована через History API (`pushState`) — без перезагрузки страницы.

---

## 5. Компоненты

### 5.1 Хэдер (sticky + glassmorphism при скролле)

**Поведение:**
- `position: fixed; top: 0; z-index: 50`
- **Всегда видим** — не скрывается при скролле вниз
- При `scrollY > 40px`: фон меняется с глухого `#3B82F6` → `rgba(59,130,246,0.72)` + `backdrop-filter: blur(14px) saturate(160%)` + тень
- При `scrollY ≤ 40px`: глухой синий без блюра
- Переход: `transition: background 300ms ease, backdrop-filter 300ms ease`

**Состав (слева → направо):**
1. **Кнопка-бургер** — 42×42px, `rgba(255,255,255,0.14)` фон, скруглення 10px. При hover → `rgba(255,255,255,0.25)`. Иконка ☰ белая.
2. **Логотип** — «🍑 Абрикос» 22px/800, белый. Рядом «мини-отель · Ейск» 15px/400, `rgba(255,255,255,0.82)`. На мобиле (< 760px) подпись скрыта.
3. **Телефоны** (desktop ≥ 760px) — два кликабельных `<a href="tel:...">`, 15px/600, белый. Hover → `#FBBF24`. Иконка телефона 15px.
4. **Иконка телефона** (mobile < 760px) — 40×40px кнопка, только первый номер.
5. **Кнопка «Забронировать»** — `#FBBF24` фон, `#0F2A5C` текст, 15px/700, padding 10px 22px, border-radius 10px. При клике — скролл к `#booking-widget` на главной (если другая страница — сначала переход на главную, затем скролл через 120ms).

**Высота хэдера:** 66px

---

### 5.2 Бургер-меню (drawer)

**Поведение:**
- Выдвигается слева, ширина 280px
- Оверлей: `rgba(15,42,92,0.5)` + `backdrop-filter: blur(3px)`, клик по оверлею закрывает
- Анимация: `translateX(-100%)` → `translateX(0)`, 280ms cubic-bezier(0.4,0,0.2,1)

**Состав:**
- Шапка дровера: `#3B82F6` фон, «🍑 Абрикос» + кнопка ✕
- Ссылки навигации: Главная / Наши номера / Политика ПД. Каждая строка — 15px/600, hover фон `#EBF4FF`, стрелка → синяя
- Подвал дровера: два телефона с иконками

---

### 5.3 Заголовок страницы (PageHeader)

Используется на всех страницах кроме главной.

```css
background: #0F2A5C;
padding-top: 100px; /* перекрыть хэдер */
padding-bottom: 40px;
border-bottom: 4px solid #FBBF24;
```

- H1: белый, 30–44px (clamp), fontWeight 800
- Subtitle: `rgba(255,255,255,0.72)`, 16px, maxWidth 540px

---

### 5.4 Главная страница

**Структура:**
```
[PageHeader — тёмно-синий с жёлтой чертой]
[Шахматные блоки текст/картинка × 4]
[CTA-баннер → «Наши номера»]
[Виджет бронирования agast.ru]
```

**Шахматные блоки:**
- Чётные (0, 2): текст слева, картинка справа
- Нечётные (1, 3): картинка слева, текст справа
- CSS Grid: `grid-template-columns: 1fr 1fr; gap: 48px`
- На мобиле (< 680px): `grid-template-columns: 1fr`, картинка всегда первая
- Картинки: `border-radius: 18px`, `aspect-ratio: 4/3`, `object-fit: cover`
- Hover на картинке: `transform: scale(1.03)`, transition 400ms ease
- Тень картинки: `box-shadow: 0 6px 32px rgba(59,130,246,0.14)`

**CTA-баннер:**
- Градиент: `linear-gradient(120deg, #3B82F6, #60A5FA)`
- border-radius 20px, padding 36px 40px
- Заголовок белый 22px/800 + подпись `rgba(255,255,255,0.8)`
- Кнопка «Все номера» — жёлтая стандартная

---

### 5.5 Каталог номеров

Grid карточек: `repeat(auto-fill, minmax(280px, 1fr))`, gap 22px

**Карточка номера:**
- Белый фон, border-radius 16px, border 1.5px `rgba(59,130,246,0.18)`
- Hover: `translateY(-3px)` + тень `0 10px 32px rgba(59,130,246,0.16)` + border меняется на `#60A5FA`
- Transition: 200ms ease
- Фото сверху: `aspect-ratio: 4/3`, hover → `scale(1.05)` на img (400ms)
- Бейдж площади: `#3B82F6` фон, белый текст, border-radius 20px
- Цена: `#EF4444`, 16px/800
- Ссылка «Подробнее»: `#3B82F6`, 13px/600 + стрелка

---

### 5.6 Детальная страница номера

**Состав:**
1. Кнопка «← Все номера» (ссылка назад)
2. Grid 1fr/1fr (мобиле: 1 колонка)
   - **Левая — галерея:** большое фото + 3 превью. Активное превью — border 2.5px `#3B82F6`. При клике на превью — смена главного фото.
   - **Правая — инфо:**
     - Плашка характеристик: площадь / кол-во гостей / тип кровати. Фон `#EBF4FF`, border-radius 14px.
     - Описание 15px, lineHeight 1.7
     - Теги удобств (см. цвета в п. 2)
     - Плашка цены + кнопка: градиентный синий фон, цена `#FBBF24`, кнопка «Забронировать» жёлтая

---

### 5.7 Виджет бронирования (agast.ru)

**ID секции:** `id="booking-widget"` — к этому ID ведёт кнопка «Забронировать» в хэдере.

**Интеграция с agast.ru:**

```html
<!-- Вставить в секцию #booking-widget -->
<!-- Получить актуальный код в личном кабинете agast.ru: Настройки → Виджет бронирования -->
<div id="agast-widget-container"></div>
<script>
  // Пример — уточнить у agast.ru актуальный формат
  (function(w, d, s, o) {
    var js = d.createElement(s);
    js.src = 'https://agast.ru/widget/loader.js';
    js.dataset.hotelId = 'HOTEL_ID_HERE';
    js.async = true;
    d.head.appendChild(js);
  })(window, document, 'script');
</script>
```

**Оформление контейнера:**
```css
#booking-widget {
  background: #EBF4FF;
  padding: 60px 16px;
}
#agast-widget-container {
  max-width: 1024px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid rgba(59,130,246,0.18);
  box-shadow: 0 4px 32px rgba(59,130,246,0.10);
  min-height: 380px;
  overflow: hidden;
}
```

---

### 5.8 Футер

**Фон:** `#3B82F6`

Сверху — SVG волна-разделитель (цвет волны = фон предыдущей секции):
```html
<svg viewBox="0 0 1440 48" preserveAspectRatio="none" style="width:100%;height:48px;display:block;">
  <path fill="#FFFDF2" d="M0,32 C360,0 720,48 1080,24 C1260,12 1380,36 1440,32 L1440,0 L0,0 Z"/>
</svg>
```

**Содержимое (3 колонки, auto-fit minmax 180px):**
1. **Бренд:** «🍑 Абрикос» 22px/800 + подпись серая
2. **Навигация:** Наши номера, Политика ПД
3. **Соцсети:**
   - ВКонтакте: `#4C75A3`, текст «ВК»
   - Telegram: `#229ED9`, текст «TG»
   - Max: `#FBBF24`, текст «M», текст `#0F2A5C`
   - Размер иконок: 40×40px, border-radius 10px
   - Hover: `translateY(-2px)` + тень

**Подвал футера:**
```
ООО «Комплексные мероприятия»          © 2026 Мини-отель Абрикос
```
Граница сверху: `rgba(255,255,255,0.18)`

---

### 5.9 Cookie-баннер

**Позиция:** `position: fixed; bottom: 0; z-index: 60`  
**Фон:** `#0F2A5C`  
**Верхняя граница:** `3px solid #3B82F6`

Текст + две кнопки: «Отказаться» (outline белый) + «Принять» (жёлтая).

**Логика:**
```js
// Проверка при загрузке
if (!localStorage.getItem('cookie-consent')) {
  showCookieBanner();
}
// При нажатии
document.getElementById('accept-cookies').addEventListener('click', () => {
  localStorage.setItem('cookie-consent', 'accepted');
  hideCookieBanner();
});
document.getElementById('decline-cookies').addEventListener('click', () => {
  localStorage.setItem('cookie-consent', 'declined');
  hideCookieBanner();
});
```

---

## 6. Данные номеров

| ID | Название | Тип | Площадь | Мест | Кровать | Цена от |
|----|----------|-----|---------|------|---------|---------|
| 1 | Номер 1 | Стандартный двухместный | 18 м² | 2 | 1 двуспальная | 3 500 ₽ |
| 2 | Номер 2 | С раздельными кроватями | 20 м² | 2 | 2 односпальные | 3 500 ₽ |
| 3 | Номер 3 | Улучшенный двухместный | 22 м² | 2 | 1 King | 4 200 ₽ |
| 4 | Номер 4 | Семейный | 30 м² | 3 | Двуспальная + односпальная | 5 200 ₽ |
| 5 | Номер 5 | Делюкс с видом на море | 25 м² | 2 | 1 King | 5 800 ₽ |
| 6 | Номер 6 | С балконом | 24 м² | 2 | 1 двуспальная | 4 800 ₽ |
| apartments | Апартаменты | Просторные апартаменты | 45 м² | 4 | Двуспальная + диван | 7 500 ₽ |

**Удобства (стандарт для всех):** Wi-Fi, Кондиционер, Телевизор, Холодильник/Мини-бар, Душ или Ванная  
**Дополнительно:** Балкон (№6), Халаты и тапочки (№5), Полная кухня + Стиральная машина (Апартаменты), Детская кроватка по запросу (№4)

---

## 7. Интеграция Яндекс.Метрика

### 7.1 Базовая установка

```html
<!-- Вставить в <head> каждой страницы (или в base HTML для SPA) -->
<!-- Заменить XXXXXXXX на реальный ID счётчика -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],
    k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(XXXXXXXX, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,       // запись сессий
    ecommerce: "dataLayer"
  });
</script>
<noscript>
  <div><img src="https://mc.yandex.ru/watch/XXXXXXXX" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript>
```

### 7.2 Отслеживание виртуальных страниц (SPA / History API)

При каждой смене страницы вызывать:

```js
// При навигации на новую страницу
function trackPage(url) {
  if (typeof ym !== 'undefined') {
    ym(XXXXXXXX, 'hit', url);
  }
}

// Пример использования
window.addEventListener('popstate', () => trackPage(location.pathname));
// Или при pushState:
history.pushState(state, '', url);
trackPage(url);
```

### 7.3 Цели для отслеживания

Настроить в интерфейсе Яндекс.Метрики → Цели:

| Цель | Тип | Условие |
|------|-----|---------|
| Клик «Забронировать» (хэдер) | JavaScript | `ym(ID, 'reachGoal', 'header_book_click')` |
| Клик «Забронировать» (номер) | JavaScript | `ym(ID, 'reachGoal', 'room_book_click', {room_id: roomId})` |
| Просмотр страницы номера | JavaScript | `ym(ID, 'reachGoal', 'room_view', {room_id: roomId})` |
| Клик по телефону | JavaScript | `ym(ID, 'reachGoal', 'phone_click')` |
| Открытие виджета бронирования | JavaScript | `ym(ID, 'reachGoal', 'booking_widget_view')` |
| Принятие cookie | JavaScript | `ym(ID, 'reachGoal', 'cookie_accept')` |

### 7.4 Расстановка вызовов в коде

```js
// Кнопка «Забронировать» в хэдере
headerBookBtn.addEventListener('click', () => {
  ym(XXXXXXXX, 'reachGoal', 'header_book_click');
  scrollToBookingWidget();
});

// Телефон
document.querySelectorAll('a[href^="tel:"]').forEach(el => {
  el.addEventListener('click', () => ym(XXXXXXXX, 'reachGoal', 'phone_click'));
});

// Просмотр номера (при переходе на детальную)
function openRoomPage(roomId) {
  ym(XXXXXXXX, 'reachGoal', 'room_view', { room_id: roomId });
  navigateTo(`/rooms/${roomId}`);
}

// Скролл к виджету (IntersectionObserver)
const bookingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      ym(XXXXXXXX, 'reachGoal', 'booking_widget_view');
      bookingObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
bookingObserver.observe(document.getElementById('booking-widget'));
```

---

## 8. Технические требования к реализации

### 8.1 Структура файлов

```
/
├── index.html          ← SPA-оболочка, все страницы рендерятся сюда
├── css/
│   ├── reset.css       ← минимальный сброс (box-sizing, margin: 0)
│   ├── tokens.css      ← CSS custom properties (палитра, типографика)
│   ├── layout.css      ← хэдер, футер, сетки
│   ├── components.css  ← карточки, кнопки, теги
│   └── pages.css       ← стили отдельных страниц
├── js/
│   ├── router.js       ← History API роутер
│   ├── data.js         ← данные номеров (JS-объект)
│   ├── render.js       ← функции рендера страниц
│   ├── header.js       ← логика хэдера (scroll, burger)
│   ├── cookies.js      ← баннер cookie
│   └── analytics.js    ← обёртки Яндекс.Метрики
├── img/
│   └── rooms/          ← фото номеров (оптимизированные WebP + AVIF)
└── favicon.ico
```

### 8.2 CSS custom properties (tokens.css)

```css
:root {
  --color-sky:       #3B82F6;
  --color-sky-light: #60A5FA;
  --color-sky-pale:  #EBF4FF;
  --color-foam:      #FFFDF2;
  --color-sun:       #FBBF24;
  --color-coral:     #EF4444;
  --color-green:     #10B981;
  --color-navy:      #0F2A5C;
  --color-navy-mid:  #4A6FA5;

  --font-base: 'Inter', sans-serif;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 20px;

  --shadow-card:   0 2px 12px rgba(59,130,246,0.07);
  --shadow-hover:  0 10px 32px rgba(59,130,246,0.16);
  --shadow-header: 0 2px 24px rgba(15,42,92,0.18);
  --shadow-btn:    0 2px 8px rgba(251,191,36,0.35);
}
```

### 8.3 Роутер (router.js)

```js
const routes = {
  '/':               renderHome,
  '/rooms':          renderRooms,
  '/rooms/:id':      renderRoomDetail,
  '/privacy':        renderPrivacy,
};

function navigate(path) {
  history.pushState({}, '', path);
  render(path);
  window.scrollTo({ top: 0, behavior: 'instant' });
  trackPage(path); // Яндекс.Метрика
}

window.addEventListener('popstate', () => render(location.pathname));
document.addEventListener('DOMContentLoaded', () => render(location.pathname));
```

### 8.4 Анимации (минимальные, уместные)

| Элемент | Анимация | Параметры |
|---------|----------|-----------|
| Хэдер glassmorphism | background + backdrop-filter | 300ms ease |
| Кнопки hover | translateY(-1px) + box-shadow | 150ms ease |
| Карточки номеров hover | translateY(-3px) + box-shadow | 200ms ease |
| Фото в карточке hover | scale(1.05) | 400ms ease |
| Фото на главной hover | scale(1.03) | 400ms ease |
| Бургер-дровер | translateX | 280ms cubic-bezier(0.4,0,0.2,1) |
| Оверлей бургера | opacity | 250ms ease |
| Иконки соцсетей | translateY(-2px) | 150ms ease |

**Запрет:** без автопроигрываемых анимаций, без тяжёлых CSS keyframe-анимаций на scroll — только hover/focus transitions.

### 8.5 Адаптивность

| Брейкпоинт | Изменения |
|------------|-----------|
| < 680px | Шахматные блоки → 1 колонка; сетка детали номера → 1 колонка |
| < 760px | Телефоны в хэдере → иконка; подпись «мини-отель» скрыта |
| < 900px | Сетка карточек — 2 колонки (auto-fill minmax 280px) |

### 8.6 SEO и мета-теги

```html
<!-- В <head> каждой "страницы" (менять через JS при навигации) -->
<title>Мини-отель Абрикос — Ейск | [Название страницы]</title>
<meta name="description" content="Мини-отель Абрикос в Ейске — уютный отдых на Азовском море. 7 номеров, онлайн-бронирование.">
<meta property="og:title" content="Мини-отель Абрикос, Ейск">
<meta property="og:image" content="/img/og-cover.jpg">
<link rel="canonical" href="https://hotel-abricos.ru[path]">
```

---

## 9. Политика конфиденциальности

**ООО «Комплексные мероприятия»** — оператор персональных данных.

Обрабатываемые данные: ФИО, телефон, email, паспортные данные (при заселении), данные оплаты (без хранения реквизитов карты).

Полный текст политики — в прототипе, компонент `PrivacyPage`. Страница доступна по `/privacy`.

---

## 10. Контактная информация (заполнить у заказчика)

```
Адрес:         г. Ейск, ул. __________, д. __
Телефон 1:     +7 (938) 000-00-00
Телефон 2:     +7 (938) 000-00-01
Email:         info@hotel-abricos.ru
ВКонтакте:     https://vk.com/...
Telegram:      https://t.me/...
Max:           https://max.ru/...
ИНН:           XXXXXXXXXX
ОГРН:          XXXXXXXXXXXXX
```

---

## 11. Чеклист перед запуском

- [ ] Заменить placeholder-телефоны на реальные
- [ ] Заменить ссылки соцсетей на реальные страницы
- [ ] Заполнить ИНН / ОГРН в футере и Политике ПД
- [ ] Получить и вставить код виджета agast.ru (ID отеля)
- [ ] Зарегистрировать счётчик Яндекс.Метрики, вставить ID
- [ ] Настроить цели в Яндекс.Метрике (таблица в п. 7.3)
- [ ] Заменить Unsplash-фото на реальные фото номеров (WebP)
- [ ] Добавить реальный адрес в Политику ПД
- [ ] Подключить SSL-сертификат
- [ ] Проверить robots.txt и sitemap.xml
- [ ] Протестировать на iOS Safari и Android Chrome
- [ ] Проверить Core Web Vitals (LCP < 2.5s, CLS < 0.1)

---

*Прототип: React + Tailwind, файл `/src/app/App.tsx`*  
*Дата: 2026*  
*Заказчик: ООО «Комплексные мероприятия»*
