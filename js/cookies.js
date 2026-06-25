(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const KEY = 'cookie-consent';

  function hide() {
    banner.hidden = true;
  }

  function show() {
    banner.hidden = false;
  }

  try {
    if (localStorage.getItem(KEY)) hide();
    else show();
  } catch {
    show();
  }

  document.getElementById('cookie-accept')?.addEventListener('click', function () {
    try {
      localStorage.setItem(KEY, 'accepted');
    } catch (_) {}
    hide();
    if (window.Analytics) {
      window.Analytics.onConsentAccepted();
      window.Analytics.reachGoal('cookie_accept');
    }
  });

  document.getElementById('cookie-decline')?.addEventListener('click', function () {
    try {
      localStorage.setItem(KEY, 'declined');
    } catch (_) {}
    hide();
  });
})();
