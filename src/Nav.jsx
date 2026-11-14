import { useEffect, useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

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
          <a
            href="#fotos"
            className="nav-overlay__item"
            onClick={() => setOpen(false)}
            style={{ "--i": 0 }}
          >
            NATUREZA
          </a>
          <a
            href="#cotidiano-fotos"
            className="nav-overlay__item"
            onClick={() => setOpen(false)}
            style={{ "--i": 1 }}
          >
            COTIDIANO
          </a>
        </nav>

        {/* Rodapé de contato */}
        <footer className="nav-overlay__foot" style={{ "--i": 2 }}>
          <p>CONTATO</p>
          <p>Whatsapp — 34 9 2000-9882</p>
          <p>@ascoresquevejo</p>
          <p>@geraldobrunoreisdesiqueiraneto</p>
        </footer>
      </div>
    </>
  );
}
