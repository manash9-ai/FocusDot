// FocusDot — Progressive Web App Service Worker
// Version: 1.0.0

const CACHE_NAME = 'focusdot-static-v1';
const OFFLINE_URL = './offline.html';

const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon.svg'
];

// Domains and endpoints that must NEVER be cached (private user auth & Supabase data)
const EXCLUDED_PATTERNS = [
  /supabase\.co/i,
  /accounts\.google\.com/i,
  /googleapis\.com/i,
  /\/auth\//i,
  /\/rest\/v1\//i
];

// Install: Pre-cache core static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Prune outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1. Only handle GET requests
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // 2. Never cache auth, Supabase APIs, or private tokens
  if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(req.url))) {
    return;
  }

  // 3. Ignore chrome extensions or unsupported schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 4. HTML Navigation: Network-first with cache and offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(req).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 5. Static Assets (fonts, images, scripts, stylesheets): Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache, return nothing or let browser handle
        });

      return cachedResponse || fetchPromise;
    })
  );
});

