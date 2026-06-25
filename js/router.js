/**
 * History API router — см. HANDOFF §8.3
 */
(function () {
  function matchRoute(pathname) {
    if (pathname === '/') return { name: 'home' };
    if (pathname === '/rooms') return { name: 'rooms' };
    if (pathname === '/privacy') return { name: 'privacy' };
    if (pathname === '/price') return { name: 'price' };
    const roomMatch = pathname.match(/^\/rooms\/([^/]+)$/);
    if (roomMatch) return { name: 'room', id: roomMatch[1] };
    return { name: 'notFound' };
  }

  function renderRoute(pathname) {
    const route = matchRoute(pathname);
    const root = document.getElementById('app-main');
    if (!root || typeof window.renderPage !== 'function') return;

    window.renderPage(route, root);
    document.dispatchEvent(new CustomEvent('routechange', { detail: { pathname, route } }));

    if (window.Analytics) {
      window.Analytics.trackPage(pathname);
    }

    if (route.name === 'room' && window.Analytics) {
      window.Analytics.reachGoal('room_view', { room_id: route.id });
    }

    updateMeta(pathname, route);
  }

  function updateMeta(pathname, route) {
    const cfg = window.SITE_CONFIG || {};
    const base = cfg.siteName || 'Гостевой дом «Абрикос»';
    let title = base;
    let description =
      'Гостевой дом «Абрикос» в Ейске — уютный отдых на Азовском море. Номера, онлайн-бронирование.';

    if (route.name === 'rooms') {
      title = `${base} — Наши номера`;
    } else if (route.name === 'room') {
      const room = (window.SITE_DATA?.rooms || []).find(function (r) {
        return r.id === route.id;
      });
      if (room) title = `${base} — ${room.name}`;
    } else if (route.name === 'privacy') {
      title = `${base} — Политика ПД`;
    } else if (route.name === 'price') {
      title = `${base} — Прайс-лист`;
    }

    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && cfg.siteUrl) {
      canonical.setAttribute('href', cfg.siteUrl.replace(/\/$/, '') + pathname);
    }
  }

  window.Router = {
    navigate: function (path) {
      history.pushState({}, '', path);
      renderRoute(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },

    start: function () {
      document.addEventListener('click', function (e) {
        const link = e.target.closest('[data-nav]');
        if (!link) return;
        e.preventDefault();
        window.Router.navigate(link.getAttribute('href') || '/');
      });

      window.addEventListener('popstate', function () {
        renderRoute(location.pathname);
      });

      renderRoute(location.pathname);
    },
  };
})();
