/*
 * Service worker.
 *
 * The app makes no network calls at runtime — the ingredient database ships in
 * the bundle and everything is stored locally. So the only job here is to keep
 * the app shell available offline, forever, with no staleness games.
 *
 * PRECACHE and VERSION are rewritten at build time by scripts/build-sw.mjs.
 * VERSION is derived from the built file names, so it only changes when the
 * output actually changes.
 */

const VERSION = '__BUILD_VERSION__'
const PRECACHE = __PRECACHE_URLS__
const CACHE = `mealplan-${VERSION}`

/*
 * ignoreVary is not optional here. Some static hosts answer with
 * `Vary: Origin`, and Cache API matching honours Vary by default: the entry
 * gets stored against a header-less install request and then misses on the
 * real page request, which silently drops the app back to the network — the
 * one thing that is not there when offline. This app serves one origin and
 * does no content negotiation, so Vary carries no meaning for it.
 */
const MATCH_OPTIONS = { ignoreVary: true, ignoreSearch: true }

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      // addAll fails the whole install if any single request fails; add them
      // individually so one bad asset cannot leave the app with no cache.
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }))
          } catch {
            /* skip this one */
          }
        }),
      )
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names.filter((n) => n.startsWith('mealplan-') && n !== CACHE).map((n) => caches.delete(n)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigations always resolve to the cached shell — this is a single-page app
  // with no server, so any in-scope URL is the same document.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE)
        const shell = await cache.match('./index.html', MATCH_OPTIONS)
        if (shell) return shell
        try {
          return await fetch(request)
        } catch {
          return new Response('Offline and no cached copy of the app is available yet.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      const hit = await cache.match(request, MATCH_OPTIONS)
      if (hit) return hit
      try {
        const response = await fetch(request)
        if (response.ok && response.type === 'basic') cache.put(request, response.clone())
        return response
      } catch {
        return new Response('', { status: 504 })
      }
    })(),
  )
})
