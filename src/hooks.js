import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true (uma única vez) quando o elemento entra na tela */
export function useInView({ threshold = 0.2, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold, rootMargin]);

  return [ref, seen];
}

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Progresso de scroll de uma seção "pinned" (0 → 1) gravado na CSS var --z.
 * Não re-renderiza o React: só atualiza o estilo do elemento.
 */
export function useScrollVar(ref, map = (p) => p) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.setProperty("--z", "1");
      el.classList.add("is-done");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const z = map(p);
      el.style.setProperty("--z", z.toFixed(4));
      el.classList.toggle("is-done", z > 0.85);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

/**
 * Parallax global. Qualquer elemento com data-speed é movido no eixo Y.
 *  - data-mode="scroll": y = scrollY * speed (começa na posição do design; usado no hero)
 *  - padrão: y = (centro da viewport - centro do elemento) * speed
 * speed > 0 = camada "distante" (anda mais devagar); speed < 0 = camada "próxima".
 */
export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const items = Array.from(document.querySelectorAll("[data-speed]")).map((el) => ({
      el,
      speed: parseFloat(el.dataset.speed) || 0,
      scrollMode: el.dataset.mode === "scroll",
      y: 0,
    }));

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const it of items) {
        if (it.scrollMode) {
          if (window.scrollY > vh * 1.5) continue;
          it.y = window.scrollY * it.speed;
        } else {
          const r = it.el.getBoundingClientRect();
          const center = r.top + r.height / 2 - it.y; // posição sem o deslocamento atual
          const delta = vh / 2 - center;
          if (Math.abs(delta) > vh * 1.6) continue;
          it.y = delta * it.speed;
        }
        it.el.style.transform = `translate3d(0, ${it.y.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
