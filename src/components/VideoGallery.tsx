import { useState } from 'react';
import { videos } from '../config/media';
import { VIDEOS } from '../config/site';
import { formatDuration } from '../lib/format';
import { Icon } from './Icon';
import { MediaDialog, type MediaItem } from './MediaDialog';
import { ResponsiveImage } from './ResponsiveImage';
import { Reveal } from './Reveal';

const ITEMS: MediaItem[] = VIDEOS.map((v) => ({
  kind: 'video',
  video: v.video,
  poster: v.poster,
  title: v.title,
  description: v.description,
}));

/** Galeria de vídeos reais: só as capas carregam com a página; o vídeo baixa ao abrir. */
export function VideoGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="videos" className="section videos" aria-labelledby="videos-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="rotulo eyebrow">Vídeos reais</p>
          <h2 id="videos-title" className="titulo-1">
            Veja como é estar a bordo.
          </h2>
          <p className="lead">Momentos gravados durante os passeios da Lobinho.</p>
        </Reveal>

        <ul className="video-grid">
          {VIDEOS.map((v, i) => (
            <Reveal as="li" key={v.id} delay={i * 70}>
              <button type="button" className="video-card" onClick={() => setOpen(i)} aria-haspopup="dialog">
                <span className="video-card__media">
                  <ResponsiveImage image={v.poster} alt="" sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 62vw" />
                  <span className="video-card__play" aria-hidden="true">
                    <Icon name="play" size={22} />
                  </span>
                  <span className="video-card__time legenda">{formatDuration(videos[v.video].duration)}</span>
                </span>
                <span className="video-card__text">
                  <span className="video-card__title">{v.title}</span>
                  <span className="legenda video-card__desc">{v.description}</span>
                </span>
                <span className="sr-only">
                  , vídeo de {formatDuration(videos[v.video].duration)}. Abrir e reproduzir.
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <MediaDialog items={ITEMS} index={open} onChange={setOpen} label="Vídeos do passeio" />
    </section>
  );
}
