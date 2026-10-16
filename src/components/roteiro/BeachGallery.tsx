import { useState, type KeyboardEvent } from 'react';
import { Badge, Button } from '../../design-system';
import { BEACHES } from '../../config/site';
import { useSwipe } from '../../lib/hooks';
import { Icon } from '../Icon';
import { images } from '../../config/media';
import { ResponsiveImage } from '../ResponsiveImage';
import { ReviewFlag } from '../Reveal';

interface Props {
  active: number;
  onSelect: (index: number) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function BeachGallery({ active, onSelect }: Props) {
  const total = BEACHES.length;
  const beach = BEACHES[active];
  const prev = BEACHES[(active - 1 + total) % total];
  const next = BEACHES[(active + 1) % total];
  const stageRef = useSwipe<HTMLDivElement>((dir) => onSelect(dir === 'left' ? active + 1 : active - 1));

  // Carrega só a foto ativa e as vizinhas (pré-carregadas para a próxima troca); as já vistas ficam.
  const near = [active - 1, active, active + 1].map((i) => (i + total) % total);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set(near));
  if (near.some((i) => !loaded.has(i))) setLoaded(new Set([...loaded, ...near]));

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSelect(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelect(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelect(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelect(total - 1);
    }
  };

  return (
    <div className="beach-gallery" role="region" aria-roledescription="carrossel" aria-label="Fotos das praias do roteiro">
      <div
        ref={stageRef}
        className="beach-gallery__stage"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`Foto ${active + 1} de ${total}: ${beach.name}. Use as setas para trocar de praia.`}
      >
        {BEACHES.map((b, i) => (
          <figure key={b.id} className="beach-slide" data-active={i === active || undefined} aria-hidden={i !== active}>
            {b.image && !loaded.has(i) ? (
              <div className="beach-slide__pending" style={{ backgroundColor: images[b.image].color }} />
            ) : b.image ? (
              <ResponsiveImage image={b.image} alt={b.alt} sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 100vw" />
            ) : (
              <BeachPlaceholder name={b.name} />
            )}
          </figure>
        ))}
        <span className="beach-gallery__counter" aria-hidden="true">
          {pad(active + 1)} / {pad(total)}
        </span>
      </div>

      <div className="beach-gallery__caption" key={beach.id}>
        <p className="rotulo eyebrow">Parada {pad(active + 1)}</p>
        <h3 className="titulo-2 beach-gallery__title">{beach.name}</h3>
        <p className="beach-gallery__text">{beach.description}</p>
        <div className="beach-gallery__tags">
          {beach.landing ? <Badge tone="lancha">Desembarque</Badge> : <Badge>Vista a bordo</Badge>}
          <ReviewFlag show={!beach.image} />
        </div>
      </div>

      <div className="beach-gallery__controls">
        <Button variant="secondary" className="icon-btn" aria-label={`Praia anterior: ${prev.name}`} onClick={() => onSelect(active - 1)}>
          <Icon name="chevronLeft" size={22} />
        </Button>
        <ol className="beach-progress" aria-label="Paradas do roteiro">
          {BEACHES.map((b, i) => (
            <li key={b.id}>
              <button
                type="button"
                className="beach-progress__step"
                data-state={i === active ? 'active' : i < active ? 'done' : undefined}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`Parada ${i + 1}: ${b.name}`}
                onClick={() => onSelect(i)}
              >
                <span aria-hidden="true">{i + 1}</span>
              </button>
            </li>
          ))}
        </ol>
        <Button variant="secondary" className="icon-btn" aria-label={`Próxima praia: ${next.name}`} onClick={() => onSelect(active + 1)}>
          <Icon name="chevronRight" size={22} />
        </Button>
      </div>
    </div>
  );
}

/** Espaço reservado identificado, enquanto a foto real da praia não chega. Usa a ilustração de ondas do Design System. */
function BeachPlaceholder({ name }: { name: string }) {
  return (
    <div className="beach-placeholder" role="img" aria-label={`Fotografia da ${name} em breve`}>
      <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect className="lb-w-sky" width="320" height="400" />
        <circle className="lb-w-ring" cx="250" cy="300" r="150" />
        <circle className="lb-w-ring" cx="250" cy="300" r="100" />
        <path className="lb-w-sea" d="M0 270 Q40 254 80 270 T160 270 T240 270 T320 270 V400 H0 Z" />
        <path className="lb-w-foam" fill="none" d="M0 290 Q40 278 80 290 T160 290 T240 290 T320 290" />
      </svg>
      <span className="beach-placeholder__label">Foto em breve</span>
    </div>
  );
}
