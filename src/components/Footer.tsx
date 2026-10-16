import { BUSINESS, NAV_LINKS, WHATSAPP } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { Icon } from './Icon';

export function Footer() {
  const wa = whatsappUrl(WHATSAPP.messages.rodape);
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <picture>
            <source type="image/avif" srcSet="/media/brand/selo-192.avif 1x, /media/brand/selo-384.avif 2x" />
            <img src="/media/brand/selo-192.webp" srcSet="/media/brand/selo-384.webp 2x" width={96} height={96} alt="Selo Passeios Lobinho" loading="lazy" />
          </picture>
          <div>
            <p className="titulo-2 site-footer__name">{BUSINESS.name}</p>
            <p className="site-footer__place">
              <Icon name="pin" size={16} /> {BUSINESS.city}, {BUSINESS.state}
            </p>
          </div>
        </div>

        <nav aria-label="Rodapé" className="site-footer__nav">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__contact">
          <p className="rotulo">Contato</p>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="site-footer__wa">
              <Icon name="message" size={18} />
              WhatsApp {WHATSAPP.display}
              <span className="sr-only"> (abre em nova janela)</span>
            </a>
          ) : (
            <p>WhatsApp em breve</p>
          )}
          <p className="legenda">Disponibilidade, valores e reservas são confirmados pelo WhatsApp.</p>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p className="legenda" suppressHydrationWarning>
          © {new Date().getFullYear()} {BUSINESS.name}. Ubatuba, SP.
        </p>
      </div>
    </footer>
  );
}
