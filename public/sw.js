// Hair Pinns kill-switch service worker.
//
// The previous service worker cache-first strategy was serving stale JS
// chunks and a stale index.html, which broke the site every time we
// shipped a new build (chunk hashes change → SW served the old chunk
// names that no longer exist on the server → ERR_FAILED across the board,
// including the chat widget's lazy-loaded files).
//
// This file replaces the old SW with one that does nothing during fetch,
// clears all caches, and unregisters itself. Browsers that already cached
// the old SW will pick this one up on next page load, run install +
// activate, wipe their stale cache, and unregister — restoring normal
// network behaviour permanently.
//
// Once you confirm everyone's clients have updated (give it a couple of
// weeks of traffic), this file can be deleted from public/ since
// main.tsx no longer registers any service worker.

self.addEventListener('install', (event) => {
  // Take over from the previous SW immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 1. Wipe every cache this origin owns.
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));

    // 2. Take control of any open pages so they reload through the network.
    await self.clients.claim();

    // 3. Unregister this service worker so future page loads don't go through
    //    the SW at all.
    await self.registration.unregister();

    // 4. Force a reload on every controlled tab so they stop using the
    //    stale assets they got from the old SW's cache.
    const allClients = await self.clients.matchAll({ type: 'window' });
    allClients.forEach((client) => client.navigate(client.url));
  })());
});

// No fetch handler — the browser goes directly to the network.
