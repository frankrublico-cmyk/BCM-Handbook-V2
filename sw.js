/* BCM Handbook service worker - para mo-install ang app ug mo-gana bisan offline */
const CACHE = 'bcm-handbook-v1';
const CORE = [
  "bec_intro.html",
  "bec_lesson1.html",
  "bec_lesson10.html",
  "bec_lesson11.html",
  "bec_lesson12.html",
  "bec_lesson13.html",
  "bec_lesson14.html",
  "bec_lesson15.html",
  "bec_lesson16.html",
  "bec_lesson17.html",
  "bec_lesson18.html",
  "bec_lesson19.html",
  "bec_lesson2.html",
  "bec_lesson20.html",
  "bec_lesson3.html",
  "bec_lesson4.html",
  "bec_lesson5.html",
  "bec_lesson6.html",
  "bec_lesson7.html",
  "bec_lesson8.html",
  "bec_lesson9.html",
  "breakeverychain.html",
  "cellexplosion.html",
  "disc_lesson1.html",
  "disc_lesson10.html",
  "disc_lesson11.html",
  "disc_lesson12.html",
  "disc_lesson2.html",
  "disc_lesson3.html",
  "disc_lesson4.html",
  "disc_lesson5.html",
  "disc_lesson6.html",
  "disc_lesson7.html",
  "disc_lesson8.html",
  "disc_lesson9.html",
  "discipleship.html",
  "evang_lesson1.html",
  "evang_lesson10.html",
  "evang_lesson11.html",
  "evang_lesson12.html",
  "evang_lesson2.html",
  "evang_lesson3.html",
  "evang_lesson4.html",
  "evang_lesson5.html",
  "evang_lesson6.html",
  "evang_lesson7.html",
  "evang_lesson8.html",
  "evang_lesson9.html",
  "evangelism.html",
  "index.html",
  "lead_intro.html",
  "lead_lesson1.html",
  "lead_lesson10.html",
  "lead_lesson11.html",
  "lead_lesson12.html",
  "lead_lesson2.html",
  "lead_lesson3.html",
  "lead_lesson4.html",
  "lead_lesson5.html",
  "lead_lesson6.html",
  "lead_lesson7.html",
  "lead_lesson8.html",
  "lead_lesson9.html",
  "leadership.html",
  "lesson1.html",
  "lesson10.html",
  "lesson11.html",
  "lesson12.html",
  "lesson2.html",
  "lesson3.html",
  "lesson4.html",
  "lesson5.html",
  "lesson6.html",
  "lesson7.html",
  "lesson8.html",
  "lesson9.html",
  "bcm-bible.js",
  "bcm-install.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-192.png",
  "icon-maskable-512.png",
  "apple-touch-icon.png",
  "favicon-64.png",
  "favicon.ico",
  "bcm.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(CORE.map((url) => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;           // Google Fonts/Translate: dili nato hilabtan

  const isImage = /\.(png|jpe?g|jfif|gif|webp|ico|svg)$/i.test(url.pathname);

  if (isImage) {
    // Hulagway: cache-first (paspas, dili na i-download balik)
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  // HTML / JS / Biblia: network-first (kanunay updated), cache kung offline
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() =>
      caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    )
  );
});
