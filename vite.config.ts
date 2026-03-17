import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Standard Vite port - Netlify Dev expects this
    strictPort: false, // Allow fallback to another port if 5173 is busy
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        // Manual chunks for better long-term caching
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
        // Asset file names with content hash for cache busting
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
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
    // Target modern browsers for better optimization
    target: 'es2015',
    // Use esbuild minification (default, faster than terser)
    minify: 'esbuild',
  },
}));
