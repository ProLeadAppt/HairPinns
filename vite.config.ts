import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()];

  if (mode === 'production') {
    try {
      const vitePrerender = (await import('vite-plugin-prerender')).default;
      const Renderer = (await import('@prerenderer/renderer-puppeteer')).default;
      const { collectRoutes } = await import('./scripts/collect-prerender-routes.js');
      const routes = await collectRoutes();

      plugins.push(
        vitePrerender({
          staticDir: path.join(__dirname, 'dist'),
          routes,
          renderer: new Renderer({
            renderAfterTime: 5000,
            maxConcurrentRoutes: 4,
            headless: true,
          }),
        })
      );
    } catch (err: any) {
      console.warn('[prerender] Skipping prerendering:', err.message);
    }
  }

  return {
    server: {
      host: "::",
      port: 5173,
      strictPort: false,
    },
    plugins,
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
            }
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
