import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ThreeM2GPage from "./pages/ThreeM2GPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThreeM2GPage />
  </StrictMode>,
);
