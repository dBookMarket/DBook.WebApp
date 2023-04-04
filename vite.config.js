import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  define: {
    'process.env': {},
  },
  build: {
    // ...,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    // minify: 'terser', // “esnext”将强制降为“es2021”
    // terserOptions: {
    //   compress: {
    //     // 生产环境时移除console
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
  },
  base: '/',
  // base: './',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    }
  },
  plugins: [
    vue()
  ],
})
