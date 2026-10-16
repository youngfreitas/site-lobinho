/**
 * Gera as versões otimizadas de imagens e vídeos para publicação.
 *
 * - Os ORIGINAIS nunca são alterados: ficam nas pastas de origem listadas em SOURCES.
 * - Saída em public/media/ e um manifesto tipado em src/config/media-manifest.json
 *   (dimensões e larguras geradas), usado pelos componentes para srcset/width/height.
 * - Requisitos: sharp (devDependency) e ffmpeg/ffprobe no PATH.
 *
 * Uso: npm run media            (gera apenas o que estiver faltando ou desatualizado)
 *      npm run media -- --force (regenera tudo)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'media');
const MANIFEST = join(ROOT, 'src', 'config', 'media-manifest.json');
const FORCE = process.argv.includes('--force');
const TMP = join(ROOT, '.media-tmp');

/* ------------------------------------------------------------------ */
/* Fontes. Para trocar um material, substitua o arquivo de origem (ou  */
/* aponte o caminho para o novo arquivo) e rode `npm run media`.       */
/* ------------------------------------------------------------------ */
const SOURCES = {
  images: {
    // Praias (a Praia da Ribeira ainda não tem foto — ver MATERIAIS-PENDENTES.md)
    'praia-santa-rita': { src: 'imagens praias/santa-rita.webp', widths: [480, 800, 1178] },
    'praia-pereque-mirim': { src: 'imagens praias/pereque-mirim.webp', widths: [480, 800, 1178] },
    'praia-lamberto': { src: 'imagens praias/lamberto.webp', widths: [480, 800, 1178] },
    'praia-dionisia': { src: 'imagens praias/dionisia.webp', widths: [480, 800, 1178] },
    'praia-flamengo': { src: 'imagens praias/flamengo.webp', widths: [480, 800, 1178] },
    'praia-flamenguinho': { src: 'imagens praias/flamenguinho.webp', widths: [480, 800, 1178] },
    // Lancha
    'lancha-praia': { src: 'imagens da lancha/16c85938-a580-4dda-b1bd-734e68923146.webp', widths: [480, 800, 1200] },
    'lancha-popa': { src: 'imagens da lancha/f756e45b-a841-40b5-bf32-f6d1f14457df.webp', widths: [480, 800, 922] },
    'bordo-1': { src: 'imagens dentro da lancha/image.png_20261016114057.webp', widths: [480, 800, 910] },
    'bordo-2': { src: 'imagens dentro da lancha/image.png_20261016114059.webp', widths: [480, 800, 900] },
    'bordo-3': { src: 'imagens dentro da lancha/image.png_20261016114102.webp', widths: [480, 800, 1200] },
    'bordo-4': { src: 'imagens dentro da lancha/image.png_20261016114104.webp', widths: [480, 800, 1200] },
    'bordo-5': { src: 'imagens dentro da lancha/image.png_20261016114106.webp', widths: [480, 800, 1200] },
    'bordo-6': { src: 'imagens dentro da lancha/image.png_20261016114110.webp', widths: [480, 800, 900] },
  },
  // Quadros extraídos dos vídeos (capas e imagens de apoio)
  frames: {
    // Mesmo recorte 4:3 do vídeo do hero: a lancha aparece inteira em qualquer tela.
    'hero-poster': { src: 'Vídeo do barco para hero.webm', at: 0, crop: 'crop=1440:1080:240:0', widths: [480, 720, 960, 1440] },
    'video-1-capa': { src: 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32.webm', at: 4, widths: [360, 576] },
    'video-2-capa': { src: 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (1).webm', at: 11, widths: [360, 576] },
    'video-3-capa': { src: 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (2).webm', at: 3, widths: [360, 576] },
    'video-4-capa': { src: 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (3).webm', at: 1.2, widths: [360, 576] },
    'video-5-capa': { src: 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (4).webm', at: 10.5, widths: [360, 576] },
  },
  hero: { src: 'Vídeo do barco para hero.webm' },
  videos: {
    'passeio-1': 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32.webm',
    'passeio-2': 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (1).webm',
    'passeio-3': 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (2).webm',
    'passeio-4': 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (3).webm',
    'passeio-5': 'vídeos passeio/WhatsApp Video 2026-10-16 at 08.50.32 (4).webm',
  },
  logo: 'design-system/project/assets/Logos/a968ff4c33eec2ee096a5cecac4329b3.jpg',
};

const stale = (src, out) => FORCE || !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;
const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const rel = (p) => '/' + p.replace(join(ROOT, 'public'), '').replace(/\\/g, '/').replace(/^\//, '');
const log = (...a) => console.log('  ·', ...a);
const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;
/** WebM só entra no manifesto quando é menor que o MP4 (o MP4/H.264 é o formato universal). */
const sources = (mp4, webm) => ({ mp4: rel(mp4), webm: statSync(webm).size < statSync(mp4).size ? rel(webm) : null });

const manifest = { images: {}, videos: {}, hero: null };

async function responsiveImage(key, input, widths, srcForStale) {
  const meta = await sharp(input).metadata();
  const usable = widths.filter((w) => w <= meta.width);
  const outWidths = usable.length ? usable : [meta.width];
  for (const w of outWidths) {
    const base = join(OUT, 'img', `${key}-${w}`);
    ensureDir(base);
    if (stale(srcForStale, `${base}.avif`)) {
      await sharp(input).resize({ width: w }).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
    }
    if (stale(srcForStale, `${base}.webp`)) {
      await sharp(input).resize({ width: w }).webp({ quality: 74, effort: 5 }).toFile(`${base}.webp`);
    }
  }
  // Placeholder de baixíssima resolução (cor média), evita “buraco branco” enquanto carrega.
  const { dominant } = await sharp(input).stats();
  manifest.images[key] = {
    width: meta.width,
    height: meta.height,
    widths: outWidths,
    base: `/media/img/${key}`,
    color: `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`,
  };
  log('imagem', key, outWidths.join('/'));
}

async function images() {
  for (const [key, { src, widths }] of Object.entries(SOURCES.images)) {
    const abs = join(ROOT, src);
    await responsiveImage(key, abs, widths, abs);
  }
}

async function frames() {
  mkdirSync(TMP, { recursive: true });
  for (const [key, { src, at, crop, widths }] of Object.entries(SOURCES.frames)) {
    const abs = join(ROOT, src);
    const png = join(TMP, `${key}.png`);
    if (stale(abs, png)) ff(['-ss', String(at), '-i', abs, '-frames:v', '1', ...(crop ? ['-vf', crop] : []), png]);
    await responsiveImage(key, png, widths, abs);
  }
}

function hero() {
  const abs = join(ROOT, SOURCES.hero.src);
  const dir = join(OUT, 'hero');
  mkdirSync(dir, { recursive: true });
  // Recorte 4:3 centralizado (x 240–1680): a lancha permanece inteira no quadro durante todo o movimento.
  // Taxa de bits limitada: o vídeo é decorativo, curto e em loop — prioridade para carregar rápido.
  const variants = {
    'hero-sm': { vf: 'crop=1440:1080:240:0,scale=720:540', rate: 650 },
    'hero-lg': { vf: 'crop=1440:1080:240:0,scale=1200:900', rate: 1500 },
  };
  for (const [name, v] of Object.entries(variants)) {
    const mp4 = join(dir, `${name}.mp4`);
    const webm = join(dir, `${name}.webm`);
    const rate = ['-maxrate', `${v.rate}k`, '-bufsize', `${v.rate * 2}k`];
    if (stale(abs, mp4)) {
      ff(['-i', abs, '-an', '-vf', `${v.vf},format=yuv420p`, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow',
        '-crf', '28', ...rate, '-movflags', '+faststart', mp4]);
    }
    if (stale(abs, webm)) {
      ff(['-i', abs, '-an', '-vf', v.vf, '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', `${v.rate}k`, ...rate, '-row-mt', '1',
        '-deadline', 'good', '-cpu-used', '2', webm]);
    }
    log('vídeo hero', name, kb(mp4), kb(webm));
  }
  manifest.hero = Object.fromEntries(
    Object.keys(variants).map((n) => [n, sources(join(dir, `${n}.mp4`), join(dir, `${n}.webm`))]),
  );
}

function videos() {
  const dir = join(OUT, 'videos');
  mkdirSync(dir, { recursive: true });
  for (const [key, src] of Object.entries(SOURCES.videos)) {
    const abs = join(ROOT, src);
    const mp4 = join(dir, `${key}.mp4`);
    const webm = join(dir, `${key}.webm`);
    // Mantém no máximo 576 px de largura (resolução original dos vídeos do WhatsApp).
    const scale = "scale='min(576,iw)':-2";
    const rate = ['-maxrate', '1500k', '-bufsize', '3000k'];
    if (stale(abs, mp4)) {
      ff(['-i', abs, '-vf', `${scale},format=yuv420p`, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '28',
        ...rate, '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', mp4]);
    }
    if (stale(abs, webm)) {
      ff(['-i', abs, '-vf', scale, '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '1200k', ...rate, '-row-mt', '1',
        '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '64k', webm]);
    }
    const duration = Number(
      execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', abs]).toString().trim(),
    );
    manifest.videos[key] = { ...sources(mp4, webm), duration: Math.round(duration) };
    log('vídeo', key, kb(mp4), kb(webm));
  }
}

async function brand() {
  const abs = join(ROOT, SOURCES.logo);
  const meta = await sharp(abs).metadata();
  const size = Math.min(meta.width, meta.height);
  // O selo é circular: recorte quadrado central + máscara circular (fundo branco preservado dentro do círculo).
  const square = await sharp(abs)
    .extract({ left: Math.floor((meta.width - size) / 2), top: Math.floor((meta.height - size) / 2), width: size, height: size })
    .toBuffer();
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/></svg>`);
  const round = await sharp(square).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const dir = join(OUT, 'brand');
  mkdirSync(dir, { recursive: true });
  for (const w of [192, 384]) {
    await sharp(round).resize(w).webp({ quality: 86 }).toFile(join(dir, `selo-${w}.webp`));
    await sharp(round).resize(w).avif({ quality: 60 }).toFile(join(dir, `selo-${w}.avif`));
  }
  await sharp(round).resize(32).png().toFile(join(ROOT, 'public', 'favicon-32.png'));
  await sharp(square).resize(180).flatten({ background: '#ffffff' }).png().toFile(join(ROOT, 'public', 'apple-touch-icon.png'));
  await sharp(round).resize(512).png().toFile(join(ROOT, 'public', 'icon-512.png'));
  // Imagem de compartilhamento (Open Graph) 1200×630 a partir do primeiro quadro do vídeo do hero.
  const poster = join(TMP, 'hero-frame.png');
  if (stale(join(ROOT, SOURCES.hero.src), poster)) ff(['-ss', '0', '-i', join(ROOT, SOURCES.hero.src), '-frames:v', '1', poster]);
  await sharp(poster).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(ROOT, 'public', 'og-image.jpg'));
  log('marca, favicon e og-image');
}

console.log('Otimizando mídia…');
await images();
await frames();
await brand();
hero();
videos();
ensureDir(MANIFEST);
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
if (existsSync(TMP) && process.argv.includes('--clean')) rmSync(TMP, { recursive: true, force: true });
console.log('Pronto. Manifesto em', MANIFEST.replace(ROOT, '.'));
