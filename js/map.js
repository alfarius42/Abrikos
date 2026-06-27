/**
 * Карта на главной: OpenLayers + OpenStreetMap (без API-ключа) или embed/скрин из config.
 */
(function () {
  var OL_VERSION = '9.2.4';
  var OL_BASE = 'https://cdn.jsdelivr.net/npm/ol@' + OL_VERSION + '/';
  var MARKER_SRC = '/img/map-marker-house.svg';

  function getConfig() {
    return window.SITE_CONFIG || {};
  }

  function getLocationConfig() {
    var cfg = getConfig();
    return cfg.location || null;
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
      container.innerHTML =
        '<iframe src="' +
        String(cfg.yandexMapEmbedSrc) +
        '" title="Карта проезда — гостевой дом «Абрикос»" loading="lazy" allowfullscreen></iframe>';
      return true;
    }

    if (cfg.yandexMapImageSrc) {
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
      if (document.querySelector('link[data-ol-css="true"]')) {
        resolve();
        return;
      }

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-ol-css', 'true');
      link.onload = function () {
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.ol) {
        resolve(window.ol);
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = function () {
        resolve(window.ol);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function prepareMapContainer(container) {
    var width = container.offsetWidth || container.parentElement?.offsetWidth || 0;
    if (width > 0) {
      container.style.height = Math.round((width * 3) / 4) + 'px';
    } else {
      container.style.minHeight = '280px';
    }
  }

  function refreshMapSize(map) {
    map.updateSize();
    requestAnimationFrame(function () {
      map.updateSize();
    });
  }

  function renderOpenLayersMap(container, loc) {
    var ol = window.ol;
    var center = ol.proj.fromLonLat([loc.lng, loc.lat]);

    var markerFeature = new ol.Feature({
      geometry: new ol.geom.Point(center),
      name: getConfig().siteName || 'Гостевой дом «Абрикос»',
    });

    markerFeature.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: MARKER_SRC,
          scale: 1,
        }),
      })
    );

    var map = new ol.Map({
      target: container,
      controls: ol.control.defaults.defaults({
        attribution: true,
        zoom: true,
        rotate: false,
      }),
      interactions: ol.interaction.defaults.defaults({
        mouseWheelZoom: false,
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [markerFeature],
          }),
        }),
      ],
      view: new ol.View({
        center: center,
        zoom: loc.zoom || 16,
        minZoom: 12,
        maxZoom: 19,
      }),
    });

    container.addEventListener(
      'wheel',
      function (event) {
        if (!container.matches(':focus-within')) return;
        event.preventDefault();
        var delta = event.deltaY > 0 ? -1 : 1;
        var view = map.getView();
        view.setZoom(view.getZoom() + delta);
      },
      { passive: false }
    );

    container.setAttribute('tabindex', '0');
    refreshMapSize(map);

    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(function () {
        refreshMapSize(map);
      });
      resizeObserver.observe(container);
    }

    return map;
  }

  function showMapFallback(container, loc) {
    container.classList.add('home-map__canvas--fallback');
    container.innerHTML =
      '<p class="home-map__fallback">Карта временно недоступна. Откройте адрес во внешнем сервисе:</p>' +
      '<a class="home-map__link" href="' +
      buildExternalLinks(loc).yandex +
      '" target="_blank" rel="noopener noreferrer">Яндекс.Карты</a>';
  }

  function initHomeMap() {
    var container = document.getElementById('home-map-canvas');
    var loc = getLocationConfig();
    if (!container || !loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
      return;
    }

    setExternalLinks(loc);

    if (renderConfiguredMap(container)) {
      return;
    }

    prepareMapContainer(container);

    Promise.all([loadStylesheet(OL_BASE + 'ol.css'), loadScript(OL_BASE + 'dist/ol.js')])
      .then(function () {
        renderOpenLayersMap(container, loc);
      })
      .catch(function () {
        showMapFallback(container, loc);
      });
  }

  document.addEventListener('DOMContentLoaded', initHomeMap);
})();
