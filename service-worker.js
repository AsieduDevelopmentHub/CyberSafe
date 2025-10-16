// Simple service worker - cache first for static assets (small PWA helper)
const CACHE = 'cybersafe-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/auth.css',
  '/styles/dashboard.css',
  '/assets/icons/logo.svg',
  '/assets/icons/google.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(fetchRes => {
      // optionally cache new requests
      return fetchRes;
    }))
  );
});