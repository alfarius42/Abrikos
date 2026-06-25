/**
 * Бронирование Agast — заглушка до Sprint 3.
 * @see docs/SPEC.md §3.2, §7.2
 */
(function () {
  function scrollToBookingWidget() {
    document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
  }

  function markPendingRoom(roomId) {
    const container = document.getElementById('agast-widget-container');
    if (container) {
      container.setAttribute('data-pending-room', roomId);
    }
  }

  window.Booking = {
    openRoomBooking: function (roomId) {
      if (!roomId) return;

      if (window.Analytics) {
        window.Analytics.reachGoal('room_book_click', { room_id: roomId });
      }

      if (location.pathname !== '/') {
        if (window.Router) {
          window.Router.navigate('/');
          setTimeout(function () {
            markPendingRoom(roomId);
            scrollToBookingWidget();
          }, 120);
        } else {
          location.href = '/#booking-widget';
        }
        return;
      }

      markPendingRoom(roomId);
      scrollToBookingWidget();
    },
  };

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-room-book]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    window.Booking.openRoomBooking(btn.getAttribute('data-room-book'));
  });
})();
