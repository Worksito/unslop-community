#!/usr/bin/env node
// Vérifie qu'un composant proposé respecte le format de la vitrine (voir CONTRIBUTING.md).
//   npm run check-model -- mon-composant      (un modèle, par son slug)
//   npm run check-model -- --all              (tout le catalogue)
//   npm run check-model -- --files <chemins>  (les modèles touchés par ces fichiers, pour l'automatisation)
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const catalog = readFileSync(root("src/models.tsx"), "utf8");

// Les fiches du tableau `models`, découpées par bloc.
const start = catalog.search(/(?:export )?const (?:allModels|models): Model\[\] = \[/);
const end = catalog.indexOf("\n];", start);
const blocks = [...catalog.slice(start, end).matchAll(/\n  \{\n([\s\S]*?)\n  \},/g)].map((m) => `\n${m[1]}`);
const field = (b, k) => b.match(new RegExp(`\\n    ${k}: ("([^"]*)"|\`[\\s\\S]*?\`|[^,\\n]+)`))?.[1];
const text = (b, k) => field(b, k)?.replace(/^["`]|["`]$/g, "");

const REQUIRED = ["slug", "span", "stageHeight", "author", "title", "line", "category", "fonts", "motion", "file", "usage"];
const SPANS = ["4", "5", "6", "7", "8", "12"];
const CATEGORIES = ["Titres", "Mouvements", "Polices", "Navigation", "Sections", "Formulaires", "Galeries"];
// Ce qu'un composant peut importer quand ses dépendances sont déclarées dans `requires`.
const DECLARABLE = ["framer-motion", "motion", "lucide-react", "@/lib/utils", "next/link", "clsx", "tailwind-merge"];

// Le code proposé s'exécute dans le navigateur des visiteurs : on refuse ce qui peut espionner,
// envoyer des données ou exécuter du code caché. Ce contrôle attrape les cas évidents ; la relecture humaine reste nécessaire.
const FORBIDDEN = [
  [/\bfetch\s*\(|XMLHttpRequest|sendBeacon|new\s+WebSocket|new\s+EventSource/, "sends or receives data over the network"],
  [/\beval\s*\(|new\s+Function\s*\(|set(Timeout|Interval)\s*\(\s*["'`]/, "runs code from a string"],
  [/document\.cookie|localStorage|sessionStorage|indexedDB/, "reads or writes data stored in the browser"],
  [/window\.open\s*\(|(window\.|document\.)?location(\.href)?\s*=[^=]|location\.(assign|replace)\s*\(/, "redirige ou ouvre une autre page"],
  [/<script|document\.write|createElement\s*\(\s*["']script/, "injecte un script"],
  [/\bimport\s*\(/, "loads code on the fly (dynamic import)"],
  [/navigator\.(clipboard|geolocation|mediaDevices)|Notification\.requestPermission/, "asks for sensitive access (clipboard, location, camera, notifications)"],
];
// Les seules adresses externes admises : polices et images d'exemple.
// www.w3.org : identifiant standard des SVG (xmlns), jamais visité.
const ALLOWED_HOSTS = ["www.w3.org", "fonts.googleapis.com", "fonts.gstatic.com", "api.fontshare.com", "upload.wikimedia.org", "images.unsplash.com"];
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");

function security(code, where, errors, warnings) {
  const live = stripComments(code);
  for (const [re, why] of FORBIDDEN) if (re.test(live)) errors.push(`security (${where}): ${why}`);
  for (const m of live.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    if (!ALLOWED_HOSTS.includes(m[1].toLowerCase())) errors.push(`security (${where}): external address not allowed "${m[1]}"`);
  }
  if (/dangerouslySetInnerHTML/.test(live)) warnings.push(`${where} uses dangerouslySetInnerHTML: check that it only injects fixed CSS`);
}

function check(block) {
  const errors = [];
  const warnings = [];
  const slug = text(block, "slug");
  for (const k of REQUIRED) if (!field(block, k)) errors.push(`the entry has no "${k}" field`);
  if (field(block, "span") && !SPANS.includes(field(block, "span"))) errors.push(`span must be one of ${SPANS.join(", ")}`);
  const h = Number(field(block, "stageHeight"));
  if (h && (h < 240 || h > 720)) warnings.push(`stageHeight ${h} px: outside the usual range (240 to 720)`);
  const cat = text(block, "category");
  if (cat && !CATEGORIES.includes(cat)) errors.push(`unknown category "${cat}"`);
  const line = text(block, "line") ?? "";
  if (line.split(/\s+/).length > 16) warnings.push("the entry's line is longer than 16 words");

  const file = text(block, "file");
  const lib = root(`src/library/${file}.tsx`);
  const demo = root(`src/demos/${file}.tsx`);
  if (!existsSync(lib)) errors.push(`component not found: src/library/${file}.tsx`);
  if (!existsSync(demo)) errors.push(`demo not found: src/demos/${file}.tsx`);
  else {
    const demoCode = readFileSync(demo, "utf8");
    if (!/export default/.test(demoCode)) errors.push("the demo needs a default export");
    security(demoCode, "demo", errors, warnings);
  }

  if (existsSync(lib)) {
    const code = readFileSync(lib, "utf8");
    security(code, "component", errors, warnings);
    const requires = text(block, "requires");
    const imports = [...code.matchAll(/^\s*import\s[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    for (const imp of imports) {
      if (imp === "react" || imp.startsWith("react/")) continue;
      if (!requires) errors.push(`imports "${imp}" but the entry declares no dependencies (requires)`);
      else if (!DECLARABLE.includes(imp)) errors.push(`imports "${imp}", which is not an accepted dependency`);
    }
    // Seul un composant qui bouge doit gérer le mouvement réduit ; une paire de polices statique n'en a pas besoin.
    const moves = /@keyframes|animation|transition|requestAnimationFrame|<motion\.|from ["']framer-motion["']/.test(code);
    if (moves && !/reduced-motion|prefers-reduced|useReducedMotion/i.test(code)) errors.push("it animates but does not handle prefers-reduced-motion");
    if (/(from|via|to|bg)-(purple|violet|indigo|fuchsia)-\d{3}/.test(code)) warnings.push("Tailwind purple or indigo colors: against the house rules");
    if (/\b(Lorem ipsum|John Doe|Jane Doe|Acme)\b/i.test(code)) warnings.push("placeholder content (Lorem ipsum, John Doe, Acme…)");
  }

  const preview = text(block, "preview") ?? "video";
  const shot = (ext) => existsSync(root(`public/previews/${slug}.${ext}`));
  if (!shot("jpg")) errors.push(`preview image missing: run npm run previews -- ${slug}`);
  if (preview !== "image" && !shot("mp4")) errors.push(`preview video missing: run npm run previews -- ${slug}`);
  return { slug, errors, warnings };
}

// --files <chemins…> : vérifie seulement les modèles dont le composant ou la démo a changé
// (l'automatisation GitHub passe la liste des fichiers modifiés par la pull request).
const args = process.argv.slice(2);
const filesMode = args[0] === "--files";
const touched = filesMode
  ? new Set(args.slice(1).filter((a) => a !== "--slugs").map((f) => f.match(/src\/(?:library|demos)\/([^/]+)\.tsx$/)?.[1]).filter(Boolean))
  : null;
const wanted = filesMode
  ? blocks.filter((b) => touched.has(text(b, "file")))
  : args.includes("--all")
    ? blocks
    : blocks.filter((b) => args.includes(text(b, "slug")));
// --slugs : affiche seulement les slugs concernés (pour filmer leurs aperçus), sans vérifier.
if (args.includes("--slugs")) {
  console.log(wanted.map((b) => text(b, "slug")).join(" "));
  process.exit(0);
}
if (filesMode && wanted.length === 0) {
  console.log("No component changed: nothing to check.");
  process.exit(0);
}
if (wanted.length === 0) {
  console.error(args.length ? `No entry for: ${args.join(", ")}` : "Give a slug, or --all.");
  process.exit(1);
}

let failed = 0;
for (const r of wanted.map(check)) {
  const mark = r.errors.length ? "✗" : "✓";
  console.log(`${mark} ${r.slug}`);
  r.errors.forEach((e) => console.log(`    error: ${e}`));
  r.warnings.forEach((w) => console.log(`    warning: ${w}`));
  if (r.errors.length) failed++;
}
process.exit(failed ? 1 : 0);
