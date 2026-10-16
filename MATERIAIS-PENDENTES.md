# Materiais e confirmações pendentes

Lista do que ainda precisa ser enviado ou confirmado pelo proprietário antes da publicação definitiva.
Em modo de desenvolvimento (`npm run dev`), os itens que dependem de confirmação aparecem na página com o
selo **"Revisar antes de publicar"**. Esse selo nunca aparece na versão publicada (`npm run build`).

## 1. Materiais

| Material | Situação | Como substituir |
| --- | --- | --- |
| Design System | ✅ Recebido (artifact "Passeios Lobinho") | Ver "Atualizar o Design System" no README |
| Logotipo oficial (selo) | ✅ Recebido (JPG raster) | Trocar `design-system/project/assets/Logos/…jpg` e rodar `npm run media`. O próprio Design System recomenda vetorizar o selo (SVG) e criar uma versão simplificada para favicon. |
| Vídeo do hero | ✅ Recebido (`Vídeo do barco para hero.webm`, 10 s, 1920×1080) | Substituir o arquivo (mesmo nome) e rodar `npm run media`. O recorte 4:3 (x 240 → 1680) mantém a lancha inteira; se o enquadramento do novo vídeo mudar, ajuste `crop=` em `scripts/optimize-media.mjs`. |
| Fotos das praias | ⚠️ **6 de 7** — falta a **Praia da Ribeira** | Salvar a foto em `imagens praias/ribeira.webp` (ou .jpg), adicionar a entrada `'praia-ribeira'` em `SOURCES.images` de `scripts/optimize-media.mjs`, rodar `npm run media` e trocar `image: null` por `image: 'praia-ribeira'` na Praia da Ribeira em `src/config/site.ts`. Até lá aparece uma ilustração identificada como "Foto em breve". |
| Fotos da lancha | ✅ 2 externas + 6 a bordo | Adicionar/trocar em `SOURCES.images` e em `BOAT.photos` (`src/config/site.ts`). |
| Vídeos dos passeios | ✅ 5 vídeos | Trocar em `SOURCES.videos`/`SOURCES.frames` e `VIDEOS` (`src/config/site.ts`). |
| Número oficial do WhatsApp | ✅ +55 12 99699-9817 | `WHATSAPP.phone` em `src/config/site.ts` (só dígitos, com 55). Número inválido ⇒ nenhum link é gerado. |
| Domínio definitivo | ⏳ Pendente | Criar `.env` com `VITE_SITE_URL=https://seu-dominio.com.br` e rodar `npm run build`. Ativa `canonical`, `og:url` e URLs absolutas do Open Graph. |

## 2. Políticas comerciais a confirmar

Estão publicadas exatamente como foram informadas. Confirme cada uma (ou corrija em `src/config/site.ts`):

- [ ] **Crianças de até 5 anos pagam meia** (`PRICING.children`). A página mostra o valor calculado (R$ 49,95 / R$ 74,95 em feriados).
- [ ] **Feriados prolongados: R$ 149,90 por pessoa** (`PRICING.holiday`).
- [ ] **Sinal de R$ 30,00 por pessoa via Pix**; restante no dia, antes do embarque (crédito com taxa da máquina, débito, dinheiro ou Pix).
- [ ] **Mau tempo (cancelamento pela empresa):** reagendamento em até 30 dias ou estorno do sinal.
- [ ] **Cancelamento pelo cliente:** perda do sinal.
- [ ] **Estorno só por motivo climático.**
- [ ] Recomenda-se revisão jurídica das regras de cancelamento/estorno à luz do Código de Defesa do Consumidor antes da publicação.

## 3. Textos para revisar

- [ ] Descrições curtas das praias (`BEACHES[].description`): escritas a partir do que aparece nas fotos, sem afirmar características não informadas. A da Praia da Ribeira é genérica até chegar a foto.
- [ ] Títulos e descrições dos vídeos (`VIDEOS`): descrevem o que aparece em cada vídeo.
- [ ] As fotos das praias já trazem a arte "ROTEIRO SUL / Panorâmico". Na foto do Flamenguinho aparece também "Mergulho" — se a parada para mergulho for sempre ali, vale citar na descrição.

## 4. O que a página deliberadamente NÃO mostra

Por não ter sido informado: horário e local de saída ("Consultar"), endereço comercial, avaliações, depoimentos,
certificações, equipamentos ou comodidades da lancha, disponibilidade em tempo real, chave Pix e dados bancários.
