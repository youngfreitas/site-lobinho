declare module '@lobinho-ds/bundle' {
  import type * as React from 'react';
  import type { Badge, Button, TourCard } from '@lobinho-ds/types';

  /** Executa o bundle oficial no escopo informado e devolve o namespace `Lobinho`. */
  export default function installDesignSystem(scope: { React: typeof React }): {
    Button: typeof Button;
    Badge: typeof Badge;
    TourCard: typeof TourCard;
  };
}
