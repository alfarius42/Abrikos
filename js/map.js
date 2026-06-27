/**
 * Карта на главной: OpenLayers + OSM (без API-ключа) или embed/скрин из config.
 */
(function () {
  var OL_VERSION = '9.2.4';
  var OL_BASE = 'https://cdn.jsdelivr.net/npm/ol@' + OL_VERSION + '/';

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

  function toSafeUrl(rawUrl, options) {
    if (window.SiteUtils && window.SiteUtils.toSafeUrl) {
      return window.SiteUtils.toSafeUrl(rawUrl, options);
    }
    return '';
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
      var safeEmbed = toSafeUrl(cfg.yandexMapEmbedSrc, {
        allowedHosts: ['yandex.ru', 'yandex.com', 'yastatic.net'],
      });
      if (!safeEmbed) return false;

      var iframe = document.createElement('iframe');
      iframe.src = safeEmbed;
      iframe.title = 'Карта проезда - гостевой дом "Абрикос"';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');

      container.classList.remove('is-loading');
      container.textContent = '';
      container.appendChild(iframe);
      return true;
    }

    if (cfg.yandexMapImageSrc) {
      var safeImage = toSafeUrl(cfg.yandexMapImageSrc, {
        allowHttp: false,
      });
      if (!safeImage) return false;

      var image = document.createElement('img');
      image.src = safeImage;
      image.alt = 'Карта проезда - гостевой дом "Абрикос", Ейск, ул. Советов, 12';
      image.loading = 'lazy';
      image.width = 1200;
      image.height = 675;
      image.referrerPolicy = 'no-referrer';

      container.classList.remove('is-loading');
      container.textContent = '';
      container.appendChild(image);
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

      var safeHref = toSafeUrl(href, { allowedHosts: ['cdn.jsdelivr.net'] });
      if (!safeHref) {
        reject(new Error('Invalid stylesheet URL'));
        return;
      }

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = safeHref;
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
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

      var safeSrc = toSafeUrl(src, { allowedHosts: ['cdn.jsdelivr.net'] });
      if (!safeSrc) {
        reject(new Error('Invalid script URL'));
        return;
      }

      var script = document.createElement('script');
      script.src = safeSrc;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.onload = function () {
        resolve(window.ol);
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

  function refreshMapSize(map) {
    map.updateSize();
    requestAnimationFrame(function () {
      map.updateSize();
    });
  }

  function createMarkerStyle(iconSrc, isHotel) {
    var ol = window.ol;
    return new ol.style.Style({
      image: new ol.style.Icon({
        src: iconSrc,
        anchor: isHotel ? [0.5, 1] : [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        scale: isHotel ? 0.9 : 1,
      }),
      zIndex: isHotel ? 2 : 1,
    });
  }

  function buildLegend(pois, onSelect) {
    var list = document.getElementById('home-map-poi-legend');
    if (!list || !pois || !pois.length || list.dataset.ready === 'true') return;

    list.innerHTML = '';
    pois.forEach(function (poi) {
      var item = document.createElement('li');
      var button = document.createElement('button');
      var copy = document.createElement('span');
      var title = document.createElement('span');
      button.type = 'button';
      button.className = 'home-map__poi-item';
      button.setAttribute('data-poi-id', poi.id);
      copy.className = 'home-map__poi-item-copy';
      title.className = 'home-map__poi-item-title';
      title.textContent = poi.mapLabel || poi.title || '';
      copy.appendChild(title);
      if (poi.hint) {
        var hint = document.createElement('span');
        hint.className = 'home-map__poi-item-hint';
        hint.textContent = poi.hint;
        copy.appendChild(hint);
      }
      button.appendChild(copy);
      button.addEventListener('click', function () {
        onSelect(poi.id);
      });
      item.appendChild(button);
      list.appendChild(item);
    });
    list.dataset.ready = 'true';
  }

  function buildFeatures(ol, loc) {
    var pois = loc.pois || [];
    var siteName = getConfig().siteName || 'Гостевой дом «Абрикос»';
    var features = [];

    pois.forEach(function (poi) {
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([poi.lng, poi.lat])),
        featureType: 'poi',
        poiId: poi.id,
        poiTitle: poi.title,
        poiSubtitle: poi.subtitle || '',
        poiHint: poi.hint || '',
      });
      feature.setStyle(createMarkerStyle(poi.icon || '/img/map/poi-park.svg', false));
      features.push(feature);
    });

    var hotelFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([loc.lng, loc.lat])),
      featureType: 'hotel',
      poiId: 'hotel',
      poiTitle: siteName,
      poiSubtitle: loc.address || '',
      poiHint: loc.hint || '',
    });
    hotelFeature.setStyle(createMarkerStyle(loc.mapIcon || '/img/map-marker-house.svg', true));
    features.push(hotelFeature);

    return features;
  }

  function createPopupController(popupElement, popupOverlay) {
    function hide() {
      popupElement.hidden = true;
      popupElement.textContent = '';
    }

    function show(feature, coordinate) {
      var title = feature.get('poiTitle') || '';
      var subtitle = feature.get('poiSubtitle') || '';
      var hint = feature.get('poiHint') || '';
      var isHotel = feature.get('featureType') === 'hotel';
      var body = document.createElement('div');
      var close = document.createElement('button');
      var titleEl = document.createElement('p');

      body.className = 'home-map-popup__body';
      titleEl.className = 'home-map-popup__title';
      titleEl.textContent = title;
      body.appendChild(titleEl);

      if (subtitle) {
        var subtitleEl = document.createElement('p');
        subtitleEl.className = 'home-map-popup__subtitle';
        subtitleEl.textContent = subtitle;
        body.appendChild(subtitleEl);
      }

      if (hint) {
        var hintEl = document.createElement('p');
        hintEl.className = 'home-map-popup__hint';
        hintEl.textContent = hint;
        body.appendChild(hintEl);
      }

      close.type = 'button';
      close.className = 'home-map-popup__close';
      close.setAttribute('aria-label', 'Закрыть');
      close.textContent = '×';

      popupElement.classList.toggle('home-map-popup--hotel', isHotel);
      popupElement.textContent = '';
      popupElement.appendChild(body);
      popupElement.appendChild(close);
      popupElement.hidden = false;
      popupOverlay.setPosition(coordinate);
      close.addEventListener('click', hide);
    }

    return {
      hide: hide,
      show: show,
    };
  }

  function createMapInstance(container, loc, features, popupOverlay) {
    var ol = window.ol;
    return new ol.Map({
      target: container,
      overlays: [popupOverlay],
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
            features: features,
          }),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([loc.lng, loc.lat]),
        zoom: loc.zoom || 15,
        minZoom: 12,
        maxZoom: 19,
      }),
    });
  }

  function fitMapView(map, loc, pois) {
    var ol = window.ol;
    var extentCoords = [[loc.lng, loc.lat]]
      .concat(
        pois.map(function (poi) {
          return [poi.lng, poi.lat];
        })
      )
      .map(function (pair) {
        return ol.proj.fromLonLat(pair);
      });

    map.getView().fit(ol.extent.boundingExtent(extentCoords), {
      padding: [32, 32, 32, 32],
      maxZoom: loc.zoom || 15,
      duration: 0,
    });
  }

  function bindMapClick(map, popup) {
    map.on('click', function (event) {
      var feature = map.forEachFeatureAtPixel(
        event.pixel,
        function (item) {
          return item;
        },
        { hitTolerance: 10 }
      );
      if (!feature) {
        popup.hide();
        return;
      }
      popup.show(feature, event.coordinate);
    });
  }

  function bindWheelZoom(container, map) {
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
  }

  function bindPointerCursor(map, container) {
    map.on('pointermove', function (event) {
      var hit = map.hasFeatureAtPixel(event.pixel, { hitTolerance: 10 });
      container.style.cursor = hit ? 'pointer' : '';
    });
  }

  function bindResizeObserver(container, map) {
    if (!('ResizeObserver' in window)) return;
    var resizeObserver = new ResizeObserver(function () {
      refreshMapSize(map);
    });
    resizeObserver.observe(container);
  }

  function createPoiFocusHandler(map, featureById, popup) {
    return function (poiId) {
      var feature = featureById[poiId];
      if (!feature) return;

      var coordinate = feature.getGeometry().getCoordinates();
      map.getView().animate({
        center: coordinate,
        zoom: Math.max(map.getView().getZoom(), 15),
        duration: 350,
      });
      popup.show(feature, coordinate);
    };
  }

  function renderOpenLayersMap(container, loc, focusBridge) {
    var ol = window.ol;
    var pois = loc.pois || [];
    var features = buildFeatures(ol, loc);
    var featureById = {};
    var popupElement = document.createElement('div');
    var popupOverlay;
    var map;
    var popup;

    features.forEach(function (feature) {
      var id = feature.get('poiId');
      if (id) featureById[id] = feature;
    });

    popupElement.className = 'home-map-popup';
    popupElement.hidden = true;
    popupOverlay = new ol.Overlay({
      element: popupElement,
      positioning: 'bottom-center',
      offset: [0, -12],
      stopEvent: true,
    });

    map = createMapInstance(container, loc, features, popupOverlay);
    popup = createPopupController(popupElement, popupOverlay);

    if (focusBridge) {
      focusBridge.focus = createPoiFocusHandler(map, featureById, popup);
    }

    bindMapClick(map, popup);
    fitMapView(map, loc, pois);
    bindWheelZoom(container, map);
    bindPointerCursor(map, container);
    bindResizeObserver(container, map);

    container.setAttribute('tabindex', '0');
    container.classList.remove('is-loading');
    refreshMapSize(map);

    return map;
  }

  function showMapFallback(container, loc) {
    var text = document.createElement('p');
    var link = document.createElement('a');
    var yandexUrl = buildExternalLinks(loc).yandex;

    container.classList.remove('is-loading');
    container.classList.add('home-map__canvas--fallback');
    container.textContent = '';

    text.className = 'home-map__fallback';
    text.textContent = 'Карта временно недоступна. Откройте адрес во внешнем сервисе:';
    link.className = 'home-map__link';
    link.href = yandexUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Яндекс.Карты';

    container.appendChild(text);
    container.appendChild(link);
  }

  function startMap(container, loc, focusBridge) {
    if (container.dataset.mapReady === 'true') return;
    container.dataset.mapReady = 'true';
    prepareMapContainer(container);

    Promise.all([loadStylesheet(OL_BASE + 'ol.css'), loadScript(OL_BASE + 'dist/ol.js')])
      .then(function () {
        renderOpenLayersMap(container, loc, focusBridge);
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

  function scheduleInitHomeMap() {
    var run = function () {
      initHomeMap();
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      setTimeout(run, 200);
    }
  }

  document.addEventListener('DOMContentLoaded', scheduleInitHomeMap);
})();
