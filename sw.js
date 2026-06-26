const CACHE = 'en-pratik-v9';
const ASSETS = ['./index.html', './data.js', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// NETWORK-FIRST: her zaman en güncel kodu getir; yalnızca çevrimdışıyken cache'e düş.
// (Cache-first idi → kod güncellemeleri kullanıcıya HİÇ ulaşmıyordu. Bu, "eski alert hâlâ çıkıyor" bug'ının köküydü.)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firestore') || url.includes('firebase') || url.includes('googleapis') || url.includes('groq') || url.includes('tailwindcss') || url.includes('fonts')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
