/**
 * Gallery interactions for room detail and territory pages.
 * Supports thumb switching and optional slider (prev/next, captions, keyboard).
 */
(function () {
  function getSlides(root) {
    return Array.prototype.slice
      .call(root.querySelectorAll('[data-gallery-thumb]'))
      .map(function (thumb) {
        return {
          src: thumb.getAttribute('data-target-image'),
          alt: thumb.querySelector('img') ? thumb.querySelector('img').getAttribute('alt') || '' : '',
          caption: thumb.getAttribute('data-gallery-caption') || '',
          thumb: thumb,
        };
      })
      .filter(function (slide) {
        return Boolean(slide.src);
      });
  }

  function hydrateLazyImages(root) {
    root.querySelectorAll('img[data-src]').forEach(function (img) {
      if (!img.getAttribute('src')) {
        img.setAttribute('src', img.getAttribute('data-src'));
      }
    });
  }

  function bindGallery(root) {
    var mainImage = root.querySelector('[data-gallery-main]');
    if (!mainImage) return;

    hydrateLazyImages(root);
    var captionEl = root.querySelector('[data-gallery-caption]');
    var counterEl = root.querySelector('[data-gallery-counter]');
    var prevBtn = root.querySelector('[data-gallery-prev]');
    var nextBtn = root.querySelector('[data-gallery-next]');
    var slides = getSlides(root);
    var currentIndex = 0;
    var isSlider = root.hasAttribute('data-gallery-slider');

    function findIndexByThumb(thumb) {
      for (var i = 0; i < slides.length; i += 1) {
        if (slides[i].thumb === thumb) return i;
      }
      return 0;
    }

    function findActiveIndex() {
      var active = root.querySelector('[data-gallery-thumb].is-active');
      return active ? findIndexByThumb(active) : 0;
    }

    function setActiveThumb(index) {
      slides.forEach(function (slide, i) {
        slide.thumb.classList.toggle('is-active', i === index);
      });
    }

    function goTo(index, preloadAdjacent) {
      if (!slides.length) return;

      currentIndex = (index + slides.length) % slides.length;
      var slide = slides[currentIndex];

      if (mainImage.getAttribute('src') !== slide.src) {
        mainImage.setAttribute('src', slide.src);
      }
      if (slide.alt) mainImage.setAttribute('alt', slide.alt);
      if (captionEl) captionEl.textContent = slide.caption;
      if (counterEl) counterEl.textContent = currentIndex + 1 + ' / ' + slides.length;
      setActiveThumb(currentIndex);
      if (isSlider && preloadAdjacent !== false) preloadAdjacentSlides();
    }

    function preloadAdjacentSlides() {
      if (!slides.length) return;
      var nextIndex = (currentIndex + 1) % slides.length;
      var prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      [slides[nextIndex].src, slides[prevIndex].src].forEach(function (src) {
        var img = new Image();
        img.src = src;
      });
    }

    slides.forEach(function (slide, index) {
      slide.thumb.addEventListener('click', function () {
        goTo(index);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(currentIndex + 1);
      });
    }

    if (isSlider) {
      root.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(currentIndex - 1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(currentIndex + 1);
        }
      });

      var touchStartX = 0;
      var touchStartY = 0;
      var swipeThreshold = 48;

      root.addEventListener(
        'touchstart',
        function (event) {
          if (!event.changedTouches.length) return;
          touchStartX = event.changedTouches[0].clientX;
          touchStartY = event.changedTouches[0].clientY;
        },
        { passive: true }
      );

      root.addEventListener(
        'touchend',
        function (event) {
          if (!event.changedTouches.length) return;
          var deltaX = event.changedTouches[0].clientX - touchStartX;
          var deltaY = event.changedTouches[0].clientY - touchStartY;
          if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;
          if (deltaX < 0) {
            goTo(currentIndex + 1);
          } else {
            goTo(currentIndex - 1);
          }
        },
        { passive: true }
      );

      root.setAttribute('tabindex', '0');
    }

    currentIndex = findActiveIndex();
    if (isSlider && slides.length) {
      goTo(currentIndex, false);
    }
  }

  function initGalleries() {
    var roots = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-root]'));
    if (!roots.length) return;

    if (!('IntersectionObserver' in window)) {
      roots.forEach(bindGallery);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var root = entry.target;
          observer.unobserve(root);
          bindGallery(root);
        });
      },
      { rootMargin: '240px 0px' }
    );

    roots.forEach(function (root) {
      observer.observe(root);
    });
  }

  document.addEventListener('DOMContentLoaded', initGalleries);
})();
