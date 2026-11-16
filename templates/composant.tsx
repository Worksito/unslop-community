// Mon composant : une phrase qui dit ce qu'il fait et comment il bouge.
// Auteur : Prénom Nom (https://mon-site.fr)
//
// Règles du format (voir CONTRIBUTING.md) :
// - un seul fichier, qui n'importe que React et les dépendances déclarées dans la fiche ;
// - couleurs, police et durées en variables CSS en tête, pour qu'on adapte sans toucher au reste ;
// - un bloc prefers-reduced-motion qui affiche l'état final sans animation ;
// - le contenu reste visible sans JavaScript et sans animation.
import type { CSSProperties } from "react";

const css = `
.mon-composant {
  --mon-composant-ink: oklch(22% 0.02 40);
  --mon-composant-font: "Fraunces", Georgia, serif;
  --mon-composant-duree: 700ms;
  margin: 0;
  font-family: var(--mon-composant-font);
  color: var(--mon-composant-ink);
  animation: mon-composant-in var(--mon-composant-duree) cubic-bezier(0.2, 0.7, 0.1, 1) both;
}
@keyframes mon-composant-in { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) {
  .mon-composant { animation: none; }
}
`;

type MonComposantProps = { texte: string; style?: CSSProperties };

export function MonComposant({ texte, style }: MonComposantProps) {
  return (
    <>
      <style>{css}</style>
      <p className="mon-composant" style={style}>
        {texte}
      </p>
    </>
  );
}
