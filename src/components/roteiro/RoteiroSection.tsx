import { useCallback, useState } from 'react';
import { BEACHES, WHATSAPP } from '../../config/site';
import { Reveal } from '../Reveal';
import { WhatsAppButton } from '../WhatsAppButton';
import { BeachGallery } from './BeachGallery';
import { RouteMap } from './RouteMap';

/**
 * Roteiro das sete praias. O índice da praia ativa vive SOMENTE aqui (fonte única de verdade);
 * a galeria e o mapa apenas leem `active` e pedem mudanças por `select`.
 */
export function RoteiroSection() {
  const [active, setActive] = useState(0);
  const total = BEACHES.length;

  const select = useCallback((index: number) => setActive(((index % total) + total) % total), [total]);
  const beach = BEACHES[active];

  return (
    <section id="roteiro" className="section roteiro" aria-labelledby="roteiro-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="rotulo eyebrow">Roteiro panorâmico</p>
          <h2 id="roteiro-title" className="titulo-1">
            Sete praias, um só passeio.
          </h2>
          <p className="lead">
            Navegue pelo litoral de Ubatuba e conheça cada parada do roteiro. Toque no mapa ou deslize as fotos para
            explorar.
          </p>
        </Reveal>

        <div className="roteiro__grid">
          <BeachGallery active={active} onSelect={select} />
          <RouteMap active={active} onSelect={select} />
        </div>

        {/* Anuncia a troca de praia para leitores de tela, venha ela do mapa ou da galeria. */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Parada {active + 1} de {total}: {beach.name}.
        </p>

        <Reveal className="roteiro__cta">
          <p>Gostou do roteiro? Fale com a gente e veja as datas disponíveis.</p>
          <WhatsAppButton message={WHATSAPP.messages.roteiro} variant="secondary">
            Consultar disponibilidade
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
