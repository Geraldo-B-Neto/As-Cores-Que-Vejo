#!/usr/bin/env bash
# Baixa as imagens do Figma para public/img.
# As URLs do Figma expiram em 7 dias. Se expirarem, peça o design de novo
# (get_design_context) ou exporte cada imagem manualmente no Figma.
set -e
P="https://www.figma.com/api/mcp/asset/f745dd2c-e3f9-470b-8bf0-4fb314b61f48"
cd "$(dirname "$0")/../public/img"
dl() { curl -fL "$P/$1" -o "$2"; }
dl 46afa.png natureza-1.png
dl d7524.png natureza-7.png
dl 61cd2.png natureza-14.png
dl 446c3.png natureza-15.png
dl f81c0.png natureza-5.png
dl cce46.png natureza-16.png
dl fa2fe.png natureza-13.png
dl 7b361.png natureza-4.png
echo "Pronto: 8 imagens em public/img"
