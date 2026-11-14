import { useInView } from "./hooks";

/** Linha de texto que sobe de dentro de uma máscara (usada no hero, controlada por `active`) */
export function Mask({ as: Tag = "span", active, delay = 0, className = "", children }) {
  return (
    <Tag className={`mask ${className}`}>
      <span className={`mask__in ${active ? "in" : ""}`} style={{ "--d": `${delay}s` }}>
        {children}
      </span>
    </Tag>
  );
}

/**
 * Text split: separa em linhas > palavras > letras e anima cada letra
 * com atraso crescente quando o título entra na tela.
 */
export function SplitText({ lines, as: Tag = "h2", className = "", delay = 0, step = 0.03 }) {
  const [ref, seen] = useInView({ threshold: 0.35 });
  let n = 0;
  return (
    <Tag ref={ref} className={`split ${seen ? "in" : ""} ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span className="split__line" key={li} aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi}>
              {wi > 0 && " "}
              <span className="split__word">
                {[...word].map((ch, ci) => (
                  <span
                    className="split__char"
                    key={ci}
                    style={{ transitionDelay: `${(delay + n++ * step).toFixed(3)}s` }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Fade + subida simples quando entra na tela */
export function Reveal({ as: Tag = "div", delay = 0, y = 28, className = "", children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}s`, "--y": `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Imagem "solta": entra voando de uma direção, girada, e assenta na rotação final.
 * `box` posiciona (absoluto); `speed` liga o parallax; `className` vai no elemento externo.
 */
export function Fly({ box, className = "", dx = 0, dy = 60, r = 0, r0 = 0, delay = 0, speed, mode, children }) {
  const [ref, seen] = useInView({ threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  return (
    <div ref={ref} className={`abs ${className}`} style={box} data-speed={speed} data-mode={mode}>
      <div
        className={`fly ${seen ? "in" : ""}`}
        style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--r": `${r}deg`, "--r0": `${r0}deg`, "--d": `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

/** Scroll horizontal infinito (CSS puro): duas cópias do grupo + translateX(-50%) */
export function Marquee({ children, speed = 30, reverse = false, className = "" }) {
  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee__track"
        style={{ "--dur": `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((g) => (
          <div className="marquee__group" key={g} aria-hidden={g > 0 ? "true" : undefined}>
            {[0, 1, 2].map((k) => (
              <span key={k}>{children}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Arrow() {
  return (
    <svg className="pill__arrow" viewBox="0 0 20 8" aria-hidden="true">
      <path d="M0 4h18.5M15 .6 18.8 4 15 7.4" fill="none" stroke="currentColor" strokeWidth=".8" />
    </svg>
  );
}

export function Pill({ children = "Contemple algumas", tone = "light", href = "#" }) {
  return (
    <a className={`pill pill--${tone}`} href={href}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}
