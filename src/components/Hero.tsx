import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../design-system';
import { heroVideos, type VideoSources } from '../config/media';
import { BUSINESS, PRICING, WHATSAPP } from '../config/site';
import { formatPrice } from '../lib/format';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Icon } from './Icon';
import { ResponsiveImage } from './ResponsiveImage';
import { WhatsAppButton } from './WhatsAppButton';

type VideoState = 'idle' | 'loading' | 'playing' | 'paused' | 'failed';

/** Escolhe a variante pela largura física real do painel de vídeo (720 px ou 1200 px de largura). */
function pickSources(el: HTMLElement): VideoSources {
  const physical = el.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2);
  return physical > 900 ? heroVideos['hero-lg'] : heroVideos['hero-sm'];
}

function shouldSkipAutoplay(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData || (c?.effectiveType && /(^|-)2g$/.test(c.effectiveType)));
}

const TITLE = 'Ubatuba é ainda mais incrível vista do mar.';

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<VideoState>('idle');
  const userPaused = useRef(false);
  const reduced = usePrefersReducedMotion();

  const load = () => {
    const video = videoRef.current;
    if (!video || video.dataset.loaded) return;
    const src = pickSources(video);
    video.dataset.loaded = '1';
    // WebM primeiro somente quando é a versão mais leve; MP4/H.264 garante Safari/iOS.
    const list = [src.webm && { src: src.webm, type: 'video/webm' }, { src: src.mp4, type: 'video/mp4' }].filter(Boolean) as {
      src: string;
      type: string;
    }[];
    let last: HTMLSourceElement | null = null;
    for (const s of list) {
      last = document.createElement('source');
      last.src = s.src;
      last.type = s.type;
      video.appendChild(last);
    }
    // Falha de <source> não dispara `error` no <video>: se a última opção falhar, mantém o pôster.
    last?.addEventListener('error', () => setState('failed'));
    setState('loading');
    video.load();
  };

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    load();
    video.play().catch(() => setState((s) => (s === 'failed' ? s : 'paused')));
  };

  // Carrega o vídeo só depois da página pronta: o pôster (imagem) é o conteúdo principal da primeira tela.
  useEffect(() => {
    if (reduced || shouldSkipAutoplay()) return;
    const start = () => {
      if (userPaused.current) return;
      play();
    };
    if (document.readyState === 'complete') {
      const t = window.setTimeout(start, 300);
      return () => window.clearTimeout(t);
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, [reduced]);

  // Pausa fora da tela para poupar bateria e dados; retoma se o visitante não pausou.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!video.dataset.loaded || userPaused.current) return;
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (state === 'playing') {
      userPaused.current = true;
      video.pause();
      setState('paused');
    } else {
      userPaused.current = false;
      play();
    }
  };

  const showVideo = state === 'playing' || state === 'paused';

  return (
    <section id="inicio" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <svg className="hero__rings" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
        {[120, 220, 320, 420].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} />
        ))}
      </svg>

      <div className="hero__inner">
        <div className="hero__content">
          <p className="rotulo hero__eyebrow">
            {BUSINESS.name} · {BUSINESS.city}, {BUSINESS.state}
          </p>
          <h1 id="hero-title" className="display hero__title">
            {TITLE.split(' ').map((word, i) => (
              <span key={i} className="hero__word" style={{ animationDelay: `${120 + i * 70}ms` }}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="hero__subtitle">
            Descubra o roteiro das 7 praias e viva um dia de paisagens inesquecíveis a bordo da Lobinho.
          </p>
          <p className="hero__price">
            Passeio das 7 praias <span aria-hidden="true">·</span> <strong>{formatPrice(PRICING.regular.cents)}</strong> por pessoa
          </p>
          <div className="hero__actions">
            <ButtonLink href="#roteiro" size="lg">
              Explorar as 7 praias
              <Icon name="arrowDown" size={20} />
            </ButtonLink>
            <WhatsAppButton message={WHATSAPP.messages.hero} variant="secondary" size="lg">
              Consultar disponibilidade
            </WhatsAppButton>
          </div>
        </div>

        <div className="hero__media" data-video={showVideo || undefined}>
          <ResponsiveImage
            image="hero-poster"
            alt="A lancha Lobinho navegando em água verde-azulada diante de uma praia com mata"
            sizes="(min-aspect-ratio: 4/3) and (min-width: 640px) 58vw, 100vw"
            priority
            className="hero__poster"
          />
          <video
            ref={videoRef}
            className="hero__video"
            muted
            playsInline
            loop
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setState('playing')}
            onPause={() => setState((s) => (s === 'failed' ? s : 'paused'))}
            onError={() => setState('failed')}
          />
          {state !== 'failed' && (state !== 'idle' || reduced) && (
            <button type="button" className="hero__toggle" onClick={toggle}>
              <Icon name={state === 'playing' ? 'pause' : 'play'} size={18} />
              <span className="sr-only">{state === 'playing' ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}</span>
            </button>
          )}
        </div>
      </div>

      <svg className="hero__wave" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 40 Q180 8 360 32 T720 32 T1080 28 T1440 36 V64 H0 Z" />
      </svg>
    </section>
  );
}
