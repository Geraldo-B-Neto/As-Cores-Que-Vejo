import { useEffect, useState } from "react";
import { IMG } from "./assets";

const MIN_MS = 2200; // tempo mínimo de preloader
const BANDS = 5; // 5 faixas, como o grupo de retângulos do Figma

export default function Preloader({ onExit, onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf = 0;
    let loaded = false;
    let exited = false;
    const timers = [];
    const start = performance.now();

    // espera todas as imagens carregarem (ou falharem — não trava o site)
    Promise.all(
      Object.values(IMG).map(
        (src) =>
          new Promise((resolve) => {
            const im = new Image();
            im.onload = im.onerror = resolve;
            im.src = src;
          })
      )
    ).then(() => (loaded = true));

    const tick = (now) => {
      const t = Math.min((now - start) / MIN_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      const shown = loaded ? eased : Math.min(eased, 0.9);
      setCount(Math.round(shown * 100));

      if (shown >= 1 && !exited) {
        exited = true;
        timers.push(
          setTimeout(() => {
            setLeaving(true);
            onExit();
            timers.push(setTimeout(onDone, 1500));
          }, 350)
        );
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`pre ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Carregando">
      <div className="pre__bands" aria-hidden="true">
        {Array.from({ length: BANDS }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>
      <div className="pre__ui">
        <p className="pre__brand">AS CORES QUE VEJO</p>
        <p className="pre__count">{String(count).padStart(3, "0")}</p>
        <span className="pre__bar" style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}
