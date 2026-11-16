// La fiche à ajouter dans le tableau `models` de src/models.tsx.
const fiche = {
  slug: "mon-composant",            // adresse de la page : #/m/mon-composant
  span: 6,                          // largeur de la carte, en colonnes sur 12 : 4, 5, 6, 7, 8 ou 12
  stageHeight: 320,                 // hauteur du cadre en px : la démo y tient entière, sans grand vide
  author: { name: "Prénom Nom", url: "https://mon-site.fr" },
  title: "Mon composant",
  line: "Une phrase qui dit ce qu'on voit, en moins de 12 mots.",
  category: "Titres",               // Titres, Mouvements, Polices, Navigation, Sections, Formulaires ou Galeries
  fonts: "Fraunces",
  motion: "700 ms, une seule entrée",
  file: "mon-composant",            // src/library/mon-composant.tsx et src/demos/mon-composant.tsx
  usage: `<MonComposant texte="Votre texte" />`,
  // Facultatif :
  // requires: "Tailwind CSS et framer-motion",   // tout ce qu'il faut en plus de React
  // stageColor: "#0b0b0f",                       // si la démo a son propre fond : le cadre entier le prend
  // replayEvery: 3600,                           // rejoue la démo (durée de l'animation + environ 2,5 s)
  // preview: "image",                            // composant statique : image au lieu de vidéo
  // preview: "hover",                            // effet au survol : la vidéo est filmée en promenant la souris
};
export default fiche;
