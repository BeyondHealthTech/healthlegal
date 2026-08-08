import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import ThreeM2GPage from './pages/ThreeM2GPage'
import ArticleGl70Page from './pages/ArticleGl70Page'

// ビルド時プリレンダリング用エントリ（scripts/prerender.mjs から呼ばれる）。
// CSSはクライアントエントリ側でバンドルされるためここでは読み込まない。

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

export function renderArticleGl70(): string {
  return renderToString(
    <StrictMode>
      <ArticleGl70Page />
    </StrictMode>,
  )
}
