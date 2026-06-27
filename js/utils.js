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

  function toSafeUrl(rawUrl, options) {
    if (!rawUrl) return '';

    var opts = options || {};
    var allowHttp = opts.allowHttp === true;
    var allowedHosts = Array.isArray(opts.allowedHosts) ? opts.allowedHosts : [];

    try {
      var parsed = new URL(String(rawUrl), window.location.origin);
      var protocol = parsed.protocol.toLowerCase();
      var isHttp = protocol === 'http:';
      var isHttps = protocol === 'https:';

      if (!isHttps && !(allowHttp && isHttp)) return '';

      if (allowedHosts.length) {
        var host = parsed.hostname.toLowerCase();
        var isAllowed = allowedHosts.some(function (allowed) {
          var normalized = String(allowed || '').toLowerCase();
          if (!normalized) return false;
          return host === normalized || host.endsWith('.' + normalized);
        });
        if (!isAllowed) return '';
      }

      return parsed.href;
    } catch (_) {
      return '';
    }
  }

  window.SiteUtils = {
    escapeHtml: escapeHtml,
    toSafeUrl: toSafeUrl,
  };
})();
