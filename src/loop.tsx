import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";

// Pause globale de toutes les boucles, pilotée par le bouton du menu.
const LoopPause = createContext<{ paused: boolean; toggle: () => void }>({ paused: false, toggle: () => {} });

export function LoopProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <LoopPause value={{ paused, toggle: () => setPaused((p) => !p) }}>{children}</LoopPause>;
}

export const useLoopPause = () => use(LoopPause);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Renvoie un compteur qui avance toutes les `every` ms, pour remonter une démo et la rejouer.
 * La boucle s'arrête hors écran, onglet caché, au survol ou au focus, sur pause, et sous mouvement réduit.
 */
export function useLoop<T extends HTMLElement>(every: number | undefined) {
  const ref = useRef<T>(null);
  const { paused } = useLoopPause();
  const [tick, setTick] = useState(0);
  const [held, setHeld] = useState({ seen: false, hover: false, focus: false, hidden: false });

  useEffect(() => {
    const el = ref.current;
    if (!el || !every) return;
    const set = (k: keyof typeof held, v: boolean) => setHeld((h) => (h[k] === v ? h : { ...h, [k]: v }));
    const io = new IntersectionObserver(([e]) => set("seen", e.isIntersecting));
    io.observe(el);
    const on = (t: string, k: keyof typeof held, v: boolean) => {
      const f = () => set(k, v);
      el.addEventListener(t, f);
      return () => el.removeEventListener(t, f);
    };
    const offs = [on("pointerenter", "hover", true), on("pointerleave", "hover", false), on("focusin", "focus", true), on("focusout", "focus", false)];
    const vis = () => set("hidden", document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      offs.forEach((off) => off());
      document.removeEventListener("visibilitychange", vis);
    };
  }, [every]);

  // Une démo qui entre à l'écran ou qu'on survole repart de zéro : on la voit jouer au lieu de la trouver déjà finie.
  const canPlay = !!every && !paused && !reduced();
  useEffect(() => {
    if (canPlay && (held.seen || held.hover)) setTick((n) => n + 1);
  }, [canPlay, held.seen, held.hover]);

  const running = canPlay && held.seen && !held.hover && !held.focus && !held.hidden;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((n) => n + 1), every);
    return () => window.clearInterval(id);
  }, [running, every]);

  return { ref, tick };
}
