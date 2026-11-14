import { useEffect, useState } from "react";
import { COT, IMG } from "./assets";

const POETIC_PHRASES = [
  "Ajustando o foco...",
  "Observando as sutilezas...",
  "Revelando as cores que vejo...",
];

export default function Preloader({ onExit, onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    let exited = false;
    const startTime = performance.now();
    const DURATION = 2200; // Tempo total suave de 2.2s

    // Pré-carrega silenciosamente em background sem travar o contador
    const allImages = [...Object.values(IMG).slice(0, 3), ...Object.values(COT).slice(0, 2)];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Troca frases poéticas durante o loading
    const phraseInterval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % POETIC_PHRASES.length);
    }, 700);

    let rafId;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      // Easing suave (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.min(Math.round(eased * 100), 100);
      setCount(currentCount);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else if (!exited) {
        exited = true;
        clearInterval(phraseInterval);
        setTimeout(() => {
          setLeaving(true);
          onExit();
          setTimeout(onDone, 950);
        }, 250);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(phraseInterval);
    };
  }, [onExit, onDone]);

  return (
    <div className={`pre ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Carregando">
      <div className="pre__bands" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      <div className="pre__ui">
        <div className="pre__top">
          <p className="pre__brand">PORTFÓLIO CONTEMPLATIVO</p>
          <span className="pre__dot" />
        </div>

        <div className="pre__center">
          <p className="pre__count">{String(count).padStart(3, "0")}</p>
          <p className="pre__phrase">{POETIC_PHRASES[phraseIdx]}</p>
        </div>

        <div className="pre__bottom">
          <div className="pre__line-track">
            <div className="pre__line-fill" style={{ width: `${count}%` }} />
          </div>
          <div className="pre__foot-row">
            <span>AS CORES QUE VEJO</span>
            <span>{count}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
