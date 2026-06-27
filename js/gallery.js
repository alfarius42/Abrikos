/**
 * Room detail gallery interactions for static pages.
 */
(function () {
  function bindGallery(root) {
    const mainImage = root.querySelector('[data-gallery-main]');
    if (!mainImage) return;

    root.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const nextSrc = thumb.getAttribute('data-target-image');
        if (!nextSrc) return;

        mainImage.setAttribute('src', nextSrc);
        root.querySelectorAll('[data-gallery-thumb]').forEach(function (item) {
          item.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-gallery-root]').forEach(bindGallery);
  });
})();
