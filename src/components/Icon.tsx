/**
 * Ícones de traço arredondado de 2px, como pede a seção de iconografia do Design System
 * (estilo Lucide). Desenhados inline para não carregar uma biblioteca inteira de ícones.
 */
const PATHS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  play: 'M7 4.5v15l12.5-7.5z',
  pause: 'M8 5v14M16 5v14',
  message:
    'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20.5l1.5-4.9A8.4 8.4 0 0 1 3.6 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  users: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  ruler: 'M3 15.5L15.5 3 21 8.5 8.5 21zM7 11.5l2 2M10 8.5l2 2M13 5.5l2 2',
  anchor: 'M12 8v13M5 12H3a9 9 0 0 0 18 0h-2M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 21h8',
  waves: 'M2 7c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0M2 12c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0M2 17c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0',
  calendar: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8 3v4M16 3v4',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3',
  cloud: 'M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A3.75 3.75 0 0 1 17.5 18zM8 21l1-2M12 21l1-2M16 21l1-2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  expand: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  pix: 'M12 3l9 9-9 9-9-9zM8 12l4-4 4 4-4 4z',
  turtle:
    'M5 13c0-3.3 3.1-6 7-6s7 2.7 7 6H5zM19 13l2-1M5 13l-2-1M8 13l-1 3M16 13l1 3M12 7c0-1.5 1-2.5 2.5-2.5',
  mask: 'M3 9.5A2.5 2.5 0 0 1 5.5 7h13A2.5 2.5 0 0 1 21 9.5v2a3.5 3.5 0 0 1-3.5 3.5h-1.8a2 2 0 0 1-1.6-.8L12 13l-2.1 1.2a2 2 0 0 1-1.6.8H6.5A3.5 3.5 0 0 1 3 11.5zM21 10h1v6a3 3 0 0 1-3 3h-2',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const filled = name === 'play';
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
