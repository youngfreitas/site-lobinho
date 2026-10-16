import { useEffect, useRef, type KeyboardEvent } from 'react';
import { images, videos, type MediaKey, type VideoKey } from '../config/media';
import { Icon } from './Icon';

export type MediaItem =
  | { kind: 'image'; image: MediaKey; alt: string; title?: string }
  | { kind: 'video'; video: VideoKey; poster: MediaKey; title: string; description?: string };

interface Props {
  items: MediaItem[];
  /** Índice aberto, ou null com o modal fechado. */
  index: number | null;
  onChange: (index: number | null) => void;
  label: string;
}

/**
 * Modal acessível (elemento <dialog> nativo: foco preso, Esc, fundo inerte) para fotos e vídeos.
 * Há um único <video> — então só um vídeo toca por vez — e ele é descarregado ao fechar.
 */
export function MediaDialog({ items, index, onChange, label }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const item = index === null ? null : items[index];
  const total = items.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
    } else if (index === null && dialog.open) {
      dialog.close();
    }
  }, [index]);

  // Troca de item: recarrega o vídeo e toca (gesto do usuário abriu o modal).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || item?.kind !== 'video') return;
    video.load();
    video.play().catch(() => undefined);
  }, [item]);

  const stopVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    // `src` vazio tem prioridade sobre os <source> e interrompe o download em andamento.
    video.setAttribute('src', '');
    video.load();
  };

  const handleClose = () => {
    stopVideo();
    document.documentElement.classList.remove('dialog-open');
    onChange(null);
  };

  const go = (delta: number) => {
    if (index === null) return;
    onChange((index + delta + total) % total);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'VIDEO') return; // setas controlam o vídeo quando ele tem o foco
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  return (
    <dialog
      ref={dialogRef}
      className="media-dialog"
      aria-label={label}
      onClose={handleClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
    >
      {item && (
        <div className="media-dialog__frame">
          <header className="media-dialog__head">
            <p className="media-dialog__title" id="media-dialog-title">
              <span className="legenda">
                {index! + 1} de {total}
              </span>
              {item.kind === 'video' ? item.title : item.title ?? ''}
            </p>
            <button type="button" className="lb-btn lb-btn-ghost lb-btn-md icon-btn media-dialog__close" onClick={() => dialogRef.current?.close()}>
              <Icon name="close" size={24} />
              <span className="sr-only">Fechar</span>
            </button>
          </header>

          <div className="media-dialog__stage" data-kind={item.kind}>
            {item.kind === 'video' ? (
              <video
                ref={videoRef}
                key="player"
                className="media-dialog__video"
                controls
                playsInline
                preload="metadata"
                poster={`${images[item.poster].base}-${images[item.poster].widths.slice(-1)[0]}.webp`}
                aria-describedby="media-dialog-title"
              >
                {videos[item.video].webm && <source src={videos[item.video].webm!} type="video/webm" />}
                <source src={videos[item.video].mp4} type="video/mp4" />
                Seu navegador não reproduz este vídeo.{' '}
                <a href={videos[item.video].mp4}>Baixe o arquivo em MP4</a>.
              </video>
            ) : (
              <img
                className="media-dialog__image"
                src={`${images[item.image].base}-${images[item.image].widths.slice(-1)[0]}.webp`}
                alt={item.alt}
                width={images[item.image].width}
                height={images[item.image].height}
                style={{ backgroundColor: images[item.image].color }}
              />
            )}
          </div>

          {total > 1 && (
            <div className="media-dialog__nav">
              <button type="button" className="lb-btn lb-btn-secondary lb-btn-md icon-btn" onClick={() => go(-1)}>
                <Icon name="chevronLeft" size={22} />
                <span className="sr-only">Anterior</span>
              </button>
              <button type="button" className="lb-btn lb-btn-secondary lb-btn-md icon-btn" onClick={() => go(1)}>
                <Icon name="chevronRight" size={22} />
                <span className="sr-only">Próximo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
