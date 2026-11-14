import { useEffect, useState } from "react";
import { useGalleryNav } from "./App";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { openGallery, isGalleryActive, closeGallery } = useGalleryNav();

  /* bloqueia scroll do body quando aberto */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* fecha com ESC */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => setOpen((v) => !v);

  const handleNavNatureza = () => {
    setOpen(false);
    openGallery("natureza");
  };

  const handleNavCotidiano = () => {
    setOpen(false);
    openGallery("cotidiano");
  };

  const handleNavHome = () => {
    setOpen(false);
    closeGallery();
  };

  return (
    <>
      {/* ── Botão hamburguer – topo direito ── */}
      <button
        className={`nav-burger ${open ? "is-open" : ""}`}
        onClick={toggle}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {/* ── Overlay fullscreen ── */}
      <div className={`nav-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>

        {/* Links centrais */}
        <nav className="nav-overlay__links">
          {isGalleryActive && (
            <button
              type="button"
              className="nav-overlay__item"
              onClick={handleNavHome}
              style={{ "--i": 0 }}
            >
              INÍCIO
            </button>
          )}
          <button
            type="button"
            className="nav-overlay__item"
            onClick={handleNavNatureza}
            style={{ "--i": isGalleryActive ? 1 : 0 }}
          >
            NATUREZA
          </button>
          <button
            type="button"
            className="nav-overlay__item"
            onClick={handleNavCotidiano}
            style={{ "--i": isGalleryActive ? 2 : 1 }}
          >
            COTIDIANO
          </button>
        </nav>

        {/* Rodapé de contato */}
        <footer className="nav-overlay__foot" style={{ "--i": 3 }}>
          <p>CONTATO</p>
          <p>Whatsapp — 34 9 2000-9882</p>
          <p>@ascoresquevejo</p>
          <p>@geraldobrunoreisdesiqueiraneto</p>
        </footer>
      </div>
    </>
  );
}
