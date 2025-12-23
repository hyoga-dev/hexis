import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // File yang ingin dimasukkan ke dalam cache offline
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'Hexis Habit Tracker',
        short_name: 'Hexis',
        description: 'Track your habits and get reminders',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Menentukan file mana saja yang di-cache untuk offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        // PENTING: Jangan masukkan firebase-messaging-sw ke dalam precache workbox
        // agar tidak terjadi konflik atau looping service worker.
        navigateFallbackDenylist: [/^\/firebase-messaging-sw.js/],
      },
      devOptions: {
        enabled: true, // Agar PWA bisa ditest di mode 'npm run dev'
        type: 'module'
      }
    })
  ]
})