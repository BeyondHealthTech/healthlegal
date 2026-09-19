// GitHub Pages ミラー用: dist/ 内の全HTMLに <meta name="robots" content="noindex"> を注入する。
// 正規ホストは healthlegal.vercel.app（canonical/sitemap/robots とも Vercel を指す）。
// beyondhealthtech.github.io/healthlegal/ は同一内容の重複配信になっており、
// サブパス配信のため robots.txt では制御できない。GitHub Pages のデプロイ時のみ
// 本スクリプトを通すことで、検索エンジンのインデックス対象を Vercel 側へ一本化する。
// Vercel 側のビルド（vercel-deploy.yml / ローカル `npm run build`）では実行しない。
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? 'dist'
const NOINDEX_TAG = '<meta name="robots" content="noindex">'

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

const files = htmlFiles(root)
if (files.length === 0) {
  console.error(`add-noindex: ${root} にHTMLがありません（ビルド前に実行していませんか）`)
  process.exit(1)
}

let injected = 0
for (const file of files) {
  const html = readFileSync(file, 'utf8')
  if (html.includes(NOINDEX_TAG)) continue // 冪等
  if (!html.includes('<head>')) {
    console.error(`add-noindex: ${file} に <head> が見つかりません`)
    process.exit(1)
  }
  writeFileSync(file, html.replace('<head>', `<head>\n    ${NOINDEX_TAG}`))
  injected++
}
console.log(`add-noindex: ${files.length}ファイル中 ${injected}ファイルに注入しました`)
