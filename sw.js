/* =========================================================
   sw.js — app-shell cache so CardKeeper works offline
   (all card DATA lives in IndexedDB, not in this cache)
   ========================================================= */
const CACHE_NAME = 'cardkeeper-shell-v4';
const SHELL_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/db.js',
  './js/parse.js',
  './js/vision.js',
  './js/ocr.js',
  './js/vcard.js',
  './js/camera.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never try to cache/intercept cross-origin CDN calls (e.g. Tesseract, fonts) —
  // let the browser handle those directly so OCR keeps working normally.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
