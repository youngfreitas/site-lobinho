import { useState } from 'react';
import { BOAT, WHATSAPP } from '../config/site';
import { Icon, type IconName } from './Icon';
import { MediaDialog, type MediaItem } from './MediaDialog';
import { ResponsiveImage } from './ResponsiveImage';
import { Reveal } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';

const ITEMS: MediaItem[] = BOAT.photos.map((p) => ({ kind: 'image', image: p.image, alt: p.alt, title: 'A lancha Lobinho' }));

/** Apenas especificações confirmadas pelo proprietário. */
const SPECS: { icon: IconName; label: string; value: string }[] = [
  { icon: 'anchor', label: 'Modelo', value: BOAT.model },
  { icon: 'ruler', label: 'Comprimento', value: `${BOAT.lengthFeet} pés` },
  { icon: 'users', label: 'Capacidade', value: `${BOAT.capacity} passageiros` },
];

export function Boat() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="lancha" className="section boat" aria-labelledby="lancha-title">
      <div className="container boat__grid">
        <Reveal className="boat__intro">
          <p className="rotulo eyebrow">A lancha</p>
          <h2 id="lancha-title" className="titulo-1">
            Seu próximo passeio começa aqui.
          </h2>
          <p className="lead">
            Apresentamos a Lobinho: uma lancha DIAMAR de 19 pés, preparada para proporcionar uma experiência de navegação
            pelo litoral de Ubatuba. Um convite para sair da rotina, contemplar paisagens incríveis e descobrir a região
            por outro ângulo.
          </p>
          <dl className="specs">
            {SPECS.map((s) => (
              <div key={s.label} className="specs__item">
                <dt>
                  <Icon name={s.icon} size={18} />
                  {s.label}
                </dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="boat__private">
            <p className="legenda">Quer a lancha só para o seu grupo?</p>
            <WhatsAppButton message={WHATSAPP.messages.privativo} variant="ghost">
              Consultar passeio privativo
            </WhatsAppButton>
          </div>
        </Reveal>

        <ul className="boat-gallery" aria-label="Fotos da lancha Lobinho">
          {BOAT.photos.map((p, i) => (
            <li key={p.image} className="boat-gallery__item">
              <button type="button" className="boat-gallery__btn" onClick={() => setOpen(i)} aria-haspopup="dialog">
                <ResponsiveImage
                  image={p.image}
                  alt={p.alt}
                  sizes={i === 0 ? '(min-width: 1024px) 380px, 80vw' : '(min-width: 1024px) 190px, 80vw'}
                />
                <span className="boat-gallery__zoom" aria-hidden="true">
                  <Icon name="expand" size={18} />
                </span>
                <span className="sr-only">Ampliar foto {i + 1} de {BOAT.photos.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <MediaDialog items={ITEMS} index={open} onChange={setOpen} label="Fotos da lancha Lobinho" />
    </section>
  );
}
