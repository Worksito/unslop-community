// Compteur à rouleaux : chaque chiffre défile comme un compteur mécanique jusqu'à sa valeur.
import type { CSSProperties } from "react";
const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600&display=swap");
.rolling-number {
  --rolling-number-ink: oklch(23% 0.015 160);
  --rolling-number-font: "Bricolage Grotesque", system-ui, sans-serif;
  --rolling-number-step: 80ms;
  display: inline-flex;
  margin: 0;
  font: 600 clamp(3.5rem, 10vw, 7.5rem) / 1 var(--rolling-number-font);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  color: var(--rolling-number-ink);
}
.rolling-number__digit { display: inline-block; height: 1em; overflow: clip; }
.rolling-number__strip {
  display: flex;
  flex-direction: column;
  animation: rolling-number-roll 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i) * var(--rolling-number-step));
}
.rolling-number__strip > span { height: 1em; }
@keyframes rolling-number-roll { to { transform: translateY(calc(var(--d) * -1em)); } }
@media (prefers-reduced-motion: reduce) {
  .rolling-number__strip { animation: none; transform: translateY(calc(var(--d) * -1em)); }
}
`;

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type RollingNumberProps = { value: number };

export function RollingNumber({ value }: RollingNumberProps) {
  const digits = String(Math.trunc(Math.abs(value))).split("");
  return (
    <>
      <style>{css}</style>
      <p className="rolling-number" aria-label={String(value)}>
        {digits.map((d, i) => (
          <span className="rolling-number__digit" aria-hidden="true" key={i}>
            <span className="rolling-number__strip" style={{ "--d": d, "--i": i } as CSSProperties}>
              {DIGITS.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </p>
    </>
  );
}
