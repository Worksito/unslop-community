import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { cardWidth, demoOf, findModel, models, type Model } from "./models";
import { LoopProvider, useLoop } from "./loop";

// Banc d'essai des composants communautaires.
//   #/              toutes les démos, à la taille de leur carte sur le site
//   #/apercu/<slug> une démo seule, plein cadre : c'est la page que filme `npm run previews`

function LiveDemo({ model }: { model: Model }) {
  const Demo = demoOf(model);
  return <Demo />;
}

function Stage({ model }: { model: Model }) {
  const { ref, tick } = useLoop<HTMLDivElement>(model.replayEvery);
  const style = {
    "--stage-height": `${model.stageHeight}px`,
    ...(model.stageColor && { "--stage-color": model.stageColor }),
  } as CSSProperties;
  return (
    <div ref={ref} className={model.stageColor ? "stage stage--tinted" : "stage"} style={style}>
      <div className="stage__demo" key={tick}>
        <Suspense fallback={null}>
          <LiveDemo model={model} />
        </Suspense>
      </div>
    </div>
  );
}

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const slug = hash.match(/^#\/apercu\/([a-z0-9-]+)$/)?.[1];
  const model = slug ? findModel(slug) : undefined;
  return (
    <LoopProvider>
      {model ? (
        <main className="apercu" style={{ width: cardWidth(model) }}>
          <Stage model={model} />
        </main>
      ) : (
        <main className="bench">
          <h1>Unslop community</h1>
          <p>Le banc d’essai des composants proposés. Chaque démo est montrée à la taille de sa carte sur le site.</p>
          <ul className="grid">
            {models.map((m) => (
              <li key={m.slug} style={{ "--span": m.span } as CSSProperties}>
                <Stage model={m} />
                <strong>{m.title}</strong>
                <small>
                  {m.category}, par {m.author.name}
                </small>
              </li>
            ))}
          </ul>
        </main>
      )}
    </LoopProvider>
  );
}
