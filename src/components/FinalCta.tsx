import { useEffect, useId, useState, type FormEvent } from 'react';
import { Button } from '../design-system';
import { PRICING } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

type Tipo = 'regular' | 'privativo';

/** Monta a mensagem do WhatsApp a partir do formulário rápido. Nada é enviado a servidores. */
function buildMessage(tipo: Tipo, date: string, adults: number, kids: number) {
  const parts = [
    tipo === 'privativo'
      ? 'Olá! Gostaria de consultar a possibilidade de um passeio privativo na lancha Lobinho.'
      : 'Olá! Gostaria de consultar a disponibilidade do passeio das 7 praias.',
  ];
  if (date) {
    const [y, m, d] = date.split('-');
    parts.push(`Data desejada: ${d}/${m}/${y}.`);
  }
  parts.push(`Pessoas: ${adults} ${adults === 1 ? 'adulto' : 'adultos'}${kids ? ` e ${kids} ${kids === 1 ? 'criança' : 'crianças'} de até ${PRICING.children.maxAge} anos` : ''}.`);
  return parts.join('\n');
}

function Stepper({ label, value, min, max, onChange, hint }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {hint && <span className="legenda field__hint">{hint}</span>}
      </label>
      <div className="stepper">
        <button type="button" className="stepper__btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Diminuir ${label.toLowerCase()}`}>
          <Icon name="minus" size={18} />
        </button>
        <input
          id={id}
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, Math.round(n))));
          }}
        />
        <button type="button" className="stepper__btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Aumentar ${label.toLowerCase()}`}>
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}

export function FinalCta() {
  const [tipo, setTipo] = useState<Tipo>('regular');
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [minDate, setMinDate] = useState<string>();
  const dateId = useId();

  // Data mínima calculada no navegador (evita divergência entre pré-renderização e hidratação).
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDate(now.toISOString().slice(0, 10));
  }, []);

  const url = whatsappUrl(buildMessage(tipo, date, adults, kids));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="consultar" className="section final-cta" aria-labelledby="final-title">
      <svg className="final-cta__rings" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        {[80, 150, 220, 290].map((r) => (
          <circle key={r} cx="300" cy="300" r={r} />
        ))}
      </svg>
      <div className="container final-cta__grid">
        <Reveal className="final-cta__text">
          <picture className="final-cta__selo">
            <source type="image/avif" srcSet="/media/brand/selo-192.avif 1x, /media/brand/selo-384.avif 2x" />
            <img src="/media/brand/selo-192.webp" srcSet="/media/brand/selo-384.webp 2x" width={120} height={120} alt="Selo Passeios Lobinho" loading="lazy" />
          </picture>
          <h2 id="final-title" className="titulo-1">
            Ubatuba está esperando por você.
          </h2>
          <p className="lead">
            Sete praias, paisagens incríveis e uma experiência para viver de perto. Consulte a disponibilidade e planeje seu
            próximo passeio com a Lobinho.
          </p>
        </Reveal>

        <Reveal className="consult-form-wrap" delay={100}>
          <form className="consult-form" onSubmit={submit} aria-labelledby="consult-title">
            <h3 id="consult-title" className="titulo-3">
              Monte sua consulta
            </h3>
            <p className="legenda consult-form__help">
              Preencha em segundos: a mensagem abre pronta no WhatsApp para você revisar e enviar. A reserva é confirmada
              na conversa.
            </p>

            <fieldset className="field segmented">
              <legend className="field__label">Tipo de passeio</legend>
              {(
                [
                  ['regular', 'Passeio das 7 praias'],
                  ['privativo', 'Passeio privativo'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="segmented__option">
                  <input type="radio" name="tipo" value={value} checked={tipo === value} onChange={() => setTipo(value)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            <div className="field">
              <label htmlFor={dateId} className="field__label">
                Data desejada <span className="legenda field__hint">opcional</span>
              </label>
              <div className="input-icon">
                <Icon name="calendar" size={18} />
                <input id={dateId} type="date" className="input" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="field-row">
              <Stepper label="Adultos" value={adults} min={1} max={20} onChange={setAdults} />
              <Stepper label="Crianças" hint={`até ${PRICING.children.maxAge} anos`} value={kids} min={0} max={20} onChange={setKids} />
            </div>

            <Button type="submit" size="lg" block disabled={!url}>
              <Icon name="message" size={20} />
              Quero consultar meu passeio
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
