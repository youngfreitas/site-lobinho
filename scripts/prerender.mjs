/**
 * Pré-renderização estática: injeta o HTML da página e os metadados de SEO em dist/index.html.
 * Resultado: conteúdo visível antes do JavaScript (melhor LCP e indexação), depois hidratado pelo React.
 */
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, 'dist-ssr');

const { render, renderHead } = await import(pathToFileURL(join(SSR, 'entry-server.js')).href);

let html = readFileSync(join(DIST, 'index.html'), 'utf8');

// Pré-carrega as fontes oficiais (nomes com hash gerados pelo Vite).
const fonts = readdirSync(join(DIST, 'assets'))
  .filter((f) => /^(Figtree|Marcellus).*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

const head = [fonts, renderHead()].filter(Boolean).join('\n    ');
const appHtml = render();

if (!html.includes('<!--app-head-->') || !html.includes('<!--app-html-->')) {
  throw new Error('Marcadores <!--app-head--> / <!--app-html--> não encontrados em dist/index.html');
}

html = html.replace('<!--app-head-->', head).replace('<!--app-html-->', appHtml);
writeFileSync(join(DIST, 'index.html'), html);
rmSync(SSR, { recursive: true, force: true });

console.log(`Pré-renderização concluída: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB em dist/index.html`);
