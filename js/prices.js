/**
 * Рендер тарифной таблицы на /price из SITE_CONFIG.prices
 */
(function () {
  var cfg = window.SITE_CONFIG && window.SITE_CONFIG.prices;
  if (!cfg) return;

  var tbody = document.getElementById('price-table-body');
  if (!tbody) return;

  function formatAmount(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

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
})();
