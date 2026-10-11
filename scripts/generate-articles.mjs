// 記事基盤の生成スクリプト（S1: Markdown化）
// articles/content/<slug>.md（frontmatter + Markdown本文）を唯一のソースとして、
//   1. src/generated/articles/<slug>.ts   … 記事データ（本文HTML込み）
//   2. src/generated/articles-index.ts    … 記事メタデータの一覧（一覧ページ・関連記事用）
//   3. articles/<slug>/index.html         … Viteエントリ（head メタ・OGP・JSON-LD）
//   4. articles/index.html                … /articles/ 一覧ページのエントリ
//   5. public/sitemap.xml                 … 静的ページ + 全記事
// を生成する。記事を追加するときは .md を1枚置くだけでよい
// （vite.config.ts が articles/*/index.html を自動で入力に加える）。
//
// 実行: npm run generate（dev / build / lint の先頭で自動実行される）
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { Marked } from 'marked'
import matter from 'gray-matter'

const ROOT = resolve(import.meta.dirname, '..')
const CONTENT_DIR = resolve(ROOT, 'articles/content')
const GENERATED_DIR = resolve(ROOT, 'src/generated')
const SITE_ORIGIN = 'https://healthlegal.vercel.app'

// ---- 記事ページ本文のスタイル（旧 src/pages/Article*.tsx のクラス定義を移設） ----
const CLS = {
  h2: 'text-2xl sm:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug',
  h3: 'text-xl font-bold text-slate-900 mt-10 mb-4 leading-snug',
  p: 'text-slate-700 leading-relaxed mb-5',
  quote:
    'border-l-4 border-primary-300 bg-primary-50/60 px-5 py-4 rounded-r-lg text-slate-700 leading-relaxed mb-5 text-[15px]',
  ol: 'list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed mb-5',
  ul: 'list-disc pl-6 space-y-2 text-slate-700 leading-relaxed mb-5',
  link: 'text-primary-600 hover:text-primary-700 underline',
  table: 'w-full text-sm border border-slate-200 rounded-lg overflow-hidden',
  th: 'text-left font-semibold px-4 py-3 border-b border-slate-200',
  td: 'px-4 py-3 border-b border-slate-100 text-slate-700',
  tdHighlight: 'px-4 py-3 border-b border-slate-100 font-bold text-primary-800',
}

const CHECK_ICON_SVG =
  '<svg class="w-5 h-5 text-primary-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>'

// sitemap の静的ページ（記事以外）。記事は frontmatter から自動で入る。
const SITEMAP_STATIC_HEAD = [
  { loc: '/', lastmod: '2026-07-26', changefreq: 'monthly', priority: '1.0' },
  { loc: '/3m2g/', lastmod: '2026-07-26', changefreq: 'monthly', priority: '0.8' },
  { loc: '/articles/', lastmod: '2026-09-23', changefreq: 'weekly', priority: '0.5' },
]
const SITEMAP_STATIC_TAIL = [
  { loc: '/privacy/', lastmod: '2026-08-21', changefreq: 'yearly', priority: '0.3' },
]

const marked = new Marked({ gfm: true })

/** marked の素のHTML出力に記事ページのTailwindクラスを与える */
function decorateHtml(html, slug) {
  let out = html

  // テーブル: ラッパー + クラス。tbody行は「全セルが**…**」なら強調行（例: GL7.0の新設編）
  out = out.replace(/<table>([\s\S]*?)<\/table>/g, (_, inner) => {
    let t = inner
    t = t.replace(/<thead>\s*<tr>/, `<thead><tr class="bg-slate-100 text-slate-900">`)
    t = t.replace(/<th>/g, `<th class="${CLS.th}">`)
    t = t.replace(/<tbody>([\s\S]*)$/, (_m, body) => {
      const rows = body.replace(/<tr>([\s\S]*?)<\/tr>/g, (_r, cells) => {
        const cellList = [...cells.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => c[1])
        const allStrong =
          cellList.length > 0 &&
          cellList.every((c) => /^<strong>[\s\S]*<\/strong>$/.test(c.trim()))
        if (allStrong) {
          const tds = cellList
            .map((c) => `<td class="${CLS.tdHighlight}">${c.trim().replace(/^<strong>|<\/strong>$/g, '')}</td>`)
            .join('')
          return `<tr class="bg-primary-50/60">${tds}</tr>`
        }
        const tds = cellList.map((c) => `<td class="${CLS.td}">${c}</td>`).join('')
        return `<tr class="bg-white">${tds}</tr>`
      })
      return `<tbody>${rows}`
    })
    return `<div class="overflow-x-auto mb-5"><table class="${CLS.table}">${t}</table></div>`
  })

  // 引用: 単一段落のみサポート（<p>ラッパーを外してクラス付与）
  out = out.replace(/<blockquote>\s*([\s\S]*?)\s*<\/blockquote>/g, (_, inner) => {
    const paras = [...inner.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    if (paras.length !== 1) {
      throw new Error(
        `${slug}: 引用ブロックは1段落のみ対応です（改行は <br /> を使ってください）: ${inner.slice(0, 80)}…`,
      )
    }
    return `<blockquote class="${CLS.quote}">${paras[0][1]}</blockquote>`
  })

  // チェックリスト: 各項目が「✓ 」で始まる箇条書きをチェックアイコン付きリストに変換
  out = out.replace(/<ul>\s*([\s\S]*?)\s*<\/ul>/g, (whole, inner) => {
    const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1])
    if (items.length === 0 || !items.every((i) => i.startsWith('✓ '))) return whole
    const lis = items
      .map(
        (i) =>
          `<li class="flex gap-3 text-slate-700 leading-relaxed">${CHECK_ICON_SVG}<span>${i.slice(2)}</span></li>`,
      )
      .join('')
    return `<ul class="space-y-3 mb-5">${lis}</ul>`
  })

  // 通常リスト・見出し・段落
  out = out.replace(/<ol>/g, `<ol class="${CLS.ol}">`)
  out = out.replace(/<ul>/g, `<ul class="${CLS.ul}">`)
  out = out.replace(/<h2>/g, `<h2 class="${CLS.h2}">`)
  out = out.replace(/<h3>/g, `<h3 class="${CLS.h3}">`)
  out = out.replace(/<p>/g, `<p class="${CLS.p}">`)

  // リンク: クラス付与、外部リンクは別タブ
  out = out.replace(/<a href="([^"]+)">/g, (_, href) => {
    const external = /^https?:\/\//.test(href)
    const extra = external ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${href}"${extra} class="${CLS.link}">`
  })

  return out.trim()
}

// CommonMarkのフランキング規則では日本語の句読点・括弧に隣接する ** が強調として
// 解釈されないことがある（例: 「（計99項目）**が」）。本文で literal な ** は使わない
// 前提で、Markdown解析の前に ** ペアを <strong> に変換して確実に太字化する。
function strongify(md) {
  return md.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
}

function renderInline(md) {
  return marked.parseInline(strongify(md)).trim()
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** articles/<slug>/index.html（Viteエントリ + SEOメタ）を生成する */
function articleEntryHtml(a) {
  return `<!doctype html>
<!-- このファイルは articles/content/${a.slug}.md から scripts/generate-articles.mjs が生成しています。直接編集しないでください。 -->
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(a.seoTitle)} | HealthLegal</title>
    <meta name="description" content="${esc(a.description)}" />
    <link rel="canonical" href="${SITE_ORIGIN}/articles/${a.slug}/" />
    <meta name="robots" content="index, follow" />

    <!-- OGP / Twitter Card -->
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:site_name" content="HealthLegal" />
    <meta property="og:title" content="${esc(a.seoTitle)}" />
    <meta property="og:description" content="${esc(a.ogDescription)}" />
    <meta property="og:url" content="${SITE_ORIGIN}/articles/${a.slug}/" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(a.twitterTitle)} | HealthLegal" />
    <meta name="twitter:description" content="${esc(a.twitterDescription)}" />

    <!-- 構造化データ（記事） -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": ${JSON.stringify(`${a.title} ${a.subtitle}`)},
        "inLanguage": "ja",
        "datePublished": "${a.datePublished}",
        "dateModified": "${a.dateModified}",
        "mainEntityOfPage": "${SITE_ORIGIN}/articles/${a.slug}/",
        "author": {
          "@type": "Organization",
          "name": "Beyond HealthTech合同会社"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Beyond HealthTech合同会社",
          "alternateName": "Beyond HealthTech LLC"
        }
      }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5S8MK6W5QD"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5S8MK6W5QD');
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="../../src/article-entry.tsx"></script>
  </body>
</html>
`
}

/** /articles/ 一覧ページのエントリを生成する */
function articlesIndexEntryHtml() {
  return `<!doctype html>
<!-- このファイルは scripts/generate-articles.mjs が生成しています。直接編集しないでください。 -->
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>解説記事一覧 | HealthLegal</title>
    <meta name="description" content="医療・ヘルスケア事業の規制対応（3省2ガイドライン・医療機器該当性・薬事）について、法令・ガイドラインの一次情報に基づいて解説する記事の一覧です。" />
    <link rel="canonical" href="${SITE_ORIGIN}/articles/" />
    <meta name="robots" content="index, follow" />

    <!-- OGP / Twitter Card -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:site_name" content="HealthLegal" />
    <meta property="og:title" content="解説記事一覧 | HealthLegal" />
    <meta property="og:description" content="医療・ヘルスケア事業の規制対応を一次情報に基づいて解説する記事の一覧です。" />
    <meta property="og:url" content="${SITE_ORIGIN}/articles/" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="解説記事一覧 | HealthLegal" />
    <meta name="twitter:description" content="医療・ヘルスケア事業の規制対応を一次情報に基づいて解説する記事の一覧です。" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5S8MK6W5QD"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5S8MK6W5QD');
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="../src/articles-index-main.tsx"></script>
  </body>
</html>
`
}

function sitemapXml(articles) {
  const entries = [
    ...SITEMAP_STATIC_HEAD,
    ...articles.map((a) => ({
      loc: `/articles/${a.slug}/`,
      lastmod: a.sitemapLastmod,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...SITEMAP_STATIC_TAIL,
  ]
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${SITE_ORIGIN}${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

// ---- メイン ----
const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))
const REQUIRED = [
  'category', 'title', 'subtitle', 'shortLabel', 'dateLabel', 'bylineNote',
  'seoTitle', 'description', 'ogDescription', 'twitterTitle', 'twitterDescription',
  'datePublished', 'dateModified', 'summary', 'sources', 'sourcesNote', 'cta',
]

const articles = files.map((file) => {
  const slug = basename(file, '.md')
  const { data, content } = matter(readFileSync(resolve(CONTENT_DIR, file), 'utf8'))
  for (const key of REQUIRED) {
    if (data[key] === undefined) throw new Error(`${file}: frontmatter に ${key} がありません`)
  }
  return {
    slug,
    ...data,
    order: data.order ?? 99,
    sitemapLastmod: data.sitemapLastmod ?? data.dateModified,
    listDescription: data.listDescription ?? data.ogDescription,
    related: data.related ?? [],
    summaryHtml: data.summary.map((s) => renderInline(s)),
    bodyHtml: decorateHtml(marked.parse(strongify(content)), slug),
  }
})

// 一覧の表示順: 公開日の新しい順 → order 昇順 → slug
articles.sort((a, b) =>
  a.datePublished !== b.datePublished
    ? b.datePublished.localeCompare(a.datePublished)
    : a.order !== b.order
      ? a.order - b.order
      : a.slug.localeCompare(b.slug),
)

// 関連記事slugの存在チェック
const slugSet = new Set(articles.map((a) => a.slug))
for (const a of articles) {
  for (const r of a.related) {
    if (!slugSet.has(r)) throw new Error(`${a.slug}: related の ${r} が存在しません`)
  }
}

mkdirSync(resolve(GENERATED_DIR, 'articles'), { recursive: true })

const metaFields = (a) => ({
  slug: a.slug,
  category: a.category,
  title: a.title,
  subtitle: a.subtitle,
  shortLabel: a.shortLabel,
  dateLabel: a.dateLabel,
  bylineNote: a.bylineNote,
  listDescription: a.listDescription,
  datePublished: a.datePublished,
  dateModified: a.dateModified,
})

for (const a of articles) {
  const data = {
    ...metaFields(a),
    summaryHtml: a.summaryHtml,
    bodyHtml: a.bodyHtml,
    sources: a.sources,
    sourcesNote: a.sourcesNote,
    related: a.related,
    cta: a.cta,
  }
  writeFileSync(
    resolve(GENERATED_DIR, 'articles', `${a.slug}.ts`),
    `// articles/content/${a.slug}.md から自動生成。直接編集しないでください。\n` +
      `import type { ArticleData } from '../../lib/article-types'\n\n` +
      `const article: ArticleData = ${JSON.stringify(data, null, 2)}\n\n` +
      `export default article\n`,
  )
  mkdirSync(resolve(ROOT, 'articles', a.slug), { recursive: true })
  writeFileSync(resolve(ROOT, 'articles', a.slug, 'index.html'), articleEntryHtml(a))
}

writeFileSync(
  resolve(GENERATED_DIR, 'articles-index.ts'),
  `// articles/content/*.md から自動生成。直接編集しないでください。\n` +
    `import type { ArticleMeta } from '../lib/article-types'\n\n` +
    `export const articlesIndex: ArticleMeta[] = ${JSON.stringify(articles.map(metaFields), null, 2)}\n`,
)

writeFileSync(resolve(ROOT, 'articles', 'index.html'), articlesIndexEntryHtml())
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), sitemapXml(articles))

console.log(`generated: ${articles.length} articles (${articles.map((a) => a.slug).join(', ')}), articles/index.html, sitemap.xml`)
