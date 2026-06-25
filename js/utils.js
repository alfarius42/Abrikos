/**
 * Shared utility helpers.
 */
(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.SiteUtils = {
    escapeHtml: escapeHtml,
  };
})();
