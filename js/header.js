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

    if (open) {
      requestAnimationFrame(function () {
        positionPhoneMenu();
      });
    } else {
      resetPhoneMenuPosition();
    }
  }

  function closePhoneMenu() {
    setPhoneMenuOpen(false);
  }

  var PHONE_MENU_VIEWPORT_PADDING = 16;

  function resetPhoneMenuPosition() {
    var menu = document.getElementById('phone-menu');
    if (!menu) return;

    menu.classList.remove('is-fixed');
    menu.style.top = '';
    menu.style.left = '';
    menu.style.right = '';
    menu.style.width = '';
    menu.style.maxWidth = '';
  }

  function positionPhoneMenu() {
    var menu = document.getElementById('phone-menu');
    var toggle = document.getElementById('btn-phone-menu');
    if (!menu || !toggle || menu.hidden) return;

    resetPhoneMenuPosition();

    var toggleRect = toggle.getBoundingClientRect();
    var menuWidth = menu.offsetWidth;
    var maxWidth = window.innerWidth - PHONE_MENU_VIEWPORT_PADDING * 2;

    if (menuWidth > maxWidth) {
      menuWidth = maxWidth;
      menu.style.width = maxWidth + 'px';
      menu.style.maxWidth = maxWidth + 'px';
    }

    var left = toggleRect.right - menuWidth;
    if (left < PHONE_MENU_VIEWPORT_PADDING) {
      left = PHONE_MENU_VIEWPORT_PADDING;
    }
    if (left + menuWidth > window.innerWidth - PHONE_MENU_VIEWPORT_PADDING) {
      left = window.innerWidth - PHONE_MENU_VIEWPORT_PADDING - menuWidth;
    }

    menu.classList.add('is-fixed');
    menu.style.top = toggleRect.bottom + 8 + 'px';
    menu.style.left = left + 'px';
  }

  function syncPhoneMenuPosition() {
    var menu = document.getElementById('phone-menu');
    if (menu && !menu.hidden) {
      positionPhoneMenu();
    }
  }

  var copyToastTimer;

  function isMobilePhoneLink() {
    return window.matchMedia('(max-width: 760px)').matches;
  }

  function getPhoneDisplayText(el) {
    var span = el.querySelector('span');
    return (span ? span.textContent : el.textContent).trim();
  }

  function copyPhoneText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();

      try {
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  function showCopyToast(message) {
    var toast = document.getElementById('phone-copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'phone-copy-toast';
      toast.className = 'phone-copy-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('is-visible');
    clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      toast.hidden = true;
    }, 2500);
  }

  function showPhoneCopyToast(text) {
    showCopyToast('Номер скопирован: ' + text);
  }

  function getEmailAddress(el) {
    var href = el.getAttribute('href') || '';
    if (href.toLowerCase().indexOf('mailto:') === 0) {
      return decodeURIComponent(href.slice(7).split('?')[0]).trim();
    }
    return getPhoneDisplayText(el);
  }

  function showEmailCopyToast(text) {
    showCopyToast('Адрес скопирован: ' + text);
  }

  function tryOpenMailto(href, onFallback) {
    var mailLaunched = false;

    function onBlur() {
      mailLaunched = true;
    }

    window.addEventListener('blur', onBlur, { once: true });
    window.location.href = href;

    setTimeout(function () {
      window.removeEventListener('blur', onBlur);
      if (!mailLaunched) onFallback();
    }, 500);
  }

  function bindShellEvents() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener(
      'scroll',
      function () {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
        syncPhoneMenuPosition();
      },
      { passive: true }
    );

    window.addEventListener('resize', syncPhoneMenuPosition, { passive: true });

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

    document.getElementById('site-logo')?.addEventListener('click', function (event) {
      closePhoneMenu();
      event.preventDefault();
      if (location.pathname === '/') {
        if (window.Navigation) {
          window.Navigation.scrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        if (window.Navigation) {
          window.Navigation.goHomeAndScrollTop();
        } else {
          location.href = '/';
        }
      }
    });

    document.getElementById('btn-book')?.addEventListener('click', function () {
      if (window.Analytics) window.Analytics.reachGoal('header_book_click');
      closeDrawer();
      closePhoneMenu();

      if (window.Booking) {
        window.Booking.activateBooking();
      }
    });

    document.querySelectorAll('.site-drawer__link').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (window.Analytics) window.Analytics.reachGoal('phone_click');
        closePhoneMenu();

        if (isMobilePhoneLink()) return;

        e.preventDefault();
        var label = getPhoneDisplayText(el);
        copyPhoneText(label)
          .then(function () {
            showPhoneCopyToast(label);
          })
          .catch(function () {
            showPhoneCopyToast(label);
          });
      });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (window.Analytics) window.Analytics.reachGoal('email_click');

        if (isMobilePhoneLink()) return;

        e.preventDefault();
        var href = el.getAttribute('href') || '';
        var address = getEmailAddress(el);
        var display = getPhoneDisplayText(el) || address;

        tryOpenMailto(href, function () {
          copyPhoneText(address || display)
            .then(function () {
              showEmailCopyToast(display || address);
            })
            .catch(function () {
              showEmailCopyToast(display || address);
            });
        });
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

  document.addEventListener('DOMContentLoaded', bindShellEvents);
})();
