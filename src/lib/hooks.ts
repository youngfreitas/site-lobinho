import { useEffect, useRef, useState, type RefObject } from 'react';

/** Acompanha `prefers-reduced-motion`. No servidor assume `false` e corrige ao hidratar. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/**
 * Marca o elemento como visível na primeira vez que entra na tela (revelação progressiva).
 * Retorna o ref e o estado; o CSS cuida da animação (e a desliga com movimento reduzido).
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px' }, once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as [RefObject<T>, boolean];
}

/** Detecta gesto de deslizar horizontal (toque ou caneta) sem bloquear a rolagem vertical. */
export function useSwipe<T extends HTMLElement>(onSwipe: (dir: 'left' | 'right') => void, threshold = 48) {
  const ref = useRef<T>(null);
  const cb = useRef(onSwipe);
  cb.current = onSwipe;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.2) cb.current(dx < 0 ? 'left' : 'right');
    };
    const cancel = () => (tracking = false);
    el.addEventListener('pointerdown', down, { passive: true });
    el.addEventListener('pointerup', up, { passive: true });
    el.addEventListener('pointercancel', cancel, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
    };
  }, [threshold]);
  return ref;
}
