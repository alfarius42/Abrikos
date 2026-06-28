/**
 * Бронирование Agast — переход по ссылке с любой CTA «Забронировать».
 * @see docs/SPEC.md §7.2
 */
(function () {
  var mounted = false;

  function getConfig() {
    return window.SITE_CONFIG || {};
  }

  function isLinkMode() {
    return String(getConfig().agastOpenMode || 'link').toLowerCase() !== 'iframe';
  }

  function buildAgastBookingUrl(cfg) {
    var id = String(cfg.agastSystemId || '').trim();
    if (!id) return '';

    var style = String(cfg.agastParamStyle || 'compact').toLowerCase();
    var query = style === 'spaced' ? 'hms_system_id= ' + id : 'hms_system_id=' + id;

    return 'https://booking-online.agast.ru/?' + query;
  }

  function getSafeAgastUrl() {
    var rawUrl = buildAgastBookingUrl(getConfig());
    if (!rawUrl || !window.SiteUtils || !window.SiteUtils.toSafeUrl) return '';

    return window.SiteUtils.toSafeUrl(rawUrl, { allowedHosts: ['agast.ru'] });
  }

  function openAgastBooking() {
    var safeUrl = getSafeAgastUrl();
    if (!safeUrl) return false;

    window.open(safeUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  function mountWidget() {
    if (mounted) return true;

    var container = document.getElementById('agast-widget-container');
    if (!container) return false;

    var safeSrc = getSafeAgastUrl();
    if (!safeSrc) return false;

    var iframe = document.createElement('iframe');
    iframe.src = safeSrc;
    iframe.title = 'Онлайн-бронирование';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    iframe.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups');

    container.textContent = '';
    container.hidden = false;
    container.classList.remove('is-empty');
    container.appendChild(iframe);
    mounted = true;
    return true;
  }

  function activateBooking() {
    if (window.Analytics) {
      window.Analytics.reachGoal('booking_widget_open');
    }

    if (isLinkMode()) {
      return openAgastBooking();
    }

    return mountWidget();
  }

  function openRoomBooking(roomId) {
    if (!roomId) return;

    if (window.Analytics) {
      window.Analytics.reachGoal('room_book_click', { room_id: roomId });
    }

    if (isLinkMode()) {
      activateBooking();
      return;
    }

    if (window.Navigation) {
      window.Navigation.goHomeAndScrollToBooking(roomId);
    } else {
      location.href = '/?room=' + encodeURIComponent(roomId) + '#booking-widget';
    }
  }

  function isBookingWidgetLink(el) {
    if (!el || el.tagName !== 'A') return false;
    var href = el.getAttribute('href') || '';
    return href === '/#booking-widget' || href.indexOf('/#booking-widget') === 0;
  }

  document.addEventListener('click', function (e) {
    var roomBtn = e.target.closest('[data-room-book]');
    if (roomBtn) {
      e.preventDefault();
      e.stopPropagation();
      openRoomBooking(roomBtn.getAttribute('data-room-book'));
      return;
    }

    if (e.target.closest('#btn-booking-open, [data-action="book"]')) {
      e.preventDefault();
      activateBooking();
      return;
    }

    var bookingLink = e.target.closest('a');
    if (bookingLink && isBookingWidgetLink(bookingLink) && isLinkMode()) {
      e.preventDefault();
      activateBooking();
    }
  });

  window.Booking = {
    openRoomBooking: openRoomBooking,
    openAgastBooking: openAgastBooking,
    mountWidget: mountWidget,
    activateBooking: activateBooking,
  };
})();
