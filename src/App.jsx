import { createContext, useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import Preloader from "./Preloader";
import { useParallax } from "./hooks";
import { Lightbox } from "./Lightbox";
import {
  CollageZoom, CotidianoCarousel, CotidianoCollageZoom, CotidianoEssence,
  CotidianoFeelings, CotidianoIntro, CotidianoMarquee,
  Essence, Feelings, Footer, Hero, Intro, TextMarquee, Verde,
} from "./sections";

/* Context global para abrir o lightbox de qualquer imagem */
export const LightboxCtx = createContext(null);
export const useLightbox = () => useContext(LightboxCtx);

export default function App() {
  const [phase, setPhase] = useState("loading");
  const [lb, setLb] = useState(null); // { src, alt }
  useParallax();

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", phase === "loading");
    if (phase === "loading") window.scrollTo(0, 0);
  }, [phase]);

  return (
    <LightboxCtx.Provider value={(src, alt) => setLb({ src, alt })}>
      {phase !== "done" && (
        <Preloader onExit={() => setPhase("leaving")} onDone={() => setPhase("done")} />
      )}
      <Nav />
      <main>
        <Hero ready={phase !== "loading"} />

        {/* ── Bloco Natureza ── */}
        <Intro />
        <CollageZoom />
        <TextMarquee />
        <Feelings />
        <Essence />
        <Verde />

        {/* ── Bloco Cotidiano ── */}
        <CotidianoIntro />
        <CotidianoCollageZoom />
        <CotidianoMarquee />
        <CotidianoFeelings />
        <CotidianoEssence />
        <CotidianoCarousel />
      </main>
      <Footer />

      <Lightbox src={lb?.src} alt={lb?.alt} onClose={() => setLb(null)} />
    </LightboxCtx.Provider>
  );
}
