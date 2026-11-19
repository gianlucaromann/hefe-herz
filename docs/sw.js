/* Service Worker für Hefe & Herz: macht die Web-App offline-fähig.
   Die Liste PRECACHE und VERSION werden beim Build (scripts/sw.mjs) eingesetzt. */
const VERSION = 'd9afc2693a';
const PRECACHE = ["./apple-touch-icon-2.png","./assets/Backstube-BYSmexus.js","./assets/Checkout-IMM07qOL.js","./assets/Confirmation-CduMINBn.js","./assets/NotFound-mfx9H_I4.js","./assets/Privacy-DD_XNMKC.js","./assets/StampCardPage-CqZSejD1.js","./assets/Stores-JqlsZZEW.js","./assets/fraunces-latin-ext-wght-normal-Ca2vKHc0.woff2","./assets/fraunces-latin-wght-normal-ukD16Tqj.woff2","./assets/index-Be7ag6VZ.js","./assets/index-CpQRwZsj.css","./assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./icon-192.png","./icon-512.png","./manifest.webmanifest","./tab-icon-2-32.png","./tab-icon-2.svg"];
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
