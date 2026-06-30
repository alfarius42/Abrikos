/**
 * Тарифы: таблица на /price и «от … ₽/ночь» на деталках номеров.
 * Источник — только SITE_CONFIG.prices (без сетевых запросов и кэша).
 */
(function () {
  var siteCfg = window.SITE_CONFIG || {};
  var fallbackCfg = siteCfg.prices;
  if (!fallbackCfg) return;

  var cfg = clonePrices(fallbackCfg);

  function hasPriceTargets() {
    var hasTable = Boolean(document.getElementById('price-table-body'));
    var hasRoomPrice = Boolean(document.querySelector('.room-detail__content .room-detail__price'));
    return hasTable || hasRoomPrice;
  }

  function clonePrices(source) {
    return {
      year: source.year,
      months: source.months.slice(),
      categories: source.categories.map(function (cat) {
        return {
          bookId: cat.bookId,
          name: cat.name,
          rates: cat.rates.slice(),
          priceFrom: cat.priceFrom,
        };
      }),
    };
  }

  function cellText(value) {
    return String(value == null ? '' : value).trim();
  }

  function parsePrice(value) {
    var digits = String(value == null ? '' : value).replace(/[^\d]/g, '');
    var num = parseInt(digits, 10);
    return isNaN(num) ? 0 : num;
  }

  function formatAmount(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

  function formatRateDisplay(value) {
    var text = cellText(value);
    if (!text) return '—';

    var num = parsePrice(text);
    if (num > 0 && /^[\d\s]+$/.test(text)) {
      return formatAmount(num);
    }

    return text;
  }

  function formatPriceFrom(priceFrom) {
    return 'от ' + formatAmount(priceFrom) + '/ночь';
  }

  function findCategory(bookId) {
    if (!bookId) return null;
    for (var i = 0; i < cfg.categories.length; i++) {
      if (String(cfg.categories[i].bookId) === String(bookId)) {
        return cfg.categories[i];
      }
    }
    return null;
  }

  function renderPriceTable() {
    var tbody = document.getElementById('price-table-body');
    if (!tbody) return;

    tbody.textContent = '';

    cfg.categories.forEach(function (category) {
      var row = document.createElement('tr');

      var nameCell = document.createElement('td');
      nameCell.textContent = category.name;
      row.appendChild(nameCell);

      category.rates.forEach(function (rate) {
        var cell = document.createElement('td');
        cell.className = 'price-table__amount';
        cell.textContent = formatRateDisplay(rate);
        row.appendChild(cell);
      });

      var actionCell = document.createElement('td');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'price-table__book';
      if (category.bookId) {
        button.setAttribute('data-room-book', category.bookId);
      } else {
        button.setAttribute('data-action', 'book');
      }
      button.textContent = 'Забронировать';
      actionCell.appendChild(button);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
  }

  function renderPriceTableHead() {
    var headRow = document.getElementById('price-table-head-row');
    if (!headRow) return;

    var monthCells = headRow.querySelectorAll('[data-price-month]');
    monthCells.forEach(function (cell, index) {
      cell.textContent = cfg.months[index] != null ? cfg.months[index] : '';
    });
  }

  function renderPriceYear() {
    var heading = document.getElementById('price-year-heading');
    if (heading && cfg.year != null && cfg.year !== '') {
      heading.textContent = 'Тарифы ' + cfg.year;
    }
  }

  function hydrateRoomPrices() {
    document.querySelectorAll('.room-detail__content').forEach(function (content) {
      var bookBtn = content.querySelector('[data-room-book]');
      if (!bookBtn) return;
      var category = findCategory(bookBtn.getAttribute('data-room-book'));
      var priceEl = content.querySelector('.room-detail__price');
      if (category && priceEl && category.priceFrom) {
        priceEl.textContent = formatPriceFrom(category.priceFrom);
      }
    });
  }

  function renderAll() {
    renderPriceTableHead();
    renderPriceYear();
    renderPriceTable();
    hydrateRoomPrices();
  }

  if (!hasPriceTargets()) return;

  renderAll();
})();
