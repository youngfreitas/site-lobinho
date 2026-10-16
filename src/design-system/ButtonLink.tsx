import type { AnchorHTMLAttributes } from 'react';
import type { ButtonProps } from '@lobinho-ds/types';

/**
 * Complemento do Design System: o `Button` oficial renderiza sempre um <button>, mas os CTAs
 * desta página levam a âncoras internas ou ao WhatsApp e precisam ser links de verdade
 * (abrir em nova aba, aparecer para buscadores, funcionar sem JavaScript).
 * Reutiliza exatamente as classes oficiais `lb-btn` — nenhum estilo novo de botão é criado.
 */
export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  block?: boolean;
}

export function ButtonLink({ variant = 'primary', size = 'md', block, className, children, ...rest }: ButtonLinkProps) {
  const classes = ['lb-btn', `lb-btn-${variant}`, `lb-btn-${size}`, block && 'lb-btn-block', className]
    .filter(Boolean)
    .join(' ');
  return (
    <a {...rest} className={classes}>
      {children}
    </a>
  );
}
