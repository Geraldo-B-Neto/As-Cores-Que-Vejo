const base = import.meta.env.BASE_URL;
const img = (name) => `${base}img/${name}`;

// Arquivos em public/img/natureza/
export const IMG = {
  n1:  img("natureza/Natureza 1.jpg"),
  n2:  img("natureza/Natureza 2.jpg"),
  n4:  img("natureza/Natureza 4.jpg"),
  n5:  img("natureza/Natureza 5.jpg"),
  n7:  img("natureza/Natureza 7.jpg"),
  n13: img("natureza/Natureza 13.jpg"),
  n14: img("natureza/Natureza 14.jpg"),
  n15: img("natureza/Natureza 15.jpg"),
  n16: img("natureza/Natureza 16.jpg"),
  sol1: img("natureza/Sol 1.jpg"),
};

// Arquivos em public/img/cotidiano/ (adicione as fotos nessa pasta)
export const COT = {
  c1:  img("cotidiano/Rua 1.jpg"),
  c2:  img("cotidiano/Rua 2.jpg"),
  c3:  img("cotidiano/Rua 3.jpg"),
  c4:  img("cotidiano/Rua 4.jpg"),
  c5:  img("cotidiano/Rua 5.jpg"),
  c6:  img("cotidiano/Escola 1.jpg"),
  c7:  img("cotidiano/Trabalho 1.jpg"),
  c8:  img("cotidiano/Rua 3.jpg"),
};
