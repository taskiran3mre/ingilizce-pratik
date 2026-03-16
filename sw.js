const CACHE = 'en-pratik-v2';
const ASSETS = ['./index.html', './data.js', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; if (e.request.url.includes('firestore') || e.request.url.includes('firebase') || e.request.url.includes('googleapis') || e.request.url.includes('groq') || e.request.url.includes('tailwindcss') || e.request.url.includes('fonts')) return; e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } return res; }))); });
