/**
 * Shared navigation helpers for shell and booking flows.
 */
(function () {
  let pendingBookingRoomId = null;
  let pendingScrollTop = false;

  function markPendingRoom(roomId) {
    const container = document.getElementById('agast-widget-container');
    if (!container) return;

    if (roomId) {
      container.setAttribute('data-pending-room', roomId);
    } else {
      container.removeAttribute('data-pending-room');
    }
  }

  function scrollToBookingWidget() {
    document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function flushPendingRouteActions(pathname) {
    if (pathname !== '/') return;

    if (pendingScrollTop) {
      pendingScrollTop = false;
      requestAnimationFrame(scrollToTop);
    }

    if (pendingBookingRoomId !== null) {
      const roomId = pendingBookingRoomId || '';
      pendingBookingRoomId = null;
      requestAnimationFrame(function () {
        markPendingRoom(roomId);
        scrollToBookingWidget();
      });
    }
  }

  document.addEventListener('routechange', function (event) {
    flushPendingRouteActions(event.detail?.pathname || location.pathname);
  });

  window.Navigation = {
    scrollToTop: scrollToTop,
    scrollToBookingWidget: scrollToBookingWidget,

    goHomeAndScrollTop: function () {
      if (location.pathname === '/') {
        scrollToTop();
        return;
      }

      if (window.Router) {
        pendingScrollTop = true;
        window.Router.navigate('/');
      } else {
        location.href = '/';
      }
    },

    goHomeAndScrollToBooking: function (roomId) {
      if (location.pathname === '/') {
        markPendingRoom(roomId || '');
        scrollToBookingWidget();
        return;
      }

      if (window.Router) {
        pendingBookingRoomId = roomId || '';
        window.Router.navigate('/');
      } else {
        location.href = '/#booking-widget';
      }
    },
  };
})();
