import { createContext, useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import Preloader from "./Preloader";
import { useParallax } from "./hooks";
import { Lightbox } from "./Lightbox";
import ContemplarView from "./ContemplarView";
import {
  CollageZoom, CotidianoCarousel, CotidianoCollageZoom, CotidianoEssence,
  CotidianoFeelings, CotidianoIntro, CotidianoMarquee,
  Essence, Feelings, Footer, Hero, Intro, TextMarquee, Verde,
} from "./sections";

/* Context global para abrir o lightbox de qualquer imagem */
export const LightboxCtx = createContext(null);
export const useLightbox = () => useContext(LightboxCtx);

/* Context global para navegação na galeria dedicada */
export const GalleryNavCtx = createContext({
  openGallery: () => {},
  closeGallery: () => {},
  isGalleryActive: false,
});
export const useGalleryNav = () => useContext(GalleryNavCtx);

export default function App() {
  const [phase, setPhase] = useState("loading");
  const [lb, setLb] = useState(null); // { src, alt }
  const [galleryPage, setGalleryPage] = useState(null); // 'natureza' | 'cotidiano' | null
  useParallax();

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", phase === "loading");
    if (phase === "loading") window.scrollTo(0, 0);
  }, [phase]);

  // Sincroniza com hash da URL para suportar o botão "Voltar" do navegador/celular
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("contemplar-natureza") || hash === "#natureza") {
        setGalleryPage("natureza");
      } else if (hash.includes("contemplar-cotidiano") || hash === "#cotidiano") {
        setGalleryPage("cotidiano");
      } else if (!hash.includes("contemplar-")) {
        setGalleryPage(null);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("popstate", checkHash);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("popstate", checkHash);
    };
  }, []);

  const openGallery = (category) => {
    setGalleryPage(category);
    window.location.hash = `contemplar-${category}`;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeGallery = () => {
    setGalleryPage(null);
    if (window.location.hash.startsWith("#contemplar-")) {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  const openLightbox = (src, alt = "Fotografia") => {
    if (!src) return;
    setLb({ src, alt });
  };

  // Garante que QUALQUER imagem clicada no site inteiro abra no lightbox
  const handleGlobalImgClick = (e) => {
    const imgEl = e.target.closest("img");
    if (imgEl && imgEl.src && !imgEl.closest(".lb-backdrop") && !imgEl.closest("button")) {
      openLightbox(imgEl.src, imgEl.alt || "Fotografia");
    }
  };

  const galleryNavValue = {
    openGallery,
    closeGallery,
    isGalleryActive: Boolean(galleryPage),
  };

  return (
    <LightboxCtx.Provider value={openLightbox}>
      <GalleryNavCtx.Provider value={galleryNavValue}>
        {phase !== "done" && (
          <Preloader onExit={() => setPhase("leaving")} onDone={() => setPhase("done")} />
        )}
        <Nav />

        {galleryPage ? (
          <ContemplarView
            category={galleryPage}
            onBack={closeGallery}
            onSwitchCategory={(cat) => openGallery(cat)}
          />
        ) : (
          <main onClickCapture={handleGlobalImgClick}>
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

            <Footer />
          </main>
        )}

        <Lightbox src={lb?.src} alt={lb?.alt} onClose={() => setLb(null)} />
      </GalleryNavCtx.Provider>
    </LightboxCtx.Provider>
  );
}
