import type { CSSProperties } from 'react';
import { images, srcSet, type MediaKey } from '../config/media';

interface Props {
  image: MediaKey;
  alt: string;
  /** Atributo `sizes` — quanto da largura da tela a imagem ocupa em cada quebra. */
  sizes: string;
  className?: string;
  /** Imagem principal da primeira tela: carregamento imediato e prioridade alta. */
  priority?: boolean;
  style?: CSSProperties;
}

/** <picture> com AVIF + WebP em várias larguras, dimensões intrínsecas (sem CLS) e lazy loading. */
export function ResponsiveImage({ image, alt, sizes, className, priority, style }: Props) {
  const img = images[image];
  const fallback = `${img.base}-${img.widths[Math.min(1, img.widths.length - 1)]}.webp`;
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, 'webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={img.width}
        height={img.height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // React 18 ainda não conhece fetchPriority em camelCase; o atributo em minúsculas funciona.
        {...(priority ? { fetchpriority: 'high' } : {})}
        style={{ backgroundColor: img.color, ...style }}
      />
    </picture>
  );
}
