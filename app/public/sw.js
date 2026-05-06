const CACHE_VERSION = 'v2'
const CACHE_NAME = `lifedash-${CACHE_VERSION}`

self.addEventListener('install', (event) => {
  const base = self.registration.scope
  const assets = [
    base,
    base + 'manifest.webmanifest',
    base + 'favicon.svg',
  ]
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          return response
        })
        .catch(() => caches.match(self.registration.scope + 'index.html'))
    })
  )
})
