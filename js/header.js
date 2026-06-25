(function () {
  function getDrawerEls() {
    return {
      drawer: document.getElementById('site-drawer'),
      overlay: document.getElementById('drawer-overlay'),
      burger: document.getElementById('btn-menu'),
    };
  }

  function setDrawerOpen(open) {
    const { drawer, overlay, burger } = getDrawerEls();
    if (!drawer || !overlay) return;

    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    overlay.hidden = !open;
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.body.classList.toggle('drawer-open', open);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function setPhoneMenuOpen(open) {
    const menu = document.getElementById('phone-menu');
    const toggle = document.getElementById('btn-phone-menu');
    if (!menu || !toggle) return;

    menu.hidden = !open;
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closePhoneMenu() {
    setPhoneMenuOpen(false);
  }

  function bindShellEvents() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener(
      'scroll',
      function () {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
      },
      { passive: true }
    );

    document.getElementById('btn-menu')?.addEventListener('click', function () {
      closePhoneMenu();
      const { drawer } = getDrawerEls();
      setDrawerOpen(!drawer?.classList.contains('is-open'));
    });

    document.getElementById('btn-phone-menu')?.addEventListener('click', function (e) {
      e.stopPropagation();
      const menu = document.getElementById('phone-menu');
      const willOpen = menu?.hidden !== false;
      closeDrawer();
      setPhoneMenuOpen(willOpen);
    });

    document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);
    document.getElementById('btn-drawer-close')?.addEventListener('click', closeDrawer);

    document.getElementById('site-logo')?.addEventListener('click', function () {
      closePhoneMenu();
      if (location.pathname === '/') {
        if (window.Navigation) {
          window.Navigation.scrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (window.Navigation) {
        window.Navigation.goHomeAndScrollTop();
      } else if (window.Router) {
        window.Router.navigate('/');
      } else {
        location.href = '/';
      }
    });

    document.getElementById('btn-book')?.addEventListener('click', function () {
      if (window.Analytics) window.Analytics.reachGoal('header_book_click');
      closeDrawer();
      closePhoneMenu();

      if (location.pathname !== '/') {
        if (window.Navigation) {
          window.Navigation.goHomeAndScrollToBooking('');
        } else if (window.Router) {
          window.Router.navigate('/');
        } else {
          location.href = '/#booking-widget';
        }
      } else {
        if (window.Navigation) {
          window.Navigation.scrollToBookingWidget();
        } else {
          document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    document.querySelectorAll('.site-drawer__link[data-nav]').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (window.Analytics) window.Analytics.reachGoal('phone_click');
        closePhoneMenu();
      });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (window.Analytics) window.Analytics.reachGoal('email_click');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header__phone-dropdown')) {
        closePhoneMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDrawer();
        closePhoneMenu();
      }
    });
  }

  document.addEventListener('shellrendered', bindShellEvents);
})();
