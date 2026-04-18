import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import prerender from "@prerenderer/rollup-plugin";
import { collectRoutes } from "./scripts/collect-prerender-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()];

  if (mode === 'production') {
    try {
      const routes = await collectRoutes();

      plugins.push(
        prerender({
          routes,
          renderer: '@prerenderer/renderer-puppeteer',
          rendererOptions: {
            renderAfterElementExists: '#prerender-ready-marker',
            renderAfterTime: 15000,
            maxConcurrentRoutes: 4,
            headless: true,
            // Explicit prerender UA so third-party widgets (LeadConnector chat,
            // Clarity, etc.) can detect & skip themselves during build.
            userAgent: 'HairPinnsPrerender/1.0 (+HeadlessChrome; prerender=true)',
          },
          postProcess(renderedRoute: any) {
            // Strip LeadConnector / Ionic / reCAPTCHA pollution that may have
            // snuck in despite the UA guard in index.html. Also remove the
            // prerender-ready marker and any recaptcha origin-trial meta.
            renderedRoute.html = renderedRoute.html
              // Ionic / LeadConnector custom elements
              .replace(/<[a-z-]+-(chat|message|conversation|feedback|form|input|pane|selection|widget)[^>]*>[\s\S]*?<\/[a-z-]+-(chat|message|conversation|feedback|form|input|pane|selection|widget)>/gi, '')
              .replace(/<slot-fb[^>]*>[\s\S]*?<\/slot-fb>/gi, '')
              // Ionic-injected style block that hides unhydrated custom elements
              .replace(/<style data-styles="">[\s\S]*?<\/style>/gi, '')
              // reCAPTCHA origin-trial meta injected by third-party scripts
              .replace(/<meta http-equiv="origin-trial"[^>]*>/gi, '')
              // reCAPTCHA runtime script the Puppeteer browser loaded
              .replace(/<script[^>]*recaptcha[^>]*><\/script>/gi, '')
              .replace(/<script[^>]*gstatic\.com\/recaptcha[^>]*><\/script>/gi, '')
              // LeadConnector runtime scripts / assets the browser loaded
              .replace(/<script[^>]*leadconnectorhq\.com[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<link[^>]*leadconnectorhq\.com[^>]*>/gi, '')
              .replace(/<link[^>]*fonts\.bunny\.net[^>]*>/gi, '')
              // Ionic className on <html>
              .replace(/<html([^>]*?)class="plt-[^"]*"([^>]*?)mode="md"([^>]*)>/gi, '<html$1$2$3>')
              .replace(/<html([^>]*?)mode="md"([^>]*)>/gi, '<html$1$2>')
              // The prerender-ready DOM marker
              .replace(/<div id="prerender-ready-marker"[^>]*><\/div>/gi, '');
            return renderedRoute;
          },
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
