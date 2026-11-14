import { useEffect } from "react";
import { COT, IMG } from "./assets";
import { Footer } from "./sections";
import { useLightbox } from "./App";

const NATUREZA_ITEMS = [
  { src: IMG.n1, title: "Entardecer na Mata", note: "A luz que encontra passagem entre as folhas e pinta o chão de dourado." },
  { src: IMG.n4, title: "Manhã Viva", note: "O frescor das primeiras horas e o calor que desperta a floresta." },
  { src: IMG.n7, title: "O Horizonte Dourado", note: "Cores que nenhum pincel humano conseguiria alcançar com tanta pureza." },
  { src: IMG.n2, title: "O Silêncio dos Campos", note: "Onde o vento é o único som e o tempo parece finalmente descansar." },
  { src: IMG.n5, title: "Imensidão Verde", note: "Um oceano de folhas onde a vida pulsa sem interferência." },
  { src: IMG.n14, title: "Raízes e Texturas", note: "A história viva da terra gravada em cada tronco e folhagem." },
  { src: IMG.n16, title: "Luz Entre o Dossel", note: "Feixes solares rasgando a sombra como lembretes de esperança." },
  { src: IMG.n15, title: "Refúgio Secreto", note: "A calma que a cidade nos faz esquecer que existe." },
  { src: IMG.n13, title: "Sutilezas da Terra", note: "A beleza está no que é simples, paciente e verdadeiro." },
  { src: IMG.sol1, title: "O Sol Como Testemunha", note: "Ele nasce todos os dias para nos lembrar da beleza de recomeçar." },
];

const COTIDIANO_ITEMS = [
  { src: COT.c1, title: "Rua em Repouso", note: "Antes da pressa começar, as esquinas descansam sob o céu calmo." },
  { src: COT.c2, title: "O Pulso Urbano", note: "Milhares de vidas se cruzando no mesmo instante sem se darem conta." },
  { src: COT.c3, title: "Caminhos e Sombras", note: "A geometria involuntária que a luz do sol desenha nas calçadas." },
  { src: COT.c4, title: "Luz de Fim de Tarde", note: "O instante exato em que a cidade comum se transforma em arte." },
  { src: COT.c5, title: "O Entardecer nas Ruas", note: "A luz dourada banhando o caminho de volta para casa." },
  { src: COT.c6, title: "Onde Nascem os Sonhos", note: "Entre salas simples, a esperança de quem ainda acredita no amanhã." },
  { src: COT.c7, title: "A Dignidade do Labor", note: "O trabalho honesto que molda cada um dos nossos dias." },
];

export default function ContemplarView({ category = "natureza", onBack, onSwitchCategory }) {
  const openLb = useLightbox();
  const isNatureza = category === "natureza";
  const items = isNatureza ? NATUREZA_ITEMS : COTIDIANO_ITEMS;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [category]);

  return (
    <article className="contemplar-page" aria-label={`Galeria de contemplação: ${category}`}>
      {/* ── Barra superior minimalista com botão voltar e seletor ── */}
      <header className="contemplar-header">
        <button
          type="button"
          className="retomar-btn retomar-btn--top"
          onClick={onBack}
          aria-label="Voltar para a página inicial"
        >
          <svg viewBox="0 0 20 8" aria-hidden="true">
            <path d="M20 4H1.5M5 .6 1.2 4 5 7.4" fill="none" stroke="currentColor" strokeWidth=".8" />
          </svg>
          <span>Retomar</span>
        </button>

        <div className="contemplar-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isNatureza}
            className={`contemplar-tab ${isNatureza ? "is-active" : ""}`}
            onClick={() => onSwitchCategory("natureza")}
          >
            Natureza
          </button>
          <span className="contemplar-tab-divider">/</span>
          <button
            type="button"
            role="tab"
            aria-selected={!isNatureza}
            className={`contemplar-tab ${!isNatureza ? "is-active" : ""}`}
            onClick={() => onSwitchCategory("cotidiano")}
          >
            Cotidiano
          </button>
        </div>
      </header>

      {/* ── Título principal da coleção ── */}
      <section className="contemplar-hero">
        <h1 className="contemplar-title">
          {isNatureza ? "NATUREZA" : "COTIDIANO"}
        </h1>
        <div className="contemplar-line" aria-hidden="true" />
        <p className="contemplar-subtitle">
          {isNatureza
            ? "A natureza é o meio mais próximo que temos de poder ver a beleza desse mundo aonde o homem ainda não corrompeu."
            : "Momentos onde o tempo desacelera e a poesia se revela nas coisas mais simples da nossa rotina."}
        </p>
        <span className="contemplar-meta">
          Coleção com {items.length} fotografias contemplativas
        </span>
      </section>

      {/* ── Galeria Vertical de Contemplação ── */}
      <section className="contemplar-gallery">
        {items.map((item, idx) => (
          <figure key={item.src + idx} className="contemplar-item">
            <div className="contemplar-img-wrap">
              <img
                src={item.src}
                alt={item.title}
                loading={idx < 2 ? "eager" : "lazy"}
                className="contemplar-img lb-trigger"
                onClick={() => openLb && openLb(item.src, `${item.title} — ${item.note}`)}
              />
              <span className="contemplar-badge">
                {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <figcaption className="contemplar-caption">
              <h2 className="contemplar-caption-title">{item.title}</h2>
              <p className="contemplar-caption-note">{item.note}</p>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* ── Botão Retomar inferior idêntico ao protótipo do usuário ── */}
      <div className="contemplar-bottom-action">
        <button
          type="button"
          className="retomar-btn retomar-btn--bottom"
          onClick={onBack}
          aria-label="Voltar para a página inicial"
        >
          <svg viewBox="0 0 20 8" aria-hidden="true">
            <path d="M20 4H1.5M5 .6 1.2 4 5 7.4" fill="none" stroke="currentColor" strokeWidth=".8" />
          </svg>
          <span>Retomar</span>
        </button>
      </div>

      {/* ── Rodapé oficial do projeto ── */}
      <Footer />
    </article>
  );
}
