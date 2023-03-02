import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$contentMinWidth: 915px;$contentWidth: 60%;$navigatorWidth:70%;$minNavigatorWidth:1200px;`
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    }
  },
  plugins: [vue()]
})
