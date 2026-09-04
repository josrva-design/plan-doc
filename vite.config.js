import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images-cache', expiration: { maxEntries: 64 } },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/icons/'),
            handler: 'CacheFirst',
            options: { cacheName: 'pwa-icons', expiration: { maxEntries: 32 } },
          },
        ],
      },
      includeAssembledCSV: true,
      manifest: {
        name: 'DocFitness | Plan Nutricional',
        short_name: 'DocFitness',
        description: 'Plan Nutricional y Entrenamiento personalizado',
        start_url: '/index.html',
        display: 'standalone',
        background_color: '#F6F6F6',
        theme_color: '#0D2640',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
          ],
          ui: [
            'lucide-react',
          ],
          pdf: [
            '@react-pdf/renderer',
          ],
        },
      },
    },
  },
  publicDir: 'public',
})
