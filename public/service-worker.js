/*
 *
 */
'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v7';
const DATA_CACHE_NAME = 'data-cache-v2';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  // Se non abbiamo cache .. '/offline.html'
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/scripts/luxon.min.js',
  '/styles/inline.css',
  '/images/add.svg',
  '/images/clear-day.svg',
  '/images/clear-night.svg',
  '/images/cloudy.svg',
  '/images/fog.svg',
  '/images/hail.svg',
  '/images/install.svg',
  '/images/partly-cloudy-day.svg',
  '/images/partly-cloudy-night.svg',
  '/images/rain.svg',
  '/images/refresh.svg',
  '/images/sleet.svg',
  '/images/snow.svg',
  '/images/thunderstorm.svg',
  '/images/tornado.svg',
  '/images/wind.svg',
  '/images/ow/01d.png',
  '/images/ow/01n.png',
  '/images/ow/02d.png',
  '/images/ow/02n.png',
  '/images/ow/03d.png',
  '/images/ow/03n.png',
  '/images/ow/04d.png',
  '/images/ow/04n.png',
  '/images/ow/09d.png',
  '/images/ow/09n.png',
  '/images/ow/10d.png',
  '/images/ow/10n.png',
  '/images/ow/11d.png',
  '/images/ow/11n.png',
  '/images/ow/13d.png',
  '/images/ow/13n.png',
  '/images/ow/50d.png',
  '/images/ow/50n.png'
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[sw] Fetch/Cache ', evt.request.url);
  // console.log('[sw] Mode ', evt.request.mode);

  // CODELAB: Add fetch event handler here.
  /* Original code
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('offline.html');
                });
          })
  ); */
  
  //SM Nuova gestione con il recupero dei dati in cache
  // if (evt.request.url.includes('/forecast/')) 
  if (evt.request.url.includes('openweathermap')) 
  {
    console.log('[Service Worker][fetch] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                // If the response was good, clone it and store it in the cache.
                console.log("[fetch] status: "+response.status)
                if (response.status === 200) {
                  console.log("[fetch] .. add to cache")
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              })
              .catch((err) => {
                // Network request failed, try to get it from the cache.
                console.log(".. network failed, get from cache ..")
                return cache.match(evt.request);
              });
        }));
    return;
  }
  evt.respondWith(
      caches.open(CACHE_NAME).then( (cache) => {
        return cache.match(evt.request)
            .then((response) => {
              console.log("[fetch] caches open match")
              return response || fetch(evt.request);
            });
      })
  );
});
