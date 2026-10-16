import { FAQ, WHATSAPP } from '../config/site';
import { Icon } from './Icon';
import { Reveal, ReviewFlag } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';

/** Perguntas frequentes com <details>/<summary>: acessível por teclado e leitor de tela, sem JavaScript. */
export function Faq() {
  return (
    <section id="duvidas" className="section faq" aria-labelledby="duvidas-title">
      <div className="container faq__grid">
        <Reveal className="section-head faq__head">
          <p className="rotulo eyebrow">Perguntas frequentes</p>
          <h2 id="duvidas-title" className="titulo-1">
            Dúvidas sobre o passeio
          </h2>
          <p className="lead">Não encontrou o que procurava? A gente responde pelo WhatsApp.</p>
          <WhatsAppButton message={WHATSAPP.messages.duvidas} variant="secondary">
            Perguntar no WhatsApp
          </WhatsAppButton>
        </Reveal>

        <Reveal className="faq__list">
          {FAQ.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                <span className="faq__q">{item.q}</span>
                <Icon name="chevronDown" size={20} className="faq__chevron" />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
                <ReviewFlag show={Boolean(item.review)} />
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
