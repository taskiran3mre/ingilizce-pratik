const CACHE = 'en-pratik-v26';
const ASSETS = ['./index.html', './data.js', './learn-data.js', './learn.js', './manifest.json', './icon-192.png', './icon-512.png'];
// Önbelleğe alırken tarayıcının HTTP önbelleğini atla ({cache:'reload'}): yoksa yeni sürümün önbelleğine eski dosya girebilir.
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(a => new Request(a, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// NETWORK-FIRST: her zaman en güncel kodu getir; yalnızca çevrimdışıyken cache'e düş.
// (Cache-first idi → kod güncellemeleri kullanıcıya HİÇ ulaşmıyordu. Bu, "eski alert hâlâ çıkıyor" bug'ının köküydü.)
// Aynı kökenli dosyalar {cache:'no-cache'} ile istenir: sunucu "/" ve JS'i max-age=3600 ile gönderdiği için düz fetch()
// bir saate kadar BAYAT kopya döndürüyordu (güncelleme gecikmesi, hatta eski index.html + yeni learn.js karışımı).
// no-cache = her seferinde sunucuya sor; dosya değişmediyse 304 döner, yani hızlıdır.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firestore') || url.includes('firebase') || url.includes('googleapis') || url.includes('groq') || url.includes('tailwindcss') || url.includes('fonts')) return;
  const same = url.startsWith(self.location.origin + '/');
  let req = e.request;
  if (same) {
    try {
      // navigate modlu Request, init ile kopyalanamaz → URL'den yeni istek kur.
      req = e.request.mode === 'navigate' ? new Request(url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(e.request, { cache: 'no-cache' });
    } catch (err) { req = e.request; }
  }
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
