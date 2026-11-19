/* Service Worker für Hefe & Herz: macht die Web-App offline-fähig.
   Die Liste PRECACHE und VERSION werden beim Build (scripts/sw.mjs) eingesetzt. */
const VERSION = '333e18c95a';
const PRECACHE = ["./apple-touch-icon-2.png","./assets/Backstube-CiMoZMfY.js","./assets/Checkout-D5wBTIXm.js","./assets/Confirmation-B9v6OWtR.js","./assets/NotFound-CFRwcIFt.js","./assets/Privacy-CXHdZZ5p.js","./assets/StampCardPage-BS1v8F8u.js","./assets/Stores-BivAAX_m.js","./assets/fraunces-latin-ext-wght-normal-Ca2vKHc0.woff2","./assets/fraunces-latin-wght-normal-ukD16Tqj.woff2","./assets/index-Be1t9B7U.js","./assets/index-D_9QVvCI.css","./assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./icon-192.png","./icon-512.png","./manifest.webmanifest","./tab-icon-2-32.png","./tab-icon-2.svg"];
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
