/**
 * Shared navigation helpers for MPA flows.
 */
(function () {
  function markPendingRoom(roomId) {
    const container = document.getElementById('agast-widget-container');
    if (!container) return;

    if (roomId) container.setAttribute('data-pending-room', roomId);
    else container.removeAttribute('data-pending-room');
  }

  function scrollToBookingWidget() {
    document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initHomePendingState() {
    if (location.pathname !== '/') return;

    const params = new URLSearchParams(location.search);
    const pendingRoom = params.get('room');
    if (pendingRoom) {
      markPendingRoom(pendingRoom);
    }

    if (location.hash === '#booking-widget' || pendingRoom) {
      requestAnimationFrame(function () {
        scrollToBookingWidget();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initHomePendingState);

  window.Navigation = {
    markPendingRoom: markPendingRoom,
    scrollToTop: scrollToTop,
    scrollToBookingWidget: scrollToBookingWidget,
    goHomeAndScrollTop: function () {
      if (location.pathname === '/') scrollToTop();
      else location.href = '/';
    },
    goHomeAndScrollToBooking: function (roomId) {
      if (location.pathname === '/') {
        markPendingRoom(roomId || '');
        scrollToBookingWidget();
        return;
      }
      const roomQuery = roomId ? '?room=' + encodeURIComponent(roomId) : '';
      location.href = '/' + roomQuery + '#booking-widget';
    },
  };
})();
