/**
 * Shared runtime bootstrap for all pages.
 */
(function () {
  function initAnalytics() {
    if (window.Analytics && typeof window.Analytics.initIfAllowed === 'function') {
      window.Analytics.initIfAllowed();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
