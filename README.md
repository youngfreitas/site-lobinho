# Lobinho Passeios de Lancha — homepage

Homepage da Lobinho Passeios de Lancha (Ubatuba, SP): roteiro das 7 praias com mapa interativo, vídeos reais,
apresentação da lancha, valores e conversão pelo WhatsApp.

**Stack:** Vite + React 18 + TypeScript, pré-renderizada em HTML estático na build. Sem bibliotecas de UI,
animação ou ícones de terceiros — só o Design System oficial.

## Executar

Requisitos: Node 20+ e, para reprocessar mídia, `ffmpeg`/`ffprobe` no PATH.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173 (mostra selos "Revisar antes de publicar")
npm run build      # gera dist/ (checa tipos, compila e pré-renderiza o HTML)
npm run preview    # serve dist/ em http://localhost:4173
npm run media      # (re)gera imagens e vídeos otimizados a partir dos originais
```

## Publicar

`dist/` é um site estático: envie a pasta para qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages,
GitHub Pages, S3…). Antes, crie `.env` com o domínio:

```bash
VITE_SITE_URL=https://www.seu-dominio.com.br
```

Recomenda-se configurar cache longo (`Cache-Control: public, max-age=31536000, immutable`) para `/assets/*` e
`/media/*` na hospedagem.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Telefone do WhatsApp, mensagens, preços, condições, praias, textos da experiência, vídeos, fotos da lancha, FAQ, SEO | `src/config/site.ts` (arquivo central tipado) |
| Mídia de origem → versões otimizadas | `scripts/optimize-media.mjs` (lista `SOURCES`) |
| Dimensões das mídias geradas (automático) | `src/config/media-manifest.json` — não editar à mão |
| Posições dos marcadores no mapa ilustrativo | `BEACHES[].map` em `src/config/site.ts` |

O que ainda falta enviar ou confirmar está em [MATERIAIS-PENDENTES.md](MATERIAIS-PENDENTES.md).

## Design System

O Design System oficial (**Passeios Lobinho**) é a única fonte de identidade visual. Uma cópia fiel fica em
`design-system/project/` (baixada do artifact do Design System):

- `tokens.json` → `scripts/build-tokens.mjs` gera `src/styles/tokens.css` (variáveis com os mesmos nomes dos
  tokens, `@font-face` das fontes oficiais Marcellus e Figtree e as classes `.display`, `.titulo-1`… `.rotulo`).
  Roda automaticamente em `dev` e `build`.
- `components/bundle.js` (Button, Badge, TourCard) é usado **sem alterações**: um plugin do Vite
  (`vite.config.ts`) o expõe como módulo ES, e `src/design-system/index.ts` o importa com o React da aplicação.
- `components/bundle.css` é importado como está.
- Complemento único: `ButtonLink` (`src/design-system/ButtonLink.tsx`) — o `Button` oficial sempre renderiza
  `<button>`, mas CTAs de âncora e WhatsApp precisam ser links. Ele reutiliza as classes oficiais `lb-btn`.

**Atualizar o Design System:** baixe de novo os arquivos de `project/` do artifact e substitua
`design-system/project/` (tokens.json, components/, fonts/). Rode `npm run dev` — os tokens são regerados.

## Arquitetura

```
src/
  config/site.ts            dados editáveis (fonte única)
  config/media.ts           acesso tipado ao manifesto de mídia
  design-system/            ponte para o Design System oficial
  lib/                      whatsapp (links validados), formatação, hooks (in-view, swipe, movimento reduzido)
  components/
    Header, Hero, Experience, VideoGallery, MediaDialog, Boat, Pricing, Faq, FinalCta, Footer
    roteiro/RoteiroSection  estado único da praia ativa → BeachGallery + RouteMap
  styles/global.css         composição das seções (mobile-first, só tokens oficiais)
  entry-server.tsx          pré-renderização + metadados SEO/Open Graph/JSON-LD
scripts/                    tokens, mídia e pré-renderização
public/media/               mídia otimizada (gerada)
```

### Decisões importantes

- **Mapa ilustrativo:** não há coordenadas verificadas, então o SVG é uma representação visual do roteiro,
  identificada na página como "fora de escala". Mapa e galeria compartilham um único estado
  (`RoteiroSection`); marcadores são um grupo de opções (`radiogroup`) navegável por setas.
- **Hero:** a lancha ocupa ~70% da largura do vídeo. Para não cortá-la nem cobri-la com texto, o vídeo usa um
  recorte 4:3 em todas as telas — empilhado no celular, em "janela de cinema" ao lado do texto no desktop.
  O pôster (AVIF/WebP) é o elemento principal da primeira tela; o vídeo (H.264 + WebM quando menor) só começa
  a baixar após o carregamento da página, não toca com `prefers-reduced-motion`, economia de dados ou rede 2G,
  pausa fora da tela e tem botão de pausa.
- **Vídeos da galeria:** só as capas carregam com a página; o vídeo é baixado ao abrir o modal (`<dialog>`
  nativo), há um único player (um vídeo por vez) e o download é interrompido ao fechar.
- **WhatsApp:** `whatsappUrl()` valida o número e devolve `null` se for inválido — os botões então aparecem
  desabilitados em vez de gerar links quebrados. O formulário "Monte sua consulta" só monta a mensagem; nada é
  enviado a servidores e a reserva é confirmada na conversa.
- **TourCard oficial:** o componente espera foto 2:1 e não tem lazy loading. Sem alterar o Design System, a
  composição aplica `min-height: 0` na mídia do cartão (para fotos verticais não esticarem o cartão) e só define a
  foto quando a seção se aproxima da tela. Vale levar as duas melhorias para o próprio Design System.

## Testes realizados (16/10/2026, build de produção)

| Verificação | Resultado |
| --- | --- |
| TypeScript (`tsc --noEmit`) e build com pré-renderização | ✅ sem erros |
| Console e hidratação (produção e dev) | ✅ sem erros |
| Links internos (âncoras) | ✅ todos apontam para seções existentes |
| Links do WhatsApp (8 links + cartão de preço + formulário) | ✅ todos `https://wa.me/5512996999817?text=…`, mensagens contextualizadas |
| Mapa ↔ galeria (clique no marcador, setas, indicador, teclado, deslizar, volta 7→1) | ✅ sincronizados, anúncio para leitor de tela |
| Modal de vídeo (abrir, tocar, Esc, foco devolvido, download interrompido, 1 vídeo por vez) | ✅ |
| Menu mobile (foco, Esc, trava de rolagem) | ✅ |
| Movimento reduzido (simulado) | ✅ vídeo não baixa; pôster + botão "Reproduzir" |
| Falha do vídeo do hero (simulada) | ✅ pôster permanece, controle some |
| Rolagem horizontal em 320, 360, 375, 390, 430, 768, 1024 e 1440 px | ✅ nenhum elemento fora da tela |
| Lighthouse celular (4G simulado) | Desempenho 98 · Acessibilidade 100 · Boas práticas 100 · SEO 100 — LCP 2,2 s, CLS 0, TBT 0 ms |
| Lighthouse desktop | 100 · 100 · 100 · 100 — LCP 0,5 s, CLS 0 |

**Não testado (sem acesso nesta sessão):** Safari em iPhone e Chrome em Android reais, teclado virtual e áreas
seguras em aparelho físico, PageSpeed Insights (exige o site publicado em um domínio). Recomenda-se fazer essas
verificações após a publicação.
