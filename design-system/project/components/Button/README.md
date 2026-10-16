# Button

Botões em pílula; o principal (lancha cheio) aparece uma vez por tela, para a ação que a tela existe para fazer — quase sempre "Reservar".

- **primary** — `lancha` com texto `sobre-lancha`. Uma vez por tela.
- **secondary** — contorno `lancha` sobre `espuma-elevada`. Ações de apoio: "Ver roteiro", "Falar no WhatsApp".
- **ghost** — só texto `lancha`. Ações terciárias e "Cancelar".
- Tamanhos `sm` (32px), `md` (44px, padrão — alvo de toque confortável), `lg` (52px, hero). `block` ocupa a largura toda, para a barra de reserva fixa no mobile.
- Texto: verbo na frente, curto, sem ponto final: "Reservar", "Ver horários".
- Foco do teclado: anel `foco` com folga na cor da página. Desabilitado: fundo `linha`, texto `tinta-suave`.
- O consumidor fornece `onClick` e o texto; ícones podem ir dentro, antes do texto.
