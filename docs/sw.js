/* Service Worker für Hefe & Herz: macht die Web-App offline-fähig.
   Die Liste PRECACHE und VERSION werden beim Build (scripts/sw.mjs) eingesetzt. */
const VERSION = '83ae8dff83';
const PRECACHE = ["./apple-touch-icon.png","./assets/Backstube-Bf2MODzL.js","./assets/Checkout-br3LQsTw.js","./assets/Confirmation-DtfCo164.js","./assets/Kreation-CB4uXpEv.js","./assets/NotFound-DQTKwr0G.js","./assets/Privacy-KtRzhBmw.js","./assets/StampCardPage-1vTvYzy6.js","./assets/Stores-BX2xDG8n.js","./assets/fraunces-latin-ext-wght-normal-Ca2vKHc0.woff2","./assets/fraunces-latin-wght-normal-ukD16Tqj.woff2","./assets/index-C6aJLGZE.css","./assets/index-DuMX8g6E.js","./assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./favicon-32.png","./favicon.svg","./icon-192.png","./icon-512.png","./manifest.webmanifest"];
const CACHE = `hefe-herz-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', ...PRECACHE])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('hefe-herz-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Seitenaufrufe: zuerst Netz (neue Version), offline aus dem Cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy));
          return res;
        })
        .catch(() => caches.match('./')),
    );
    return;
  }

  // Dateien (JS, CSS, Schriften, Icons): zuerst Cache
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
