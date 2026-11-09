const CACHE='vydoh-4-1-1-release-candidate';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('vydoh-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(req.mode==='navigate'){
   try{const response=await fetch(req);if(response.ok)await cache.put(new URL('index.html',self.registration.scope),response.clone());return response}
   catch{return await cache.match(new URL('index.html',self.registration.scope))||Response.error()}
  }
  const cached=await cache.match(req);if(cached)return cached;
  try{const response=await fetch(req);if(response.ok&&response.type==='basic')await cache.put(req,response.clone());return response}catch{return Response.error()}
 })());
});
