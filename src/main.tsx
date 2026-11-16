import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tw.css";
import "./styles/bench.css";
import App from "./App.tsx";
import { cardWidth, models, previewSecondsOf } from "./models";

// Lu par scripts/record-previews.mjs pour savoir quoi filmer et combien de temps.
(window as unknown as { __vitrine: unknown }).__vitrine = models.map((m) => ({
  slug: m.slug,
  preview: m.preview ?? "video",
  seconds: previewSecondsOf(m),
  width: cardWidth(m),
  height: m.stageHeight,
}));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
