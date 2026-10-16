import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * O bundle oficial do Design System (design-system/project/components/bundle.js) é um script
 * clássico que lê `window.React` e publica `window.Lobinho`. Este plugin o transforma, sem alterar
 * uma linha do código original, em um módulo ES que recebe o escopo como parâmetro — assim os
 * componentes oficiais funcionam no bundler e na pré-renderização (SSR), sem objetos globais.
 */
function designSystemBundle(): Plugin {
  return {
    name: 'lobinho-design-system-bundle',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').endsWith('design-system/project/components/bundle.js')) return null;
      return {
        code: `export default function installDesignSystem(window) {\n${code}\nreturn window.Lobinho;\n}\n`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [designSystemBundle(), react()],
  resolve: {
    alias: {
      '@lobinho-ds/bundle': fileURLToPath(new URL('./design-system/project/components/bundle.js', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  server: { port: 5173 },
});
