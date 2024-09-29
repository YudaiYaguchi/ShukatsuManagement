import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
module.exports = {
  publicPath: "./",
  "pages": {
    "index": {
      "entry": "src/main.js",
      "title": "Brain Juice"
    }
  },
  "configureWebpack": {
    "devtool": "source-map",
  },
  "transpileDependencies": [
    "vuetify"
  ],
}
