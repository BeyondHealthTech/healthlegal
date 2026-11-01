import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import ClinicCheckPage from "./pages/ClinicCheckPage";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ClinicCheckPage />
  </StrictMode>
);

// 本番ビルドはプリレンダリング済みHTMLが入っているのでハイドレート。
// devサーバではrootが空なので通常マウント。
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
