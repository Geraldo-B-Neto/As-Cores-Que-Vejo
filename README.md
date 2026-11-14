# As cores que vejo — React + CSS + JS

1. `npm install`
2. Imagens: `./scripts/download-assets.sh` (baixa do Figma para `public/img`, os links expiram em 7 dias)
   — ou exporte do Figma e salve em `public/img` com estes nomes:
   natureza-1, -4, -5, -7, -13, -14, -15, -16 (.png)
3. `npm run dev`

Sem bibliotecas de animação: tudo com IntersectionObserver, scroll + requestAnimationFrame e CSS.

## Publicação no GitHub Pages

No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação. Depois disso, cada push na branch `main` executa o workflow `.github/workflows/deploy.yml`.

O site será publicado em https://geraldo-b-neto.github.io/As-Cores-Que-Vejo/.
