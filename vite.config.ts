import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Order matters - more specific routes first
      '/api/foursquare': {
        target: 'https://places-api.foursquare.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/foursquare/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Foursquare proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to Foursquare:', req.method, req.url);
            // Ensure headers are properly forwarded
            if (req.headers['x-places-api-version']) {
              proxyReq.setHeader('X-Places-Api-Version', req.headers['x-places-api-version']);
            }
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Foursquare:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/google-places': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/google-places/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Google Places proxy error', err);
          });
        },
      },
      // General API proxy (must be last to avoid conflicts)
      '^/api/(?!foursquare|google-places)': {
        target: "http://localhost:3000",
        changeOrigin: true,
      }
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
