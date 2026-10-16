# TourCard

O cartão de um passeio na vitrine: foto, nome, duração e saída, preço por pessoa e o botão Reservar.

- Mostre sempre **duração**, **ponto de saída** e **preço por pessoa** — são as três dúvidas de todo cliente.
- O nome vai em Marcellus (`titulo-2`); descrição em uma ou duas frases, no máximo.
- Sem `imageSrc`, o cartão mostra a ilustração de ondas em `ceu` e `oceano`. Prefira foto real do passeio, horizontal 2:1.
- `badge` opcional para "Mais procurado", "Últimas vagas"; `soldOut` troca o botão por "Esgotado" desabilitado.
- Em grade, 3 por linha no desktop, 1 no mobile, `space-5` entre eles.
- O consumidor fornece os textos já formatados (preço "R$ 120") e o `onBook`.
