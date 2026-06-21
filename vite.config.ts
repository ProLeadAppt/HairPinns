import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
//
// Prerender is intentionally NOT wired into the bundler. We use
// scripts/prerender.mjs as a separate post-build step (see package.json).
// Rationale:
//   - The old @prerenderer/rollup-plugin hard-fails on any route timeout.
//     With 267 routes (many of which fetch live Shopify data) a single slow
//     network response killed the build at 2m10s with 0 routes shipped.
//   - Decoupling prerender from vite means build → deploy is fast, and
//     prerender failures degrade gracefully (the SPA shell still ships).
//   - Per-route metrics (time, bytes, schema count) live in
//     dist/prerender-report.json for monitoring.
export default defineConfig(() => {
  return {
    server: {
      host: "::",
      port: 5173,
      strictPort: false,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
              if (id.includes('framer-motion')) return 'framer-motion';
              if (id.includes('@radix-ui')) return 'ui-vendor';
              if (id.includes('recharts')) return 'recharts';
              if (id.includes('lucide-react')) return 'lucide';
              if (id.includes('sonner') || id.includes('vaul') || id.includes('embla-carousel')) return 'ui-misc';
              if (id.includes('@tanstack/react-query')) return 'tanstack-query';
              return;
            }

            if (id.includes('/src/lib/utils.ts')) return 'shared-utils';
            if (id.includes('/src/lib/schema')) return 'schema';
          },
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) {
              return `assets/[name]-[hash][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      target: 'es2015',
      minify: 'esbuild',
    },
  };
});
