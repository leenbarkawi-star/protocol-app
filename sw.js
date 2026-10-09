const CACHE='protocol-v3';
const SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
const FONT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(FONT_HOSTS.includes(url.hostname)){
    // Fonts rarely change: serve the saved copy first so the app looks right offline.
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')c.put(e.request,r.clone());return r}))));
    return;
  }
  if(url.origin!==location.origin)return;
  // Network first, so updates and new meal plans arrive whenever the phone is online; the cache is the offline fallback.
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
