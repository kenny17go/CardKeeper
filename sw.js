/* CardKeeper v5 Stable service worker */
const CACHE_NAME = 'cardkeeper-shell-import-5.3.1';
const SHELL_FILES = [
  './','./index.html','./css/style.css','./js/db.js','./js/parse.js',
  './js/vision.js','./js/ocr.js','./js/vcard.js','./js/camera.js','./js/ai-batch.js','./js/app.js',
  './manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  // Only navigations may fall back to index.html. Never return HTML for a missing JS/CSS/image.
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      if(res.ok) caches.open(CACHE_NAME).then(c=>c.put('./index.html',res.clone()));
      return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>{
    const network=fetch(req).then(res=>{
      if(res.ok) caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));
      return res;
    });
    return cached || network;
  }));
});