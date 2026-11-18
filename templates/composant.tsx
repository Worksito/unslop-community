// My component: one sentence on what it does and how it moves.
// Author: First Last (https://my-site.com)
//
// Format rules (see CONTRIBUTING.md):
// - one file, importing only React and the dependencies declared in the entry;
// - colors, font and durations as CSS variables at the top, so people adapt it without touching the rest;
// - a prefers-reduced-motion block that shows the final state without animation;
// - content stays visible without JavaScript and without animation.
import type { CSSProperties } from "react";

const css = `
.my-component {
  --my-component-ink: oklch(22% 0.02 40);
  --my-component-font: "Fraunces", Georgia, serif;
  --my-component-duration: 700ms;
  margin: 0;
  font-family: var(--my-component-font);
  color: var(--my-component-ink);
  animation: my-component-in var(--my-component-duration) cubic-bezier(0.2, 0.7, 0.1, 1) both;
}
@keyframes my-component-in { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) {
  .my-component { animation: none; }
}
`;

type MyComponentProps = { text: string; style?: CSSProperties };

export function MyComponent({ text, style }: MyComponentProps) {
  return (
    <>
      <style>{css}</style>
      <p className="my-component" style={style}>
        {text}
      </p>
    </>
  );
}
