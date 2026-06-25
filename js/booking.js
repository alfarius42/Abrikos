/**
 * Бронирование Agast — заглушка до Sprint 3.
 * @see docs/SPEC.md §3.2, §7.2
 */
(function () {
  window.Booking = {
    openRoomBooking: function (roomId) {
      if (!roomId) return;

      if (window.Analytics) {
        window.Analytics.reachGoal('room_book_click', { room_id: roomId });
      }

      if (window.Navigation) {
        window.Navigation.goHomeAndScrollToBooking(roomId);
      } else if (window.Router) {
        window.Router.navigate('/');
      } else {
        location.href = '/#booking-widget';
      }
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
