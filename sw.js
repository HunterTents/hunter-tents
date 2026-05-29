// Hunter Tents & Events — Service Worker v2
const CACHE_NAME = 'hunter-tents-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon192.png',
  './icon512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Delete ALL old caches on activate
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Always network first for the main HTML page
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./index.html')));
    return;
  }
  // Network first for API calls
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // Cache first for other assets
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
