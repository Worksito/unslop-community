// Paire de polices : un titre à fort contraste de dessin, un texte sobre. Statique : une police n'a pas besoin de bouger.
const css = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Public+Sans:wght@400&display=swap");
.type-pair {
  --type-pair-ink: oklch(21% 0.02 30);
  --type-pair-soft: oklch(42% 0.02 30);
  --type-pair-display: "Fraunces", Georgia, serif;
  --type-pair-text: "Public Sans", system-ui, sans-serif;
  display: grid;
  gap: 1rem;
  max-width: 34rem;
}
.type-pair__head {
  margin: 0;
  font: 600 clamp(2rem, 4.5vw, 3.25rem) / 1.04 var(--type-pair-display);
  font-optical-sizing: auto;
  letter-spacing: -0.025em;
  color: var(--type-pair-ink);
  text-wrap: balance;
}
.type-pair__text {
  margin: 0;
  font: 400 1.0625rem / 1.6 var(--type-pair-text);
  color: var(--type-pair-soft);
  text-wrap: pretty;
}
`;

type TypePairProps = { title: string; text: string };

export function TypePair({ title, text }: TypePairProps) {
  return (
    <>
      <style>{css}</style>
      <div className="type-pair">
        <p className="type-pair__head">{title}</p>
        <p className="type-pair__text">{text}</p>
      </div>
    </>
  );
}
