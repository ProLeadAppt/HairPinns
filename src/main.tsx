import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/shopifySanityCheck";

// Unregister any leftover service worker from a previous deploy.
//
// We used to ship a cache-first SW, but it served stale JS chunks across
// deploys (chunk hashes change → users got 404s on the old chunk names
// → site broke). public/sw.js is now a kill-switch that wipes its cache
// and unregisters itself. We also nuke any registration here in case a
// browser somehow held on to the old one without picking up the new SW.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister().catch(() => {}));
  }).catch(() => {});
  // Also clear any caches the old SW left behind.
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
  }
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
