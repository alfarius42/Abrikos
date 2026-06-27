/**
 * Обёртки Яндекс.Метрики — цели из HANDOFF §7.3
 */
(function () {
  const cfg = window.SITE_CONFIG || {};

  function getId() {
    return cfg.yandexMetrikaId;
  }

  function canTrack() {
    const id = getId();
    if (!id) return false;
    if (!cfg.metrikaRequiresConsent) return true;
    try {
      return localStorage.getItem('cookie-consent') === 'accepted';
    } catch {
      return false;
    }
  }

  function initMetrika() {
    const id = getId();
    if (!id || typeof window.ym === 'function') return;

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(Number(id), 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }

  window.Analytics = {
    initIfAllowed: function () {
      if (canTrack()) {
        initMetrika();
        this.trackPage(location.pathname);
      }
    },

    trackPage: function (url) {
      if (!canTrack() || typeof window.ym === 'undefined') return;
      window.ym(Number(getId()), 'hit', url);
    },

    reachGoal: function (name, params) {
      if (!canTrack() || typeof window.ym === 'undefined') return;
      window.ym(Number(getId()), 'reachGoal', name, params);
    },

    onConsentAccepted: function () {
      initMetrika();
    },
  };
})();
