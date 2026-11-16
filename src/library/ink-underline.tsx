// Soulignement à l'encre : le trait se dessine de gauche à droite au survol et repart par la droite.
const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500&display=swap");
.ink-links {
  --ink-links-ink: oklch(24% 0.02 250);
  --ink-links-mark: oklch(58% 0.16 35);
  --ink-links-font: "Bricolage Grotesque", system-ui, sans-serif;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font: 500 clamp(1.5rem, 3vw, 2.25rem) / 1.2 var(--ink-links-font);
}
.ink-links__link {
  position: relative;
  display: inline-block;
  padding-bottom: 0.12em;
  color: var(--ink-links-ink);
  text-decoration: none;
}
.ink-links__link::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 0.09em;
  background: var(--ink-links-mark);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 450ms cubic-bezier(0.2, 0.7, 0.1, 1);
}
.ink-links__link:hover::after,
.ink-links__link:focus-visible::after { transform: scaleX(1); transform-origin: left; }
.ink-links__link:focus-visible { outline: 2px solid var(--ink-links-mark); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  .ink-links__link::after { transition: none; }
}
`;

type InkUnderlineProps = { links: { label: string; href: string }[] };

export function InkUnderline({ links }: InkUnderlineProps) {
  return (
    <>
      <style>{css}</style>
      <ul className="ink-links">
        {links.map((link) => (
          <li key={link.label}>
            <a className="ink-links__link" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
