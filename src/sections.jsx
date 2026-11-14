import { useCallback, useEffect, useRef, useState } from "react";
import { COT, IMG } from "./assets";
import { easeInOut, prefersReducedMotion, useScrollVar } from "./hooks";
import { Fly, Marquee, Mask, Pill, Reveal, SplitText } from "./ui";
import { useLightbox } from "./App";

const CAPTION =
  "A natureza é o meio mais próximo que temos de poder ver a beleza desse mundo aonde o homem ainda não comrrompeu.";

/* Posiciona em unidades do design mobile (402px). --k = largura/402 */
const kbox = (x, y, w, h) => ({
  left: `calc(${x} * var(--k))`,
  top: `calc(${y} * var(--k))`,
  width: `calc(${w} * var(--k))`,
  height: `calc(${h} * var(--k))`,
});

/* ───────────── 1. HERO: entrada vertical + parallax ───────────── */
export function Hero({ ready }) {
  return (
    <header className="hero" id="inicio">
      {/* Topo esquerdo: subtítulo em três linhas */}
      <div className="hero__title" data-speed="0.1" data-mode="scroll">
        {["PORTFÓLIO", "CONTEMPLATIVO", "DO MEU UNIVERSO"].map((line, i) => (
          <Mask key={line} active={ready} delay={0.35 + i * 0.12}>
            {line}
          </Mask>
        ))}
      </div>

      {/* Centro: título principal */}
      <div className="hero__center" data-speed="-0.06" data-mode="scroll">
        <Mask as="h1" className="hero__big" active={ready} delay={0.7}>
          AS CORES QUE VEJO
        </Mask>
      </div>

      {/* Rodapé centralizado: tag */}
      <div className="hero__bottom" data-speed="0.08" data-mode="scroll">
        <Mask className="hero__tag" active={ready} delay={1}>
          "Sejamos luz aonde há trevas"
        </Mask>
      </div>
    </header>
  );
}

/* ───────────── 2. INTRO: text split + entrada de textos ───────────── */
export function Intro() {
  return (
    <section className="intro">
      <SplitText
        lines={["MOMENTOS AONDE O", "MUNDO VOLTA A SER", "COLORIDO"]}
        className="intro__title"
      />
      <Reveal as="p" delay={0.45} className="intro__text">
        Fotos que buscam traduzir um pouco sobre como eu observo o mundo que me rodeia.
      </Reveal>
      <Reveal delay={0.7} y={0} className="intro__line grow" />
    </section>
  );
}

/* ───────────── 3. COLAGEM + ZOOM IN na imagem central ─────────────
   Seção "pinned": enquanto o scroll corre, --z vai de 0 a 1.
   A imagem central (212px no design) cresce até cobrir a tela,
   as imagens ao redor se afastam e o texto aparece no final.   */
const SATELLITES = [
  { src: IMG.n5, x: 7, y: 0, w: 81, h: 81, dx: -90, dy: -50, r: -3, r0: -14, ox: -38, oy: -26, d: 0.1 },
  { src: IMG.n7, x: 7, y: 93, w: 81, h: 119, dx: -90, dy: 70, r: 2, r0: 12, ox: -44, oy: 12, d: 0.25 },
  { src: IMG.n14, x: 308, y: 0, w: 90, h: 120, dx: 90, dy: -60, r: 3, r0: 14, ox: 40, oy: -30, d: 0.4 },
  { src: IMG.n15, x: 309, y: 132, w: 81, h: 81, dx: 90, dy: 70, r: -2, r0: -12, ox: 46, oy: 22, d: 0.55 },
];

// medidas do design: imagem central 212×212 em x=92; centro em (198, 106)
const ubox = (x, y, w, h) => ({
  left: `calc(50% + ${x - 198} * var(--u))`,
  top: `calc(50% + ${y - 106} * var(--u))`,
  width: `calc(${w} * var(--u))`,
  height: `calc(${h} * var(--u))`,
});

const zoomCurve = (p) => easeInOut(Math.min(Math.max((p - 0.06) / 0.82, 0), 1));

export function CollageZoom() {
  const ref = useRef(null);
  const [entered, setEntered] = useState(false);
  const openLb = useLightbox();
  useScrollVar(ref, zoomCurve);

  // entra: dispara a animação das imagens quando a seção aparece
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setEntered(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={`zoom ${entered ? "is-in" : ""}`} ref={ref} id="fotos">
      <div className="zoom__stage">
        {SATELLITES.map((s) => (
          <Fly
            key={s.src + s.x + s.y}
            className="sat"
            box={{ ...ubox(s.x, s.y, s.w, s.h), "--ox": s.ox, "--oy": s.oy }}
            dx={s.dx}
            dy={s.dy}
            r={s.r}
            r0={s.r0}
            delay={s.d}
          >
            <img src={s.src} alt="" className="lb-trigger" onClick={() => openLb(s.src, "")} />
          </Fly>
        ))}

        <figure className="zoom__frame">
          <img className="zoom__img lb-trigger" src={IMG.n1} alt="Paisagem verde ao entardecer" onClick={() => openLb(IMG.n1, "Paisagem verde ao entardecer")} />
          <figcaption className="zoom__copy">
            <h2>
              FOTOS VOLTADOS
              <br />
              PARA NATUREZA
            </h2>
            <p>A natureza é o meio mais próximo que temos de poder ver a beleza desse mundo aonde o homem ainda não comrrompeu.</p>
            <Pill href="#sentimentos">Contemple algumas</Pill>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── 4. MARQUEE infinito "NATUREZA . FOTOS" ───────────── */
export function TextMarquee() {
  return (
    <section className="marq" aria-label="Natureza, fotos">
      <Marquee speed={32}>NATUREZA . FOTOS . </Marquee>
    </section>
  );
}

/* ───────────── 5. FOTOGRÁFIAS TRADUZINDO SENTIMENTOS ─────────────
   Imagens "despojadas": rotações, cantos diferentes, parallax e flutuação lenta. */
export function Feelings() {
  const openLb = useLightbox();
  return (
    <section className="feel" id="sentimentos">
      <div className="feel__text">
        <SplitText
          lines={["FOTOGRÁFIAS", "TRADUZINDO", "SENTIMENTOS"]}
          className="feel__title"
          step={0.025}
        />
        <Reveal as="p" delay={0.5}>{CAPTION}</Reveal>
        <Reveal delay={0.7}>
          <Pill tone="dark" href="#essencia">Contemple algumas</Pill>
        </Reveal>
      </div>

      <Fly box={kbox(0, 37, 178, 237)} dx={-120} dy={40} r={-4} r0={-18} delay={0.1} speed={0.08}>
        <img className="float f1 lb-trigger" src={IMG.n14} alt="" onClick={() => openLb(IMG.n14, "")} />
      </Fly>
      <Fly box={kbox(224, 246, 123, 181)} dx={120} dy={90} r={3.5} r0={16} delay={0.3} speed={-0.1}>
        <img className="float f2 lb-trigger" src={IMG.n7} alt="" onClick={() => openLb(IMG.n7, "")} />
      </Fly>
      <Fly box={kbox(38, 300, 94, 125)} dx={-60} dy={140} r={-2} r0={-22} delay={0.5} speed={0.16}>
        <img className="float f3 lb-trigger" src={IMG.n16} alt="" onClick={() => openLb(IMG.n16, "")} />
      </Fly>
    </section>
  );
}

/* ───────────── 6. BUSCANDO VER TODA A ESSÊNCIA ─────────────
   Text split nas palavras + imagem central que troca sozinha. */
const SWAP_IMAGES = [IMG.n13, IMG.n4, IMG.n16, IMG.n5, IMG.n15];

function Swapper({ images, interval = 2400 }) {
  const [s, setS] = useState({ cur: 0, prev: -1 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(
      () => setS((c) => ({ cur: (c.cur + 1) % images.length, prev: c.cur })),
      interval
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <span className="swap" aria-hidden="true">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`swap__img ${i === s.cur ? "is-cur" : ""} ${i === s.prev ? "is-prev" : ""}`}
        />
      ))}
    </span>
  );
}

export function Essence() {
  return (
    <section className="ess" id="essencia">
      <div className="ess__row ess__row--top">
        <SplitText lines={["BUSCANDO"]} as="p" className="ess__word" />
        <Reveal as="p" delay={0.5} className="ess__note">
          Não quero passar apenas fotos bonitas, quero olhar mais profundamente
        </Reveal>
      </div>

      <div className="ess__row ess__row--mid">
        <SplitText lines={["VER"]} as="p" className="ess__word" delay={0.3} />
        <Reveal y={0} delay={0.5} className="ess__swap">
          <Swapper images={SWAP_IMAGES} />
        </Reveal>
        <SplitText lines={["TODA"]} as="p" className="ess__word" delay={0.55} />
      </div>

      <div className="ess__row ess__row--end">
        <SplitText lines={["A ESSÊNCIA"]} as="p" className="ess__word" delay={0.75} />
      </div>
    </section>
  );
}

/* ───────────── 7. O VERDE E O SOL: carrossel + marquee de fundo ───────────── */
const SLIDES = [
  { img: IMG.n4,  alt: "Sol entre as árvores",       caption: "A luz filtrada pelas folhas transforma qualquer manhã em algo sagrado." },
  { img: IMG.n1,  alt: "Paisagem verde ao entardecer", caption: "O verde profundo da mata carrega o silêncio que a cidade não conhece." },
  { img: IMG.n16, alt: "Luz entre a mata",            caption: "Raios de sol rasgam o dossel e tocam a terra como promessas." },
  { img: IMG.n7,  alt: "Entardecer na natureza",      caption: "O entardecer pinta o horizonte com cores que nenhum pincel alcança." },
  { img: IMG.n14, alt: "Detalhe da vegetação",        caption: "Nas texturas da casca e da folha, toda a história da floresta está escrita." },
  { img: IMG.n5,  alt: "Campo aberto sob o céu",      caption: "O campo aberto convida os olhos a descansarem no infinito." },
];

function Carousel({ slides }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const openLb = useLightbox();

  const go = useCallback((d) => setI((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    if (paused || dragging || prefersReducedMotion()) return;
    const id = setInterval(() => go(1), 4500);
    return () => clearInterval(id);
  }, [paused, dragging, go]);

  const onDown = (e) => {
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => dragging && setDrag(e.clientX - startX.current);
  const onEnd = () => {
    if (!dragging) return;
    if (Math.abs(drag) > 50) go(drag < 0 ? 1 : -1);
    setDrag(0);
    setDragging(false);
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="O verde e o sol"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`carousel__viewport ${dragging ? "is-dragging" : ""}`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
      >
        <div
          className="carousel__track"
          style={{
            transform: `translateX(calc(${drag}px - (var(--sw) / 2 + ${i} * (var(--sw) + var(--gap)))))`,
          }}
        >
          {slides.map((s, idx) => (
            <figure
              className={`slide ${idx === i ? "is-active" : ""}`}
              key={s.img}
              aria-hidden={idx === i ? undefined : "true"}
            >
              <img
                src={s.img}
                alt={s.alt}
                draggable={false}
                className="lb-trigger"
                onClick={() => !dragging && openLb(s.img, s.alt)}
              />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="carousel__ctrl">
        <button type="button" className="round" onClick={() => go(-1)} aria-label="Foto anterior">
          <svg viewBox="0 0 20 8" aria-hidden="true"><path d="M20 4H1.5M5 .6 1.2 4 5 7.4" fill="none" stroke="currentColor" strokeWidth=".8" /></svg>
        </button>
        <div className="dots">
          {slides.map((s, idx) => (
            <button
              type="button"
              key={s.img}
              className={idx === i ? "is-on" : ""}
              onClick={() => setI(idx)}
              aria-label={`Ir para a foto ${idx + 1}`}
              aria-current={idx === i ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" className="round" onClick={() => go(1)} aria-label="Próxima foto">
          <svg viewBox="0 0 20 8" aria-hidden="true"><path d="M0 4h18.5M15 .6 18.8 4 15 7.4" fill="none" stroke="currentColor" strokeWidth=".8" /></svg>
        </button>
      </div>
    </div>
  );
}

export function Verde() {
  return (
    <section className="verde">
      <Marquee className="verde__bg" speed={40} reverse>
        A ESSÊNCIA ESTÁ NO OLHAR{"\u00A0"}
      </Marquee>
      <Reveal as="p" className="verde__label">O VERDE E O SOL</Reveal>
      <Reveal y={60} delay={0.15} className="verde__stage">
        <Carousel slides={SLIDES} />
      </Reveal>
      <Reveal delay={0.3} className="verde__cta">
        <Pill href="#contato">Contemple algumas</Pill>
      </Reveal>
    </section>
  );
}

/* ───────────── 8. RODAPÉ ───────────── */
export function Footer() {
  return (
    <footer className="foot" id="contato">
      <div className="foot__row">
        <Reveal as="h3" className="foot__name">
          Geraldo
          <br />
          Bruno
        </Reveal>
        <Reveal delay={0.2} className="foot__contact">
          <p>CONTATO</p>
          <p>Whatssap - 34 9 2000 - 9882</p>
          <p>@ascoresquevejo</p>
          <p>@geraldobrunoreisdesiqueiraneto</p>
        </Reveal>
      </div>
      <SplitText lines={["AS CORES QUE VEJO"]} as="p" className="foot__big" step={0.035} />
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLOCO COTIDIANO — mesmo padrão do bloco Natureza
   ═══════════════════════════════════════════════════════════════ */

const CAPTION_COT =
  "O cotidiano esconde belezas que só enxergamos quando paramos para olhar de verdade.";

/* ───────────── COTIDIANO: Intro ───────────── */
export function CotidianoIntro() {
  return (
    <section className="intro">
      <SplitText
        lines={["MOMENTOS QUE O", "TEMPO TORNA", "ESPECIAIS"]}
        className="intro__title"
      />
      <Reveal as="p" delay={0.45} className="intro__text">
        Fotos que capturam a poesia escondida nas cenas de todo dia.
      </Reveal>
      <Reveal delay={0.7} y={0} className="intro__line grow" />
    </section>
  );
}

/* ───────────── COTIDIANO: CollageZoom ───────────── */
const COT_SATELLITES = [
  { src: COT.c5, x: 7,   y: 0,   w: 81, h: 81,  dx: -90, dy: -50, r: -3,  r0: -14, ox: -38, oy: -26, d: 0.1  },
  { src: COT.c7, x: 7,   y: 93,  w: 81, h: 119, dx: -90, dy: 70,  r: 2,   r0: 12,  ox: -44, oy: 12,  d: 0.25 },
  { src: COT.c4, x: 308, y: 0,   w: 90, h: 120, dx: 90,  dy: -60, r: 3,   r0: 14,  ox: 40,  oy: -30, d: 0.4  },
  { src: COT.c8, x: 309, y: 132, w: 81, h: 81,  dx: 90,  dy: 70,  r: -2,  r0: -12, ox: 46,  oy: 22,  d: 0.55 },
];

export function CotidianoCollageZoom() {
  const ref = useRef(null);
  const [entered, setEntered] = useState(false);
  const openLb = useLightbox();
  useScrollVar(ref, zoomCurve);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setEntered(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={`zoom ${entered ? "is-in" : ""}`} ref={ref} id="cotidiano-fotos">
      <div className="zoom__stage">
        {COT_SATELLITES.map((s) => (
          <Fly
            key={s.src + s.x + s.y}
            className="sat"
            box={{ ...ubox(s.x, s.y, s.w, s.h), "--ox": s.ox, "--oy": s.oy }}
            dx={s.dx} dy={s.dy} r={s.r} r0={s.r0} delay={s.d}
          >
            <img src={s.src} alt="" className="lb-trigger" onClick={() => openLb(s.src, "")} />
          </Fly>
        ))}

        <figure className="zoom__frame">
          <img className="zoom__img lb-trigger" src={COT.c1} alt="Cena do cotidiano" onClick={() => openLb(COT.c1, "Cena do cotidiano")} />
          <figcaption className="zoom__copy">
            <h2>
              FOTOS VOLTADAS
              <br />
              PARA O COTIDIANO
            </h2>
            <p>{CAPTION_COT}</p>
            <Pill href="#cotidiano-sentimentos">Contemple algumas</Pill>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── COTIDIANO: TextMarquee ───────────── */
export function CotidianoMarquee() {
  return (
    <section className="marq" aria-label="Cotidiano, fotos">
      <Marquee speed={32}>COTIDIANO . FOTOS . </Marquee>
    </section>
  );
}

/* ───────────── COTIDIANO: Feelings ───────────── */
export function CotidianoFeelings() {
  const openLb = useLightbox();
  return (
    <section className="feel" id="cotidiano-sentimentos">
      <div className="feel__text">
        <SplitText
          lines={["FOTOGRAFIAS", "REVELANDO", "O INVISÍVEL"]}
          className="feel__title"
          step={0.025}
        />
        <Reveal as="p" delay={0.5}>{CAPTION_COT}</Reveal>
        <Reveal delay={0.7}>
          <Pill tone="dark" href="#cotidiano-essencia">Contemple algumas</Pill>
        </Reveal>
      </div>

      <Fly box={kbox(0, 37, 178, 237)} dx={-120} dy={40} r={-4} r0={-18} delay={0.1} speed={0.08}>
        <img className="float f1 lb-trigger" src={COT.c4} alt="" onClick={() => openLb(COT.c4, "")} />
      </Fly>
      <Fly box={kbox(224, 246, 123, 181)} dx={120} dy={90} r={3.5} r0={16} delay={0.3} speed={-0.1}>
        <img className="float f2 lb-trigger" src={COT.c7} alt="" onClick={() => openLb(COT.c7, "")} />
      </Fly>
      <Fly box={kbox(38, 300, 94, 125)} dx={-60} dy={140} r={-2} r0={-22} delay={0.5} speed={0.16}>
        <img className="float f3 lb-trigger" src={COT.c8} alt="" onClick={() => openLb(COT.c8, "")} />
      </Fly>
    </section>
  );
}

/* ───────────── COTIDIANO: Essence ───────────── */
const COT_SWAP_IMAGES = [COT.c3, COT.c5, COT.c6, COT.c7, COT.c2];

export function CotidianoEssence() {
  return (
    <section className="ess" id="cotidiano-essencia">
      <div className="ess__row ess__row--top">
        <SplitText lines={["BUSCANDO"]} as="p" className="ess__word" />
        <Reveal as="p" delay={0.5} className="ess__note">
          Não quero apenas registrar — quero sentir cada instante do dia
        </Reveal>
      </div>

      <div className="ess__row ess__row--mid">
        <SplitText lines={["VER"]} as="p" className="ess__word" delay={0.3} />
        <Reveal y={0} delay={0.5} className="ess__swap">
          <Swapper images={COT_SWAP_IMAGES} />
        </Reveal>
        <SplitText lines={["TODA"]} as="p" className="ess__word" delay={0.55} />
      </div>

      <div className="ess__row ess__row--end">
        <SplitText lines={["A ESSÊNCIA"]} as="p" className="ess__word" delay={0.75} />
      </div>
    </section>
  );
}

/* ───────────── COTIDIANO: Carousel ───────────── */
const COT_SLIDES = [
  { img: COT.c1, alt: "Rua vazia numa manhã tranquila",                      caption: "Há poesia nas ruas quando o movimento ainda dorme." },
  { img: COT.c2, alt: "A cidade em movimento",                               caption: "O pulso da cidade pulsa diferente quando você para para sentir." },
  { img: COT.c3, alt: "Calçadas que contam histórias",                       caption: "Cada calçada guarda os passos de quem já passou por ali." },
  { img: COT.c4, alt: "Luz e sombra nas ruas",                               caption: "A sombra projetada numa rua qualquer virou arte sem querer." },
  { img: COT.c5, alt: "O fim do dia nas ruas",                               caption: "O fim do dia pinta as ruas de um dourado que a pressa não enxerga." },
  { img: COT.c6, alt: "Escola — onde tudo começa",                           caption: "Entre paredes simples, nascem os sonhos mais complexos." },
  { img: COT.c7, alt: "O trabalho que molda o dia",                          caption: "Nas mãos que trabalham existe uma dignidade que merece ser vista." },
];

export function CotidianoCarousel() {
  return (
    <section className="verde">
      <Marquee className="verde__bg" speed={40} reverse>
        A BELEZA ESTÁ NOS DETALHES{"\u00A0"}
      </Marquee>
      <Reveal as="p" className="verde__label">O DIA A DIA</Reveal>
      <Reveal y={60} delay={0.15} className="verde__stage">
        <Carousel slides={COT_SLIDES} />
      </Reveal>
      <Reveal delay={0.3} className="verde__cta">
        <Pill href="#contato">Contemple algumas</Pill>
      </Reveal>
    </section>
  );
}
