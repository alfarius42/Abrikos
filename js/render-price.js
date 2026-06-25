/**
 * Price page renderer (contract + pending content).
 */
(function () {
  window.PageRenderers = window.PageRenderers || {};

  const escapeHtml = window.RenderShared?.escapeHtml;
  const renderPageHeader = window.RenderShared?.renderPageHeader;

  function renderPriceRows() {
    return (window.SITE_DATA?.rooms || [])
      .map(function (room) {
        return (
          '<tr>' +
          '<td>' +
          escapeHtml(room.name) +
          '</td>' +
          '<td>Высокий / низкий сезон</td>' +
          '<td>' +
          escapeHtml(room.price) +
          '</td>' +
          '<td>Уточняется</td>' +
          '<td><button type="button" class="price-table__book" data-room-book="' +
          escapeHtml(room.id) +
          '">Забронировать</button></td>' +
          '</tr>'
        );
      })
      .join('');
  }

  window.PageRenderers.price = function (root) {
    root.innerHTML =
      renderPageHeader('Прайс-лист', 'Актуальные тарифы и условия размещения') +
      '<section class="price-page">' +
      '<div class="container">' +
      '<article class="price-card">' +
      '<p class="price-page__pending">PENDING_CONTENT: финальная тарифная таблица уточняется у заказчика.</p>' +
      '<h2>Сезонность и актуальность</h2>' +
      '<p>Цены зависят от сезона, длительности проживания и состава гостей. Перед бронированием уточните финальную стоимость у администратора.</p>' +
      '<div class="price-table-wrap">' +
      '<table class="price-table">' +
      '<thead>' +
      '<tr><th>Категория</th><th>Период</th><th>Цена за ночь</th><th>Мин. срок</th><th>Действие</th></tr>' +
      '</thead>' +
      '<tbody>' +
      renderPriceRows() +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<h3>Что включено в стоимость</h3>' +
      '<ul class="price-page__list">' +
      '<li>Проживание в выбранной категории номера</li>' +
      '<li>Wi-Fi и базовые удобства по категории</li>' +
      '<li>Постельное белье и полотенца</li>' +
      '</ul>' +
      '<h3>Дополнительные условия</h3>' +
      '<ul class="price-page__list">' +
      '<li>Ранний заезд и поздний выезд по согласованию</li>' +
      '<li>Детская кроватка и доп. место — по запросу</li>' +
      '<li>Подтверждение брони зависит от доступности номеров</li>' +
      '</ul>' +
      '<a class="btn-primary price-page__cta" data-nav href="/">К блоку бронирования</a>' +
      '</article>' +
      '</div>' +
      '</section>';
  };
})();
