import type * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = lancha cheio (uma vez por tela); secondary = contorno; ghost = só texto. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Ocupa a largura toda (barra de reserva no mobile). */
  block?: boolean;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface BadgeProps {
  tone?: 'ceu' | 'lancha' | 'marinho' | 'sucesso' | 'alerta' | 'erro';
  className?: string;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface TourCardProps {
  /** Nome do passeio. */
  title: string;
  /** Ex.: "4 horas". */
  duration?: string;
  /** Ponto de saída, ex.: "Píer do Saco da Ribeira". */
  departure?: string;
  description?: string;
  /** Valor já formatado, ex.: "R$ 120". */
  price?: string;
  /** Padrão "a partir de". */
  priceLabel?: string;
  /** Padrão "por pessoa". */
  unit?: string;
  /** Foto do passeio; sem ela, aparece a ilustração de ondas. */
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
  badgeTone?: BadgeProps['tone'];
  /** Padrão "Reservar". */
  ctaLabel?: string;
  onBook?: () => void;
  soldOut?: boolean;
  className?: string;
}
export declare function TourCard(props: TourCardProps): React.ReactElement;

declare global {
  interface Window { Lobinho: { Button: typeof Button; Badge: typeof Badge; TourCard: typeof TourCard } }
}
