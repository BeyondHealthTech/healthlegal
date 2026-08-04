// ビルド後プリレンダリング: dist/ 内のHTMLの <div id="root"></div> に
// react-dom/server でレンダリングした本文を注入する。
// React SPAのままだと初期HTMLに本文が含まれず検索インデックスが遅く不安定なため、
// `npm run build`（GitHub Pages CI / Vercel CLIデプロイ共通）の最終ステップとして実行する。
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// SSR用バンドルを一時ディレクトリに生成（クライアントビルドの dist/ には触れない）
await build({
  configFile: false,
  base: './',
  plugins: [react(), tailwindcss()],
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-server',
    emptyOutDir: true,
  },
})

const { renderMain, render3m2g } = await import(
  pathToFileURL(resolve('dist-server/entry-server.js')).href
)

injectRoot('dist/index.html', renderMain())
injectRoot('dist/3m2g/index.html', render3m2g())

rmSync('dist-server', { recursive: true, force: true })

function injectRoot(file, html) {
  const marker = '<div id="root"></div>'
  const source = readFileSync(file, 'utf8')
  if (!source.includes(marker)) {
    throw new Error(`${file}: マーカー ${marker} が見つかりません（テンプレート変更時はこのスクリプトも更新してください）`)
  }
  writeFileSync(file, source.replace(marker, `<div id="root">${html}</div>`))
  console.log(`prerendered: ${file} (${html.length.toLocaleString()} chars)`)
}
