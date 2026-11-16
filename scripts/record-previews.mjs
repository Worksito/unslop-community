#!/usr/bin/env node
// Filme chaque démo de la vitrine et en tire une vidéo d'aperçu légère (MP4, lu partout) et une image fixe.
// Lancer avec le serveur de dev démarré :  npm run previews            (tous les modèles)
//                                          npm run previews -- trou-noir coverflow   (seulement ceux-là)
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// puppeteer-core est installé globalement sur cette machine ; on pilote le Chrome du système.
const globalRoot = execFileSync("npm", ["root", "-g"]).toString().trim();
const puppeteer = createRequire(join(globalRoot, "noop.js"))("puppeteer-core");

const BASE = process.env.VITRINE_URL ?? "http://localhost:5173/";
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
const OUT = fileURLToPath(new URL("../public/previews/", import.meta.url));
const TMP = fileURLToPath(new URL("../.previews-tmp/", import.meta.url));
// Chaque vidéo est filmée à la taille exacte de sa carte (largeur donnée par le catalogue).
const only = process.argv.slice(2);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ffmpeg = (...args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);
const kb = (f) => Math.round(statSync(f).size / 1024);

// Pour les effets au survol : la souris traverse la démo en s'arrêtant sur chaque élément interactif.
async function sweep(page, m) {
  const targets = await page.$$eval(".stage a, .stage button", (els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }),
  );
  const stop = (m.seconds * 1000) / Math.max(1, targets.length + 1);
  await page.mouse.move(20, m.height / 2);
  for (const t of targets) {
    await page.mouse.move(t.x, t.y, { steps: 18 });
    await sleep(stop);
  }
  await page.mouse.move(m.width - 20, m.height - 20, { steps: 18 });
  await sleep(stop);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  // WebGL logiciel, pour que la barre liquide et le trou noir se dessinent aussi en headless.
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--mute-audio"],
});

try {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const catalog = await page.evaluate(() => window.__vitrine);
  const todo = catalog.filter((m) => only.length === 0 || only.includes(m.slug));
  if (todo.length === 0) throw new Error(`Aucun modèle ne correspond à : ${only.join(", ")}`);

  for (const m of todo) {
    // Fenêtre de bureau (1440 px) pour que les tailles liées à l'écran soient celles du vrai site ;
    // la démo y est posée à la largeur de sa carte, et la vidéo est recadrée sur elle.
    await page.setViewport({ width: 1440, height: m.height, deviceScaleFactor: 1 });
    await page.goto("about:blank");
    await page.goto(`${BASE}#/apercu/${m.slug}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const poster = join(OUT, `${m.slug}.jpg`);

    if (m.preview === "image") {
      await sleep(800);
      await page.screenshot({ path: poster, type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: m.width, height: m.height } });
      console.log(`${m.slug} : image ${kb(poster)} Ko`);
      continue;
    }

    // Un cycle d'animation exactement : la vidéo boucle alors sans à-coup pour les démos qui se rejouent.
    await sleep(600);
    const raw = join(TMP, `${m.slug}.webm`);
    const recorder = await page.screencast({ path: raw });
    if (m.preview === "hover") await sweep(page, m);
    else await sleep(m.seconds * 1000);
    await recorder.stop();

    const mp4 = join(OUT, `${m.slug}.mp4`);
    const w = m.width - (m.width % 2), hh = m.height - (m.height % 2);
    const vf = `fps=30,crop=${w}:${hh}:0:0`;
    ffmpeg("-i", raw, "-t", String(m.seconds), "-an", "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4);
    ffmpeg("-ss", String(Math.min(1.6, m.seconds - 0.5)), "-i", mp4, "-frames:v", "1", "-q:v", "4", poster);
    console.log(`${m.slug} : ${m.seconds} s, vidéo ${kb(mp4)} Ko, image ${kb(poster)} Ko`);
  }
} finally {
  await browser.close();
  rmSync(TMP, { recursive: true, force: true });
}
