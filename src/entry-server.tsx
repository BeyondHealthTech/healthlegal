import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import ThreeM2GPage from './pages/ThreeM2GPage'
import PrivacyPage from './pages/PrivacyPage'
import ArticlePage from './components/ArticlePage'
import ArticlesIndexPage from './components/ArticlesIndexPage'
import type { ArticleData } from './lib/article-types'

// ビルド時プリレンダリング用エントリ（scripts/prerender.mjs から呼ばれる）。
// CSSはクライアントエントリ側でバンドルされるためここでは読み込まない。

// 記事はMarkdown（articles/content/*.md）から生成されたモジュールを一括読み込み
const articleModules = import.meta.glob<{ default: ArticleData }>('./generated/articles/*.ts', {
  eager: true,
})
const articles = Object.fromEntries(
  Object.entries(articleModules).map(([path, mod]) => [
    path.match(/([^/]+)\.ts$/)![1],
    mod.default,
  ]),
)

export const articleSlugs = Object.keys(articles)

export function renderMain(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export function render3m2g(): string {
  return renderToString(
    <StrictMode>
      <ThreeM2GPage />
    </StrictMode>,
  )
}

export function renderPrivacy(): string {
  return renderToString(
    <StrictMode>
      <PrivacyPage />
    </StrictMode>,
  )
}

export function renderArticle(slug: string): string {
  const article = articles[slug]
  if (!article) throw new Error(`記事が見つかりません: ${slug}`)
  return renderToString(
    <StrictMode>
      <ArticlePage article={article} />
    </StrictMode>,
  )
}

export function renderArticlesIndex(): string {
  return renderToString(
    <StrictMode>
      <ArticlesIndexPage />
    </StrictMode>,
  )
}
