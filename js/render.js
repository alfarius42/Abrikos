/**
 * Render facade for route -> page module mapping.
 */
(function () {
  function renderNotFound(root) {
    const fallback = window.RenderShared?.renderNotFound;
    root.innerHTML = fallback
      ? fallback()
      : '<section class="page-not-found"><div class="container"><h2>Страница не найдена</h2></div></section>';
  }

  window.renderPage = function (route, root) {
    const pageRenderers = window.PageRenderers || {};
    const renderer = pageRenderers[route.name];

    if (!renderer) {
      renderNotFound(root);
      return;
    }

    renderer(root, route);
  };
})();
