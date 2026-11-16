import { lazy, type ComponentType, type LazyExoticComponent } from "react";

// Catalogue des composants communautaires : même format que le site Unslop, pour que les fiches s'y copient telles quelles.
// Le catalogue ne garde que des infos légères. La démo et le code de chaque modèle
// sont chargés à la demande : la page d'accueil ne télécharge ni l'un ni l'autre.
const demoModules = import.meta.glob<{ default: ComponentType }>("./demos/*.tsx");
const sourceModules = import.meta.glob<string>("./library/*.tsx", { query: "?raw", import: "default" });

export type Model = {
  slug: string;
  title: string;
  line: string;
  category: "Titres" | "Mouvements" | "Polices" | "Navigation" | "Sections" | "Formulaires" | "Galeries";
  fonts: string;
  motion: string;
  /** nom du fichier, dans library/ (le composant) et demos/ (sa démo) */
  file: string;
  usage: string;
  /** ce que le composant demande en plus de React ; absent si rien */
  requires?: string;
  /** fond par défaut de la démo : le cadre entier prend cette couleur ; absent = papier blanc */
  stageColor?: string;
  /** largeur de la carte dans la vitrine, en colonnes sur 12 : à choisir selon la place que la démo demande */
  span: 4 | 5 | 6 | 7 | 8 | 12;
  /** hauteur du cadre en pixels : la démo y tient entière, sans vide inutile */
  stageHeight: number;
  /** qui a fait le composant ; url facultative */
  author: { name: string; url?: string };
  /** rejoue la démo toutes les N ms ; absent pour une démo interactive ou déjà continue */
  replayEvery?: number;
  /** aperçu dans la vitrine : vidéo (par défaut), vidéo filmée en promenant la souris (effet au survol), ou simple image (composant statique) */
  preview?: "video" | "hover" | "image";
  /** durée de la vidéo d'aperçu ; par défaut un cycle de replayEvery, sinon 6 s */
  previewSeconds?: number;
};

export const models: Model[] = [
  {
    slug: "titre-qui-se-pose",
    span: 12,
    stageHeight: 380,
    author: { name: "Façon" },
    replayEvery: 3600,
    title: "Titre qui se pose",
    line: "Chaque ligne monte depuis un masque, l’une après l’autre.",
    category: "Titres",
    fonts: "Fraunces",
    motion: "800 ms par ligne, 90 ms d’écart",
    file: "line-rise",
    usage: `<LineRise lines={["Le papier", "garde la trace", "de la main."]} />`,
  },
  {
    slug: "compteur-a-rouleaux",
    span: 4,
    stageHeight: 300,
    author: { name: "Façon" },
    replayEvery: 4200,
    title: "Compteur à rouleaux",
    line: "Les chiffres défilent comme un compteur mécanique.",
    category: "Mouvements",
    fonts: "Bricolage Grotesque",
    motion: "1 400 ms, 80 ms d’écart par chiffre",
    file: "rolling-number",
    usage: `<RollingNumber value={2026} />`,
  },
  {
    slug: "soulignement-a-l-encre",
    span: 4,
    stageHeight: 300,
    author: { name: "Façon" },
    // L'effet n'existe qu'au survol : la vidéo est filmée en promenant la souris sur les liens.
    preview: "hover",
    title: "Soulignement à l’encre",
    line: "Le trait se dessine au survol et repart par la droite.",
    category: "Mouvements",
    fonts: "Bricolage Grotesque",
    motion: "450 ms au survol et au focus",
    file: "ink-underline",
    usage: `<InkUnderline links={[{ label: "Travaux", href: "#travaux" }, { label: "Atelier", href: "#atelier" }, { label: "Contact", href: "#contact" }]} />`,
  },
  {
    slug: "fraunces-et-public-sans",
    span: 4,
    stageHeight: 300,
    author: { name: "Façon" },
    // Une police n'a pas besoin de vidéo : une image suffit.
    preview: "image",
    title: "Fraunces et Public Sans",
    line: "Un contraste de dessin entre titre et texte, pas de taille.",
    category: "Polices",
    fonts: "Fraunces, Public Sans",
    motion: "Aucun, la paire est statique",
    file: "type-pair",
    usage: `<TypePair title="Un atelier de reliure à Lyon." text="Carnets cousus main, papier vergé." />`,
  },
];

const demos = new Map<string, LazyExoticComponent<ComponentType>>();

/** La démo d'un modèle, chargée au premier rendu puis gardée en mémoire. */
export function demoOf(model: Model) {
  let Demo = demos.get(model.slug);
  if (!Demo) {
    const load = demoModules[`./demos/${model.file}.tsx`];
    Demo = lazy(load);
    demos.set(model.slug, Demo);
  }
  return Demo;
}

/** Le code source du composant, téléchargé seulement quand on en a besoin (page du modèle, copie). */
export const codeOf = (model: Model) => sourceModules[`./library/${model.file}.tsx`]();

export const previewSecondsOf = (m: Model) => m.previewSeconds ?? (m.replayEvery ? m.replayEvery / 1000 : 6);
export const previewSrc = (m: Model, ext: "mp4" | "jpg") => `${import.meta.env.BASE_URL}previews/${m.slug}.${ext}`;

/** Largeur réelle d'une carte en pixels, sur ordinateur : conteneur de 1152 px, 12 colonnes, gouttières de 32 px. */
export const cardWidth = (m: Model) => Math.round((m.span * (1152 - 11 * 32)) / 12 + (m.span - 1) * 32);

export const findModel = (slug: string) => models.find((m) => m.slug === slug);
