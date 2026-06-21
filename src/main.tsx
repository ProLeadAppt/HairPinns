import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister any leftover service worker from a previous deploy.
//
// We used to ship a cache-first SW, but it served stale JS chunks across
// deploys (chunk hashes change → users got 404s on the old chunk names
// → site broke). public/sw.js is now a kill-switch that wipes its cache
// and unregisters itself. The handshake:
//   - SW activates, sends 'sw-killswitch-reload' postMessage to every tab
//   - This page receives that message and force-reloads with a cache-buster
//     query param to bypass HTTP cache (not just SW cache). Without the
//     cache-buster, browsers happily re-serve the old immutable JS chunks
//     from disk and the site stays broken even after the SW is gone.
// Once everyone has rotated through, public/sw.js can be deleted entirely.
if ('serviceWorker' in navigator) {
  // Listen for the kill-switch reload signal.
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'sw-killswitch-reload') {
      // Cache-buster query forces a network round-trip for index.html, which
      // pulls in the fresh asset hashes. Once we land on the bustered URL,
      // strip the param so subsequent loads don't carry it forever.
      const url = new URL(window.location.href);
      if (!url.searchParams.has('__sw_killed')) {
        url.searchParams.set('__sw_killed', String(Date.now()));
        window.location.replace(url.toString());
      }
    }
  });

  // Defensive cleanup: unregister any SW + clear caches at boot, even if
  // the kill-switch SW didn't fire its activate handler for some reason.
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister().catch(() => {}));
  }).catch(() => {});
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
  }

  // If we just landed via the cache-buster, clean the URL up.
  if (new URL(window.location.href).searchParams.has('__sw_killed')) {
    const clean = new URL(window.location.href);
    clean.searchParams.delete('__sw_killed');
    window.history.replaceState({}, '', clean.toString());
  }
}

if (import.meta.env.DEV) {
  import("./lib/shopifySanityCheck").catch((error) => {
    console.warn("Shopify sanity check skipped:", error);
  });
}

// Error boundary for React render
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to render React app:", error);
  // Display error to user
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui; text-align: center;">
        <h1>Application Error</h1>
        <p>Failed to load the application.</p>
        <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; text-align: left; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}
