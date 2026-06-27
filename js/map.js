/**
 * Карта на главной: Leaflet 1.8 + OSM (лёгкая загрузка) или embed/скрин из config.
 */
(function () {
  var LEAFLET_VERSION = '1.8.0';
  var LEAFLET_BASE = 'https://unpkg.com/leaflet@' + LEAFLET_VERSION + '/dist/';

  function getConfig() {
    return window.SITE_CONFIG || {};
  }

  function getLocationConfig() {
    var cfg = getConfig();
    return cfg.location || null;
  }

  function escapeHtml(value) {
    if (window.SiteUtils && window.SiteUtils.escapeHtml) {
      return window.SiteUtils.escapeHtml(value);
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildExternalLinks(loc) {
    var lat = loc.lat;
    var lng = loc.lng;
    var query = encodeURIComponent(loc.address || '');

    return {
      yandex: 'https://yandex.ru/maps/?pt=' + lng + ',' + lat + '&z=17&l=map',
      gis: 'https://2gis.ru/yeisk/search/' + query,
      osm: 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=17/' + lat + '/' + lng,
    };
  }

  function setExternalLinks(loc) {
    var links = buildExternalLinks(loc);
    var yandex = document.getElementById('home-map-link-yandex');
    var gis = document.getElementById('home-map-link-2gis');
    var osm = document.getElementById('home-map-link-osm');

    if (yandex) yandex.href = links.yandex;
    if (gis) gis.href = links.gis;
    if (osm) osm.href = links.osm;
  }

  function renderConfiguredMap(container) {
    var cfg = getConfig();

    if (cfg.yandexMapEmbedSrc) {
      container.classList.remove('is-loading');
      container.innerHTML =
        '<iframe src="' +
        String(cfg.yandexMapEmbedSrc) +
        '" title="Карта проезда — гостевой дом «Абрикос»" loading="lazy" allowfullscreen></iframe>';
      return true;
    }

    if (cfg.yandexMapImageSrc) {
      container.classList.remove('is-loading');
      container.innerHTML =
        '<img src="' +
        String(cfg.yandexMapImageSrc) +
        '" alt="Карта проезда — гостевой дом «Абрикос», Ейск, ул. Советов, 12" loading="lazy" width="1200" height="675" />';
      return true;
    }

    return false;
  }

  function loadStylesheet(href) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('link[data-leaflet-css="true"]')) {
        resolve();
        return;
      }

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-leaflet-css', 'true');
      link.onload = function () {
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.L) {
        resolve(window.L);
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = function () {
        resolve(window.L);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function prepareMapContainer(container) {
    container.style.height = '380px';
    container.style.minHeight = '380px';
    container.classList.add('is-loading');
  }

  function createLabelIcon(label, isHotel) {
    return window.L.divIcon({
      className: 'home-map-label' + (isHotel ? ' home-map-label--hotel' : ''),
      html: '<span class="home-map-label__text">' + escapeHtml(label) + '</span>',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  function buildLegend(pois, onSelect) {
    var list = document.getElementById('home-map-poi-legend');
    if (!list || !pois || !pois.length || list.dataset.ready === 'true') return;

    list.innerHTML = '';
    pois.forEach(function (poi) {
      var item = document.createElement('li');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'home-map__poi-item';
      button.setAttribute('data-poi-id', poi.id);
      button.innerHTML =
        '<span class="home-map__poi-item-copy">' +
        '<span class="home-map__poi-item-title">' +
        escapeHtml(poi.mapLabel || poi.title) +
        '</span>' +
        (poi.hint ? '<span class="home-map__poi-item-hint">' + escapeHtml(poi.hint) + '</span>' : '') +
        '</span>';
      button.addEventListener('click', function () {
        onSelect(poi.id);
      });
      item.appendChild(button);
      list.appendChild(item);
    });
    list.dataset.ready = 'true';
  }

  function renderLeafletMap(container, loc, focusPoiHandler) {
    var L = window.L;
    var pois = loc.pois || [];
    var siteName = getConfig().siteName || 'Гостевой дом «Абрикос»';
    var hotelLabel = loc.mapLabel || '«Абрикос»';

    var map = L.map(container, {
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var markers = [];
    var markerById = {};

    pois.forEach(function (poi) {
      var marker = L.marker([poi.lat, poi.lng], {
        icon: createLabelIcon(poi.mapLabel || poi.title, false),
      }).addTo(map);
      markers.push(marker);
      markerById[poi.id] = marker;
    });

    var hotelMarker = L.marker([loc.lat, loc.lng], {
      icon: createLabelIcon(hotelLabel, true),
      zIndexOffset: 1000,
    }).addTo(map);
    markers.push(hotelMarker);

    if (markers.length) {
      map.fitBounds(L.featureGroup(markers).getBounds(), {
        padding: [28, 28],
        maxZoom: loc.zoom || 15,
      });
    } else {
      map.setView([loc.lat, loc.lng], loc.zoom || 15);
    }

    function focusPoi(poiId) {
      var marker = markerById[poiId];
      if (!marker) return;
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), { animate: true });
      marker.openTooltip();
    }

    if (focusPoiHandler) {
      focusPoiHandler.focus = focusPoi;
    }

    pois.forEach(function (poi) {
      var marker = markerById[poi.id];
      if (!marker) return;
      var tooltip = [poi.title, poi.subtitle, poi.hint].filter(Boolean).join(' · ');
      marker.bindTooltip(tooltip, {
        direction: 'top',
        offset: [0, -4],
        opacity: 0.95,
        className: 'home-map-tooltip',
      });
    });

    hotelMarker.bindTooltip([siteName, loc.address, loc.hint].filter(Boolean).join(' · '), {
      direction: 'top',
      offset: [0, -4],
      opacity: 0.95,
      className: 'home-map-tooltip home-map-tooltip--hotel',
    });

    container.addEventListener(
      'wheel',
      function (event) {
        if (!container.matches(':focus-within')) return;
        event.preventDefault();
        var delta = event.deltaY > 0 ? map.getZoom() - 1 : map.getZoom() + 1;
        map.setZoom(delta);
      },
      { passive: false }
    );

    container.setAttribute('tabindex', '0');
    container.classList.remove('is-loading');

    requestAnimationFrame(function () {
      map.invalidateSize();
    });

    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(function () {
        map.invalidateSize();
      });
      resizeObserver.observe(container);
    }

    return map;
  }

  function showMapFallback(container, loc) {
    container.classList.remove('is-loading');
    container.classList.add('home-map__canvas--fallback');
    container.innerHTML =
      '<p class="home-map__fallback">Карта временно недоступна. Откройте адрес во внешнем сервисе:</p>' +
      '<a class="home-map__link" href="' +
      buildExternalLinks(loc).yandex +
      '" target="_blank" rel="noopener noreferrer">Яндекс.Карты</a>';
  }

  function startMap(container, loc, focusPoiHandler) {
    if (container.dataset.mapReady === 'true') return;
    container.dataset.mapReady = 'true';
    prepareMapContainer(container);

    Promise.all([loadStylesheet(LEAFLET_BASE + 'leaflet.css'), loadScript(LEAFLET_BASE + 'leaflet.js')])
      .then(function () {
        renderLeafletMap(container, loc, focusPoiHandler);
      })
      .catch(function () {
        showMapFallback(container, loc);
      });
  }

  function initHomeMap() {
    var container = document.getElementById('home-map-canvas');
    var loc = getLocationConfig();
    if (!container || !loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
      return;
    }

    setExternalLinks(loc);

    var focusBridge = { focus: function () {} };
    buildLegend(loc.pois || [], function (poiId) {
      focusBridge.focus(poiId);
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (container.dataset.mapReady !== 'true') {
        startMap(container, loc, focusBridge);
      }
    });

    if (renderConfiguredMap(container)) {
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          if (
            entries.some(function (entry) {
              return entry.isIntersecting;
            })
          ) {
            observer.disconnect();
            startMap(container, loc, focusBridge);
          }
        },
        { rootMargin: '160px 0px' }
      );
      observer.observe(container);
    } else {
      startMap(container, loc, focusBridge);
    }
  }

  document.addEventListener('DOMContentLoaded', initHomeMap);
})();
