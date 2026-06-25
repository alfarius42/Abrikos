(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener(
    'scroll',
    function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    },
    { passive: true }
  );

  document.getElementById('btn-book')?.addEventListener('click', function () {
    if (window.Analytics) window.Analytics.reachGoal('header_book_click');

    if (location.pathname !== '/') {
      window.Router.navigate('/');
      setTimeout(scrollToBooking, 120);
    } else {
      scrollToBooking();
    }
  });

  function scrollToBooking() {
    document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (window.Analytics) window.Analytics.reachGoal('phone_click');
    });
  });
})();
