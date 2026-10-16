# Passeios Lobinho — design system

Passeios Lobinho faz passeios de lancha. A marca nasce do selo circular: uma lancha branca cortando o mar azul, com o nome em letras claras contornadas de azul-marinho, dentro de um anel royal e um aro prateado. Tudo neste sistema vem dali: o azul em camadas (royal, oceano, céu), o branco da espuma, o círculo e a sensação de mar limpo e dia de sol.

## Voz e conteúdo

A Lobinho fala como o barqueiro que conhece cada praia: simpático, direto, seguro. O cliente está planejando um dia de lazer — o texto tira dúvidas e dá vontade de ir.

- **Faça:** frases curtas, verbo na frente ("Reserve seu passeio", "Veja o roteiro"), informação prática logo de cara (horário, duração, ponto de saída, preço por pessoa), "você".
- **Evite:** urgência falsa ("só hoje!!!"), excesso de exclamações, emoji em títulos, jargão náutico sem explicação.
- **Preços:** sempre "R$ 120 por pessoa" — símbolo, espaço, valor, unidade.
- **Horários:** "9h", "9h30", "das 9h às 13h".
- **Exemplos:** "Saída às 9h do píer. Volta por volta das 13h." · "Coletes salva-vidas para todos a bordo." · "Mar agitado? A gente remarca sem custo."

## Cores

O azul é a identidade; use-o em camadas, como no selo — nunca um azul só.

| Token | Papel |
| --- | --- |
| `lancha` | O azul royal do anel. Ação principal (Reservar), links, estado ativo. **Um botão principal por tela.** |
| `marinho` | O contorno escuro das letras. Rodapé, faixas institucionais, blocos de destaque com texto `sobre-marinho`. |
| `oceano` | O mar. Ilustrações, ícones grandes, fundos decorativos. Não é cor de texto no tema Dia (só 3:1). |
| `ceu` / `ceu-suave` | O céu. Faixas e fundos tingidos; texto em `tinta`. |
| `espuma` / `espuma-elevada` | Fundos — a página e os cartões. |
| `tinta` / `tinta-suave` | Texto principal e secundário. |
| `sucesso`, `alerta`, `erro` (+ `-suave`) | Só estados: vagas disponíveis, últimas vagas, esgotado. Ficam pequenos — nunca viram cor de marca. |

Há dois temas, **Dia** (claro, o padrão) e **Noite** (o mar escuro). Todo par de texto indicado nas notas dos tokens passa 4,5:1 nos dois temas. O anel de foco do teclado é `foco`: 2px de folga na cor da página e depois 2px de `lancha`.

## Tipografia

- **Marcellus** (`--font-display`) para títulos: uma sem-serifa de traço alargado que lembra o letreiro do selo. Fica bem em caixa alta com um pouco de espaçamento (`display`, `titulo-1`, `titulo-2`). Só em 24px ou mais.
- **Figtree** (`--font-sans`) para todo o resto: corpo, botões, formulários, preços. Pesos 400, 600 e 700.
- Os estilos são classes prontas: `.display`, `.titulo-1`, `.titulo-2`, `.titulo-3`, `.corpo`, `.corpo-forte`, `.legenda`, `.rotulo`.

## Forma, espaço e profundidade

- **O círculo manda.** Botões e selos são pílulas (`radius-pill`); cartões têm cantos generosos (`radius-lg`); avatares e ícones de destaque vão em círculo.
- **Espaçamento** em passos de 4/8px: `space-4` (16px) é o gutter mobile, `space-5` (24px) o padding de cartão, `space-8` (64px) a distância entre seções no desktop.
- **Sombras** são azuladas e suaves (`sombra-cartao`, `sombra-flutuante`), como luz refletida na água — nada de preto duro.

## Logo

O selo está em **Logos** (`passeios-lobinho-selo.jpg`). Regras:

- Sempre inteiro e redondo; não recorte a lancha nem separe o texto do anel.
- Fundo claro (`espuma` ou branco). Sobre foto, só em área calma do céu ou com um círculo branco atrás.
- Tamanho mínimo: 96px de diâmetro na tela; respiro em volta de pelo menos 1/4 do diâmetro.
- Não aplique sombra, contorno ou outra cor por cima.

O arquivo atual é uma imagem raster (JPG com fundo branco). Para impressão, adesivos da lancha e uniformes, vale vetorizar o selo (SVG) e criar uma versão simplificada só com a lancha, para ícones e favicon.

## Iconografia e fotos

- Ícones de traço arredondado, 2px, cantos redondos (ex.: Lucide), na cor `lancha` ou `tinta-suave`.
- Fotos: mar, céu aberto, gente se divertindo a bordo, praias do roteiro. Luz de dia, azul saturado, horizonte reto. Evite fotos escuras ou filtradas em sépia.
- Ilustração: ondas e arcos simples em `oceano` e `ceu`, ecoando os anéis do selo.

## Componentes

Os componentes estão em `components/bundle.js` como `window.Lobinho` (React 18): **Button**, **Badge** e **TourCard** (cartão de passeio). Cada um tem suas regras de uso na própria página.
