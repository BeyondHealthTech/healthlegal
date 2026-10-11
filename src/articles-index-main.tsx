import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import ArticlesIndexPage from "./components/ArticlesIndexPage";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ArticlesIndexPage />
  </StrictMode>
);

// 本番ビルドはプリレンダリング済みHTMLが入っているのでハイドレート。
// devサーバではrootが空なので通常マウント。
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
