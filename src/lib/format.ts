const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 9990 → "R$ 99,90" (com espaço comum, como pede o guia de voz do Design System). */
export function formatPrice(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, ' ');
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
