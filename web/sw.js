const CACHE_NAME = 'quran-v2';
const urlsToCache = [
  '/Quran/',
  '/Quran/index.html',
  '/Quran/app.js',
  '/Quran/data.js',
  '/Quran/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
