import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Representative Payee Accounting',
        short_name: 'Payee Books',
        description: 'Track spending of funds and generate court-ready reports. All data stays on your device.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache the app shell so it works fully offline after first load.
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        // Tesseract OCR language data is fetched at runtime; cache it so
        // receipt scanning keeps working offline after the first scan.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:js|wasm|traineddata\.gz|traineddata)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ocr-assets',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
        // OCR language files can be large; allow caching them.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
})
