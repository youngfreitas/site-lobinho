import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../lib/hooks';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Atraso em ms, para revelar itens em sequência. */
  delay?: number;
  id?: string;
}

/**
 * Revela o conteúdo quando entra na tela. O estado inicial oculto só vale com JavaScript ativo
 * (classe `js` no <html>) e é desligado com `prefers-reduced-motion` — ver global.css.
 */
export function Reveal({ as: Tag = 'div', children, className, delay = 0, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-visible={inView || undefined}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Selo visível só em desenvolvimento, marcando dados que dependem de confirmação do proprietário. */
export function ReviewFlag({ show }: { show: boolean }) {
  if (!import.meta.env.DEV || !show) return null;
  return (
    <span className="lb-badge lb-badge-alerta review-flag" title="Ver MATERIAIS-PENDENTES.md">
      Revisar antes de publicar
    </span>
  );
}
