/**
 * Acesso tipado ao manifesto gerado por `npm run media` (scripts/optimize-media.mjs).
 * O manifesto guarda dimensões reais e larguras disponíveis de cada imagem, evitando CLS.
 */
import manifest from './media-manifest.json';

export type MediaKey = keyof typeof manifest.images;
export type VideoKey = keyof typeof manifest.videos;

export interface ImageEntry {
  width: number;
  height: number;
  widths: number[];
  base: string;
  color: string;
}

/** `webm` é null quando a versão WebM não ficou menor que o MP4. */
export interface VideoSources {
  mp4: string;
  webm: string | null;
}

export const images = manifest.images as Record<MediaKey, ImageEntry>;
export const videos = manifest.videos as Record<VideoKey, VideoSources & { duration: number }>;
export const heroVideos = manifest.hero as Record<'hero-sm' | 'hero-lg', VideoSources>;

export function srcSet(key: MediaKey, format: 'avif' | 'webp') {
  const img = images[key];
  return img.widths.map((w) => `${img.base}-${w}.${format} ${w}w`).join(', ');
}

/** Maior variante WebP disponível até `max` px (para usos fora de <picture>). */
export function imageUrl(key: MediaKey, max = Infinity) {
  const img = images[key];
  const fit = img.widths.filter((w) => w <= max);
  const w = fit.length ? fit[fit.length - 1] : img.widths[0];
  return `${img.base}-${w}.webp`;
}
