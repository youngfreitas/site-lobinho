import { TourCard } from '../design-system';
import { imageUrl } from '../config/media';
import { PRICING, WHATSAPP } from '../config/site';
import { formatPrice } from '../lib/format';
import { useInView } from '../lib/hooks';
import { whatsappUrl } from '../lib/whatsapp';
import { Icon } from './Icon';
import { Reveal, ReviewFlag } from './Reveal';

const half = (cents: number) => Math.round(cents / 2);
const orList = (items: readonly string[]) => new Intl.ListFormat('pt-BR', { type: 'disjunction' }).format(items);

export function Pricing() {
  const consultUrl = whatsappUrl(WHATSAPP.messages.precos);
  // O TourCard oficial não tem lazy loading: a foto só é definida quando a seção se aproxima da tela.
  // Até lá, o próprio cartão mostra a ilustração de ondas do Design System.
  const [sectionRef, near] = useInView<HTMLElement>({ rootMargin: '800px 0px' });

  return (
    <section ref={sectionRef} id="valores" className="section pricing" aria-labelledby="valores-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="rotulo eyebrow">Valores e reserva</p>
          <h2 id="valores-title" className="titulo-1">
            Simples de entender, fácil de reservar.
          </h2>
          <p className="lead">A reserva é combinada pelo WhatsApp, de acordo com a disponibilidade da data escolhida.</p>
        </Reveal>

        <div className="pricing__grid">
          <Reveal className="pricing__offer">
            {/* Cartão de passeio oficial do Design System */}
            <TourCard
              title={PRICING.tourName}
              duration={PRICING.durationLabel}
              departure={`Saída: ${PRICING.departureLabel.toLowerCase()}`}
              description="Navegação panorâmica pelas 7 praias, parada para mergulho e desembarque na Praia do Flamengo."
              price={formatPrice(PRICING.regular.cents)}
              priceLabel="Passeio regular"
              unit="por pessoa"
              badge="Roteiro das 7 praias"
              imageSrc={near ? imageUrl('praia-flamengo', 800) : undefined}
              imageAlt="Praia do Flamengo, com água rasa e transparente"
              ctaLabel={consultUrl ? 'Consultar disponibilidade' : 'WhatsApp indisponível'}
              soldOut={!consultUrl}
              onBook={() => consultUrl && window.open(consultUrl, '_blank', 'noopener,noreferrer')}
            />
          </Reveal>

          <Reveal className="pricing__details" delay={80}>
            <h3 className="titulo-3">Valores por pessoa</h3>
            <table className="price-table">
              <caption className="sr-only">Valores do passeio das 7 praias por pessoa</caption>
              <tbody>
                <tr>
                  <th scope="row">{PRICING.regular.label}</th>
                  <td>{formatPrice(PRICING.regular.cents)}</td>
                </tr>
                <tr>
                  <th scope="row">{PRICING.holiday.label}</th>
                  <td>{formatPrice(PRICING.holiday.cents)}</td>
                </tr>
                <tr>
                  <th scope="row">
                    {PRICING.children.label}
                    <ReviewFlag show={PRICING.children.review} />
                  </th>
                  <td>
                    {PRICING.children.rule}
                    <span className="legenda price-table__note">
                      {formatPrice(half(PRICING.regular.cents))} · em feriados prolongados, {formatPrice(half(PRICING.holiday.cents))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="titulo-3">Como funciona a reserva</h3>
            <ol className="steps">
              <li>
                <span className="steps__icon" aria-hidden="true">
                  <Icon name="message" size={20} />
                </span>
                <div>
                  <strong>Consulte a data</strong>
                  <p>Fale com a gente pelo WhatsApp para ver a disponibilidade e combinar os detalhes.</p>
                </div>
              </li>
              <li>
                <span className="steps__icon" aria-hidden="true">
                  <Icon name="pix" size={20} />
                </span>
                <div>
                  <strong>Pague o sinal</strong>
                  <p>
                    Sinal de {formatPrice(PRICING.deposit.cents)} por pessoa, via {PRICING.deposit.method}, combinado na
                    conversa pelo WhatsApp.
                  </p>
                </div>
              </li>
              <li>
                <span className="steps__icon" aria-hidden="true">
                  <Icon name="card" size={20} />
                </span>
                <div>
                  <strong>Restante no dia</strong>
                  <p>
                    Pago no dia do passeio, antes do embarque: {orList(PRICING.balancePaymentMethods)}.
                  </p>
                </div>
              </li>
            </ol>

            <div className="policy">
              <h3 className="titulo-3 policy__title">
                <Icon name="cloud" size={20} />
                Clima e cancelamentos
                <ReviewFlag show={PRICING.policies.review} />
              </h3>
              <ul>
                <li>{PRICING.policies.weather}</li>
                <li>{PRICING.policies.customerCancellation}</li>
                <li>{PRICING.policies.refunds}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
