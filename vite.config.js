import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // `npm run api:dev` serves public/ (and the PHP API) on :8000.
  // Or read the live projects: VITE_API_PROXY=https://basileferi.fr npm run dev
  const apiTarget = env.VITE_API_PROXY || 'http://localhost:8000'
  const changeOrigin = !/localhost|127\.0\.0\.1/.test(apiTarget)

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin },
        '/uploads': { target: apiTarget, changeOrigin },
      },
    },
  }
})
