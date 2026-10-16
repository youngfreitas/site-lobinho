import { renderToString } from 'react-dom/server';
import { App } from './App';
import { srcSet } from './config/media';
import { BEACHES, BUSINESS, PRICING, SEO, TOUR } from './config/site';

/** Usado apenas na build (scripts/prerender.mjs) para gerar o HTML estático da página. */
export function render(): string {
  return renderToString(<App />);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Metadados de SEO e compartilhamento, montados a partir da configuração central. */
export function renderHead(): string {
  const base = BUSINESS.siteUrl;
  const abs = (path: string) => (base ? `${base}${path}` : path);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `${PRICING.tourName} — ${BUSINESS.name}`,
    description: SEO.description,
    touristType: 'Passeio de lancha',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: BEACHES.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'TouristAttraction', name: b.name, address: { '@type': 'PostalAddress', addressLocality: BUSINESS.city, addressRegion: BUSINESS.state, addressCountry: BUSINESS.country } },
      })),
    },
    offers: {
      '@type': 'Offer',
      price: (PRICING.regular.cents / 100).toFixed(2),
      priceCurrency: PRICING.currency,
      description: `Por pessoa. ${TOUR.totalDuration}.`,
    },
    provider: { '@type': 'Organization', name: BUSINESS.name, ...(base ? { url: base } : {}) },
  };

  const tags = [
    `<meta name="description" content="${esc(SEO.description)}" />`,
    base && `<link rel="canonical" href="${base}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}" />`,
    `<meta property="og:title" content="${esc(SEO.title)}" />`,
    `<meta property="og:description" content="${esc(SEO.description)}" />`,
    `<meta property="og:image" content="${abs(SEO.ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    base && `<meta property="og:url" content="${base}/" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    // Pré-carrega o pôster do hero (maior elemento da primeira tela).
    `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcSet('hero-poster', 'avif')}" imagesizes="(min-aspect-ratio: 4/3) and (min-width: 640px) 58vw, 100vw" fetchpriority="high" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}
