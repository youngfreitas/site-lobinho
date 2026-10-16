/**
 * Gera src/styles/tokens.css a partir do Design System oficial (design-system/project/tokens.json).
 *
 * O tokens.json é a única fonte de verdade: este script apenas o traduz para variáveis CSS
 * (mesmos nomes dos tokens), @font-face das fontes oficiais e as classes de texto prontas
 * (.display, .titulo-1, …) descritas no README do Design System. Nunca edite tokens.css à mão.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DS = join(ROOT, 'design-system', 'project');
const OUT = join(ROOT, 'src', 'styles', 'tokens.css');
const tokens = JSON.parse(readFileSync(join(DS, 'tokens.json'), 'utf8'));

const themes = tokens.color.themes.map((t) => t.id);
const [primary, ...others] = themes;

const resolveValue = (v) => (typeof v === 'string' ? v.replace(/^\{(.+)\}$/, 'var(--$1)') : v);
const valueFor = (token, theme) => {
  if (typeof token.value === 'string') return theme === primary ? resolveValue(token.value) : null;
  const v = token.value[theme];
  return v == null ? null : resolveValue(v);
};

const familyVar = { display: '--font-display', sans: '--font-sans' };
const lines = [`/* ${tokens.name} — gerado de design-system/project/tokens.json por scripts/build-tokens.mjs. Não edite. */`, ''];

for (const f of tokens.type.fonts) {
  lines.push(
    '@font-face {',
    `  font-family: "${f.family}";`,
    `  src: url("../../design-system/project/${f.file}") format("woff2");`,
    `  font-weight: ${f.weight};`,
    '  font-style: normal;',
    '  font-display: swap;',
    '}',
  );
}
lines.push('');

const themed = (theme) => {
  const out = [];
  for (const t of tokens.color.tokens) {
    const v = valueFor(t, theme);
    if (v != null) out.push(`  --${t.name}: ${v};`);
  }
  for (const t of tokens.shadow?.tokens ?? []) {
    const v = valueFor(t, theme);
    if (v != null) out.push(`  --${t.name}: ${v};`);
  }
  return out;
};

lines.push(':root {', `  color-scheme: ${primary === 'dark' ? 'dark' : 'light'};`);
lines.push(...themed(primary));
for (const [k, v] of Object.entries(tokens.type.families)) lines.push(`  ${familyVar[k] ?? `--font-${k}`}: ${v};`);
for (const fam of ['spacing', 'radius']) for (const t of tokens[fam].tokens) lines.push(`  --${t.name}: ${t.value};`);
// Métricas de cada estilo de texto, para reutilizar a escala oficial em quebras responsivas.
for (const group of tokens.type.groups) {
  for (const s of group.styles) lines.push(`  --${s.name}-font-size: ${s.fontSize};`, `  --${s.name}-line-height: ${s.lineHeight};`);
}
lines.push('}', '');

for (const theme of others) {
  lines.push(`:root[data-theme="${theme}"] {`, `  color-scheme: ${theme === 'dark' ? 'dark' : 'light'};`, ...themed(theme), '}', '');
}

for (const group of tokens.type.groups) {
  for (const s of group.styles) {
    lines.push(`.${s.name} {`);
    lines.push(`  font-family: var(${familyVar[group.family] ?? `--font-${group.family}`});`);
    lines.push(`  font-size: ${s.fontSize};`);
    lines.push(`  line-height: ${s.lineHeight};`);
    lines.push(`  font-weight: ${s.fontWeight};`);
    if (s.letterSpacing) lines.push(`  letter-spacing: ${s.letterSpacing};`);
    if (s.name === 'rotulo') lines.push('  text-transform: uppercase;');
    lines.push('}');
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n') + '\n');
console.log('tokens.css gerado a partir de', tokens.name);
