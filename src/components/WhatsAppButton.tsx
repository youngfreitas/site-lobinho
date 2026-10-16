import type { ReactNode } from 'react';
import { ButtonLink, type ButtonProps } from '../design-system';
import { whatsappUrl } from '../lib/whatsapp';
import { Icon } from './Icon';

interface Props {
  message: string;
  children: ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  block?: boolean;
  className?: string;
  icon?: boolean;
}

/**
 * CTA para o WhatsApp com mensagem contextualizada. Se o número configurado for inválido,
 * mostra um botão desabilitado (estilo oficial :disabled) em vez de gerar um link quebrado.
 */
export function WhatsAppButton({ message, children, variant = 'primary', size = 'md', block, className, icon = true }: Props) {
  const href = whatsappUrl(message);
  if (!href) {
    return (
      <button type="button" disabled className={['lb-btn', `lb-btn-${variant}`, `lb-btn-${size}`, block && 'lb-btn-block', className].filter(Boolean).join(' ')}>
        WhatsApp indisponível
      </button>
    );
  }
  return (
    <ButtonLink href={href} target="_blank" rel="noopener noreferrer" variant={variant} size={size} block={block} className={className}>
      {icon && <Icon name="message" size={size === 'sm' ? 16 : 20} />}
      {children}
      <span className="sr-only"> (abre o WhatsApp em uma nova janela)</span>
    </ButtonLink>
  );
}
