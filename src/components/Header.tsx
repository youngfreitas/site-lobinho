import { useEffect, useRef, useState } from 'react';
import { BUSINESS, NAV_LINKS, WHATSAPP } from '../config/site';
import { Icon } from './Icon';
import { WhatsAppButton } from './WhatsAppButton';

/**
 * Cabeçalho fixo. Transparente sobre o hero e sólido (espuma-elevada) após a rolagem.
 * No celular, menu em painel com foco gerenciado, Esc para fechar e rolagem do fundo travada.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // setState com o mesmo valor não re-renderiza: o custo por evento de rolagem é mínimo.
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add('menu-open');
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      // Mantém o foco dentro do menu aberto
      if (e.key === 'Tab' && panelRef.current) {
        const items = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.matchMedia('(min-width: 1024px)').matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      root.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="site-header" data-solid={solid || open || undefined}>
      <div className="container site-header__bar">
        <a href="#inicio" className="brand">
          <span className="brand__name">{BUSINESS.shortName}</span>{' '}
          <span className="brand__tag">{BUSINESS.tagline}</span>
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__cta">
          <WhatsAppButton message={WHATSAPP.messages.header} variant="secondary" size="sm">
            Consultar
          </WhatsAppButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
          <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
        </button>
      </div>

      <div id="menu-mobile" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Menu">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <WhatsAppButton message={WHATSAPP.messages.header} size="lg" block>
          Consultar disponibilidade
        </WhatsAppButton>
      </div>
      {open && <div className="mobile-menu__scrim" aria-hidden="true" onClick={() => setOpen(false)} />}
    </header>
  );
}
