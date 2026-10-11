import { readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 解説記事のエントリは articles/<slug>/index.html を自動検出する
// （scripts/generate-articles.mjs が articles/content/<slug>.md から生成。
//  build / dev / lint の先頭で `npm run generate` が実行される）。
const articleInputs = Object.fromEntries(
  readdirSync(resolve(__dirname, 'articles'), { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        d.name !== 'content' &&
        existsSync(resolve(__dirname, 'articles', d.name, 'index.html')),
    )
    .map((d) => [`article-${d.name}`, resolve(__dirname, 'articles', d.name, 'index.html')]),
)

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
        // 解説記事の一覧ページ（/articles/）
        'articles-index': resolve(__dirname, 'articles/index.html'),
        // 各解説記事（articles/content/*.md から自動生成）
        ...articleInputs,
        // プライバシーポリシー（問い合わせ・診断フォーム共通）
        privacy: resolve(__dirname, 'privacy/index.html'),
      },
    },
  },
})
