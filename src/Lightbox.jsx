import { useEffect } from "react";

/**
 * Lightbox global.
 * Uso: importe useLightbox e envolva qualquer <img> com openLightbox(src, alt).
 * O Provider deve ficar na raiz do App.
 */
export function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="lb-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Imagem ampliada"}
    >
      <button className="lb-close" onClick={onClose} aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <img
        className="lb-img"
        src={src}
        alt={alt || ""}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

