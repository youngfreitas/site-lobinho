import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { BEACHES } from '../../config/site';
import { useInView } from '../../lib/hooks';

interface Props {
  active: number;
  onSelect: (index: number) => void;
}

/*
 * MAPA ILUSTRATIVO — não é cartográfico. O litoral, as distâncias e as posições são uma
 * representação visual do roteiro (ver `map` em src/config/site.ts), sem escala.
 */
const VIEWBOX = { x: 40, y: 30, w: 720, h: 470 };

/** Costa estilizada (terra), desenhada para acomodar a ordem das paradas. */
const LAND =
  'M0 0 H800 V560 H760 C744 540 730 520 712 506 C694 490 690 466 676 446 C664 426 688 392 688 360 ' +
  'C688 330 666 308 676 278 C686 246 668 222 652 202 C632 176 600 164 560 150 C524 138 508 92 476 84 ' +
  'C446 78 432 140 392 146 C350 152 316 74 266 74 C220 74 208 150 166 154 C126 158 70 128 0 140 Z';

/** Curvas de nível decorativas sobre a terra (eco dos anéis do selo). */
const CONTOURS = [
  'M100 40 C160 70 220 30 280 36 C340 42 380 100 430 60 C480 20 540 60 600 70 C660 80 730 60 800 80',
  'M720 140 C700 190 740 240 730 300 C720 360 750 420 770 470',
];

type Pt = { x: number; y: number };
const POINTS: Pt[] = BEACHES.map((b) => ({ x: b.map.x, y: b.map.y }));

/** Converte a sequência de pontos em segmentos de curva suave (Catmull-Rom → Bézier). */
function segments(pts: Pt[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    out.push(`M${p1.x} ${p1.y} C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x} ${p2.y}`);
  }
  return out;
}

const SEGMENTS = segments(POINTS);
const FULL_ROUTE = SEGMENTS.map((s, i) => (i === 0 ? s : s.replace(/^M[^C]+/, ''))).join(' ');

const LABEL_OFFSET = {
  top: { dx: 0, dy: -40, anchor: 'middle' },
  bottom: { dx: 0, dy: 50, anchor: 'middle' },
  left: { dx: -36, dy: 7, anchor: 'end' },
  right: { dx: 36, dy: 7, anchor: 'start' },
} as const;

export function RouteMap({ active, onSelect }: Props) {
  const [wrapRef, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const markersRef = useRef<SVGGElement>(null);
  const total = BEACHES.length;
  const here = POINTS[active];

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + total) % total;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = total - 1;
    if (next === null) return;
    e.preventDefault();
    onSelect(next);
    // Foco acompanha a seleção (padrão de grupo de opções com tabindex móvel).
    markersRef.current?.querySelector<SVGGElement>(`[data-index="${next}"]`)?.focus();
  };

  return (
    <div ref={wrapRef} className="route-map" data-drawn={inView || undefined}>
      <svg
        className="route-map__svg"
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
        role="group"
        aria-labelledby="route-map-title route-map-desc"
      >
        <title id="route-map-title">Mapa ilustrativo do roteiro das 7 praias</title>
        <desc id="route-map-desc">
          Representação visual, fora de escala, com as sete paradas na ordem do passeio. Use as setas para trocar de praia.
        </desc>

        <defs>
          <mask id="route-reveal" maskUnits="userSpaceOnUse">
            <path className="route-map__reveal" d={FULL_ROUTE} pathLength={1} />
          </mask>
        </defs>

        <rect className="route-map__sea" x="0" y="0" width="800" height="560" />
        <g className="route-map__rings" aria-hidden="true">
          {[60, 120, 180, 240].map((r) => (
            <circle key={r} cx="330" cy="470" r={r} />
          ))}
        </g>
        <path className="route-map__land" d={LAND} />
        <g className="route-map__contours" aria-hidden="true">
          {CONTOURS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g mask="url(#route-reveal)" aria-hidden="true">
          {SEGMENTS.map((d, i) => (
            <path key={d} d={d} className="route-map__segment" data-done={i < active || undefined} />
          ))}
        </g>

        {/* Lancha que acompanha a parada ativa */}
        <g className="route-map__boat" style={{ transform: `translate(${here.x}px, ${here.y - 42}px)` }} aria-hidden="true">
          <path d="M-17 4 H15 L10 11 H-12 Z" className="route-map__boat-hull" />
          <path d="M-6 4 V-5 H5 L9 4" className="route-map__boat-cabin" />
        </g>

        <g ref={markersRef} role="radiogroup" aria-label="Paradas do roteiro" onKeyDown={onKeyDown}>
          {BEACHES.map((b, i) => {
            const isActive = i === active;
            const lab = LABEL_OFFSET[b.map.label];
            return (
              <g
                key={b.id}
                data-index={i}
                className="route-marker"
                data-active={isActive || undefined}
                data-landing={b.landing || undefined}
                role="radio"
                aria-checked={isActive}
                aria-label={`Parada ${i + 1}: ${b.name}${b.landing ? ' (desembarque)' : ''}`}
                tabIndex={isActive ? 0 : -1}
                transform={`translate(${b.map.x} ${b.map.y})`}
                onClick={() => onSelect(i)}
                style={{ '--i': i } as CSSProperties}
              >
                <circle className="route-marker__hit" r="52" />
                <circle className="route-marker__pulse" r="22" />
                <circle className="route-marker__dot" r="22" />
                <text className="route-marker__num" dy="8" textAnchor="middle" aria-hidden="true">
                  {i + 1}
                </text>
                <text className="route-marker__label" x={lab.dx} y={lab.dy} textAnchor={lab.anchor} aria-hidden="true">
                  {b.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="route-map__note">
        Mapa ilustrativo do roteiro, fora de escala — não representa distâncias nem posições exatas.
      </p>
    </div>
  );
}
