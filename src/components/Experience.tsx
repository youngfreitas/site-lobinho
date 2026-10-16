import { EXPERIENCE, TOUR, WHATSAPP } from '../config/site';
import { Icon, type IconName } from './Icon';
import { ResponsiveImage } from './ResponsiveImage';
import { Reveal } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';

const STEP_ICONS: IconName[] = ['waves', 'turtle', 'mask', 'pin'];

const FACTS: { icon: IconName; label: string; value: string }[] = [
  { icon: 'clock', label: 'Duração total', value: TOUR.totalDuration },
  { icon: 'waves', label: 'Navegação', value: '45 min a 1 h' },
  { icon: 'mask', label: 'Parada para mergulho', value: TOUR.snorkel },
  { icon: 'pin', label: 'Desembarque no Flamengo', value: 'Aproximadamente 3 h' },
  { icon: 'anchor', label: 'Saída', value: TOUR.departure },
];

export function Experience() {
  return (
    <section id="experiencia" className="section experience" aria-labelledby="experiencia-title">
      <div className="container">
        <Reveal className="section-head section-head--on-dark">
          <p className="rotulo eyebrow">A experiência</p>
          <h2 id="experiencia-title" className="titulo-1">
            Não é só o destino. É tudo o que acontece pelo caminho.
          </h2>
        </Reveal>

        <ol className="timeline">
          {EXPERIENCE.map((step, i) => (
            <Reveal as="li" key={step.title} className="timeline__item" delay={i * 90}>
              <div className="timeline__media">
                <ResponsiveImage image={step.image} alt={step.alt} sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" />
              </div>
              <div className="timeline__body">
                <span className="timeline__marker" aria-hidden="true">
                  <Icon name={STEP_ICONS[i]} size={20} />
                </span>
                <p className="rotulo timeline__index">Etapa {i + 1}</p>
                <h3 className="titulo-3 timeline__title">{step.title}</h3>
                <p className="legenda timeline__meta">{step.meta}</p>
                <p className="timeline__text">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="facts" as="dl">
          {FACTS.map((f) => (
            <div key={f.label} className="facts__item">
              <dt>
                <Icon name={f.icon} size={18} />
                {f.label}
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>

        <Reveal className="experience__cta">
          <WhatsAppButton message={WHATSAPP.messages.experiencia} variant="secondary">
            Tirar dúvidas pelo WhatsApp
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
