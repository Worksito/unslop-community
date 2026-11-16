// Titre qui se pose : chaque ligne monte depuis un masque, l'une après l'autre.
import type { CSSProperties } from "react";
const css = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap");
.line-rise {
  --line-rise-ink: oklch(22% 0.02 40);
  --line-rise-font: "Fraunces", Georgia, serif;
  --line-rise-step: 90ms;
  margin: 0;
  font-family: var(--line-rise-font);
  font-optical-sizing: auto;
  font-weight: 560;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--line-rise-ink);
}
.line-rise__line { display: block; overflow: clip; padding-bottom: 0.08em; }
.line-rise__text {
  display: block;
  transform: translateY(105%);
  animation: line-rise-in 800ms cubic-bezier(0.2, 0.7, 0.1, 1) forwards;
  animation-delay: calc(var(--i) * var(--line-rise-step));
}
@keyframes line-rise-in { to { transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .line-rise__text { transform: none; animation: none; }
}
`;

type LineRiseProps = { lines: string[] };

export function LineRise({ lines }: LineRiseProps) {
  return (
    <>
      <style>{css}</style>
      <h2 className="line-rise" aria-label={lines.join(" ")}>
        {lines.map((line, i) => (
          <span className="line-rise__line" aria-hidden="true" key={line}>
            <span className="line-rise__text" style={{ "--i": i } as CSSProperties}>
              {line}
            </span>
          </span>
        ))}
      </h2>
    </>
  );
}
