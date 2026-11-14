import { useEffect } from "react";

export function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
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
      <button
        type="button"
        className="lb-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Fechar ampliação"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="lb-container" onClick={(e) => e.stopPropagation()}>
        <img className="lb-img" src={src} alt={alt || ""} />
        {alt && <p className="lb-caption">{alt}</p>}
      </div>
    </div>
  );
}
