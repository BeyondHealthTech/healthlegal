import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相対パス。ルート直下配信（Vercel: healthlegal.vercel.app）でも
  // サブパス配信（GitHub Pages: /healthlegal/）でも同じビルドが動く。
  // '/healthlegal/' 固定だとルート配信側でアセットが 404 になる。
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // 3M2G対応パッケージの販売専用ページ（/3m2g/）
        '3m2g': resolve(__dirname, '3m2g/index.html'),
        // 解説記事: 医療情報システム安全管理GL第7.0版 改訂まとめ
        'article-gl70': resolve(__dirname, 'articles/guideline-7-0-summary/index.html'),
        // 解説記事: SaMD該当性の線引き（「診断を代替しない」の効力）
        'article-samd-boundary': resolve(__dirname, 'articles/samd-boundary/index.html'),
        // 解説記事: 大学発シーズの3つの規制論点
        'article-academic-seed': resolve(__dirname, 'articles/academic-seed-regulatory/index.html'),
      },
    },
  },
})
