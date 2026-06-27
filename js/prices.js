/**
 * Тарифы: таблица на /price и «от … ₽/ночь» на деталках номеров.
 * Источник — Google Таблица (публичный CSV через gviz, без Google API и бэкенда)
 * или fallback из SITE_CONFIG.prices.
 */
(function () {
  var siteCfg = window.SITE_CONFIG || {};
  var sheetCfg = siteCfg.pricesSheet;
  var fallbackCfg = siteCfg.prices;
  var CACHE_KEY = 'prices-sheet-cache-v1';
  var CACHE_TTL_MS = 6 * 60 * 60 * 1000;
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
          sheetLabel: cat.sheetLabel,
          sheetRow: cat.sheetRow,
          rates: cat.rates.slice(),
          priceFrom: cat.priceFrom,
        };
      }),
    };
  }

  function normalizeLabel(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function parsePrice(value) {
    var digits = String(value == null ? '' : value).replace(/[^\d]/g, '');
    var num = parseInt(digits, 10);
    return isNaN(num) ? 0 : num;
  }

  function parseCsv(text) {
    var rows = [];
    var row = [];
    var cell = '';
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell);
        cell = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell);
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += ch;
      }
    }

    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }

    return rows;
  }

  function sheetGvizUrl(range) {
    var id = sheetCfg.spreadsheetId;
    var query = 'tqx=out:csv&range=' + encodeURIComponent(range);
    if (sheetCfg.gid != null && sheetCfg.gid !== '') {
      query += '&gid=' + encodeURIComponent(String(sheetCfg.gid));
    }
    return 'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?' + query;
  }

  function fetchSheetText(range) {
    return fetch(sheetGvizUrl(range), { credentials: 'omit' }).then(function (res) {
      if (!res.ok) throw new Error('sheet HTTP ' + res.status);
      return res.text();
    });
  }

  function applySheetData(csvRows, yearValue) {
    if (!csvRows.length) return;

    var monthRow = csvRows[0];
    var months = monthRow.slice(1).map(function (m) {
      return String(m || '').trim();
    }).filter(Boolean);
    if (months.length) cfg.months = months;

    if (yearValue) {
      var year = parseInt(String(yearValue).replace(/[^\d]/g, ''), 10);
      if (!isNaN(year)) cfg.year = year;
    }

    var ratesByLabel = {};
    var ratesByRow = {};

    for (var r = 1; r < csvRows.length; r++) {
      var sheetRow = sheetCfg.layout.headerRow + r;
      var label = String(csvRows[r][0] || '').trim();
      var rates = csvRows[r].slice(1).map(parsePrice).filter(function (n) {
        return n > 0;
      });
      if (!rates.length) continue;

      if (label) ratesByLabel[normalizeLabel(label)] = rates;
      ratesByRow[sheetRow] = rates;
    }

    cfg.categories.forEach(function (category) {
      var rates = null;
      var labelKey = normalizeLabel(category.sheetLabel || category.name);

      if (labelKey && ratesByLabel[labelKey]) {
        rates = ratesByLabel[labelKey];
      } else if (category.sheetRow && ratesByRow[category.sheetRow]) {
        rates = ratesByRow[category.sheetRow];
      }

      if (rates && rates.length) {
        category.rates = rates;
        category.priceFrom = Math.min.apply(null, rates);
      }
    });
  }

  function formatAmount(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
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
        cell.textContent = formatAmount(rate);
        row.appendChild(cell);
      });

      var actionCell = document.createElement('td');
      if (category.bookId) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'price-table__book';
        button.setAttribute('data-room-book', category.bookId);
        button.textContent = 'Забронировать';
        actionCell.appendChild(button);
      } else {
        var link = document.createElement('a');
        link.className = 'price-table__book';
        link.href = '/#booking-widget';
        link.textContent = 'Забронировать';
        actionCell.appendChild(link);
      }
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
  }

  function renderPriceTableHead() {
    var headRow = document.getElementById('price-table-head-row');
    if (!headRow) return;

    var monthCells = headRow.querySelectorAll('[data-price-month]');
    monthCells.forEach(function (cell, index) {
      if (cfg.months[index]) cell.textContent = cfg.months[index];
    });
  }

  function renderPriceYear() {
    var heading = document.getElementById('price-year-heading');
    if (heading && cfg.year) {
      heading.textContent = 'Тарифы ' + cfg.year;
    }
  }

  function hydrateRoomPrices() {
    document.querySelectorAll('.room-detail__content').forEach(function (content) {
      var bookBtn = content.querySelector('[data-room-book]');
      if (!bookBtn) return;
      var category = findCategory(bookBtn.getAttribute('data-room-book'));
      var priceEl = content.querySelector('.room-detail__price');
      if (category && priceEl) {
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

  function loadFromSheet() {
    if (!sheetCfg || !sheetCfg.enabled || !sheetCfg.spreadsheetId) {
      return Promise.resolve(false);
    }

    var cached = readCache();
    if (cached && applyCachedData(cached)) {
      return Promise.resolve(true);
    }

    var yearPromise = sheetCfg.layout.yearCell
      ? fetchSheetText(sheetCfg.layout.yearCell).then(function (text) {
          var rows = parseCsv(text);
          return rows.length && rows[0].length ? rows[0][0] : '';
        })
      : Promise.resolve('');

    return yearPromise
      .then(function (yearValue) {
        return fetchSheetText(sheetCfg.layout.dataRange).then(function (text) {
          applySheetData(parseCsv(text), yearValue);
          writeCacheFromConfig();
          return true;
        });
      })
      .catch(function () {
        return false;
      });
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts || !parsed.data) return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (_) {
      return null;
    }
  }

  function applyCachedData(data) {
    if (!data || !Array.isArray(data.months) || !Array.isArray(data.categories)) return false;

    if (data.year) cfg.year = data.year;
    cfg.months = data.months.slice();

    var byBookId = {};
    data.categories.forEach(function (item) {
      if (!item || item.bookId == null) return;
      byBookId[String(item.bookId)] = item;
    });

    cfg.categories.forEach(function (category) {
      var cached = byBookId[String(category.bookId)];
      if (!cached || !Array.isArray(cached.rates) || !cached.rates.length) return;
      category.rates = cached.rates.slice();
      category.priceFrom = typeof cached.priceFrom === 'number' ? cached.priceFrom : Math.min.apply(null, cached.rates);
    });

    return true;
  }

  function writeCacheFromConfig() {
    var data = {
      year: cfg.year,
      months: cfg.months.slice(),
      categories: cfg.categories.map(function (category) {
        return {
          bookId: category.bookId,
          rates: category.rates.slice(),
          priceFrom: category.priceFrom,
        };
      }),
    };

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ts: Date.now(),
          data: data,
        })
      );
    } catch (_) {}
  }

  function scheduleSheetRefresh(onDone) {
    var run = function () {
      loadFromSheet().then(function (loaded) {
        if (loaded) onDone();
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 1800 });
    } else {
      setTimeout(run, 400);
    }
  }

  if (!hasPriceTargets()) return;

  renderAll();

  scheduleSheetRefresh(renderAll);
})();
