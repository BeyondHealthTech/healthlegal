import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相対パス。ルート直下配信（Vercel: healthlegal.vercel.app）でも
  // サブパス配信（GitHub Pages: /healthlegal/）でも同じビルドが動く。
  // '/healthlegal/' 固定だとルート配信側でアセットが 404 になる。
  base: './',
  plugins: [react(), tailwindcss()],
})
