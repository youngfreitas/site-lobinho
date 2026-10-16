/**
 * Ponto único de entrada do Design System oficial "Passeios Lobinho" na aplicação.
 *
 * - Componentes: o bundle oficial (design-system/project/components/bundle.js) é executado sem
 *   alterações, recebendo o React desta aplicação (ver plugin em vite.config.ts).
 * - Tipos: vêm do index.d.ts oficial.
 * - Estilos: bundle.css oficial + tokens.css (gerado de tokens.json por scripts/build-tokens.mjs).
 *
 * Para atualizar o Design System, substitua os arquivos em design-system/project/ (ver README.md).
 */
import * as React from 'react';
import installDesignSystem from '@lobinho-ds/bundle';
import type {
  Badge as BadgeComponent,
  Button as ButtonComponent,
  TourCard as TourCardComponent,
} from '@lobinho-ds/types';

import '../styles/tokens.css';
import '../../design-system/project/components/bundle.css';

const Lobinho = installDesignSystem({ React });

export const Button: typeof ButtonComponent = Lobinho.Button;
export const Badge: typeof BadgeComponent = Lobinho.Badge;
export const TourCard: typeof TourCardComponent = Lobinho.TourCard;

export type { BadgeProps, ButtonProps, TourCardProps } from '@lobinho-ds/types';
export { ButtonLink } from './ButtonLink';
