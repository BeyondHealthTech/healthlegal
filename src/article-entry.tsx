import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import ArticlePage from "./components/ArticlePage";
import type { ArticleData } from "./lib/article-types";

// 全記事ページ共通のクライアントエントリ。
// URLのslugから該当記事のデータチャンクだけを遅延読み込みする
// （記事が増えても各ページのJSは自分の本文しか持たない）。
const modules = import.meta.glob<{ default: ArticleData }>("./generated/articles/*.ts");

const match = location.pathname.match(/\/articles\/([^/]+)\/?/);
const slug = match?.[1];
const loader = slug ? modules[`./generated/articles/${slug}.ts`] : undefined;

if (loader) {
  loader().then(({ default: article }) => {
    const container = document.getElementById("root")!;
    const app = (
      <StrictMode>
        <ArticlePage article={article} />
      </StrictMode>
    );
    // 本番ビルドはプリレンダリング済みHTMLが入っているのでハイドレート。
    // devサーバではrootが空なので通常マウント。
    if (container.hasChildNodes()) {
      hydrateRoot(container, app);
    } else {
      createRoot(container).render(app);
    }
  });
}
