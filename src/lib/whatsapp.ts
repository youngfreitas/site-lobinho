import { WHATSAPP } from '../config/site';

/** 55 + DDD (2 dígitos) + número de 8 ou 9 dígitos. */
const BR_PHONE = /^55\d{2}9?\d{8}$/;

export function isValidWhatsAppPhone(phone: string): boolean {
  return BR_PHONE.test(phone);
}

/**
 * Monta um link https://wa.me/<número>?text=<mensagem codificada>.
 * Devolve `null` quando o número configurado é inválido — assim nunca geramos links quebrados.
 */
export function whatsappUrl(message: string, phone: string = WHATSAPP.phone): string | null {
  const digits = phone.replace(/\D/g, '');
  if (!isValidWhatsAppPhone(digits)) {
    if (import.meta.env.DEV) console.warn('[WhatsApp] Número inválido ou ausente em src/config/site.ts:', phone);
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`;
}
