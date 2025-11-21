import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    // Only use SSL in dev mode, not for preview/build
    ...(command === 'serve' && !process.env.CI ? [basicSsl()] : [])
  ],
  base: '/language/',
  server: {
    https: command === 'serve' && !process.env.CI,
    cors: true  // Enable CORS for cross-origin requests
  },
  preview: {
    port: 5173
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**']
  }
}))
