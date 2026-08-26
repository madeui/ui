import { readdirSync, readFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import StylexRsPlugin from '@stylexswc/unplugin/vite';
import { defineConfig } from 'blume';

const root = dirname(fileURLToPath(import.meta.url));
const registry = join(root, '../../packages/registry');

const dev = process.env.NODE_ENV !== 'production';

// Shared StyleX compiler options — the unplugin (JS transform: stylex.create →
// class names) and the PostCSS plugin (CSS generation: replaces the `@stylex;`
// marker in styles/examples.css) must agree so class hashes match.
const rsOptions = {
  dev,
  aliases: {
    '@/components/ui/*': [join(registry, 'src/ui/*')],
    '@/lib/*': [join(registry, 'src/lib/*')],
  },
  unstable_moduleResolution: { type: 'commonJS' },
};

const stylexIntegration = {
  name: 'stylex',
  hooks: {
    'astro:config:setup': ({ updateConfig }: any) => {
      updateConfig({
        vite: {
          resolve: {
            alias: {
              '@/components/ui': join(registry, 'src/ui'),
              '@/lib': join(registry, 'src/lib'),
            },
          },
          plugins: [
            StylexRsPlugin({
              useCSSLayers: true,
              rsOptions,
            }),
          ],
        },
      });
    },
    // The unplugin emits the generated CSS as dist/_astro/stylex.css, but
    // nothing links it: Blume folds examples.css into a Tailwind v4 entry
    // whose compiler drops the unknown `@stylex;` marker before any PostCSS
    // step could replace it. Examples render inline in the docs pages (see
    // components/ExampleInline.astro), so append the generated CSS to every
    // stylesheet any built page links.
    'astro:build:done': ({ dir }: any) => {
      const dist = fileURLToPath(dir);
      const assets = join(dist, '_astro');
      const stylexCss = readFileSync(join(assets, 'stylex.css'), 'utf8');
      const linked = new Set<string>();
      const walk = (d: string) => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
          const p = join(d, e.name);
          if (e.isDirectory()) walk(p);
          else if (e.name.endsWith('.html')) {
            for (const m of readFileSync(p, 'utf8').matchAll(
              /href="([^"]*\/_astro\/[^"]+\.css)"/g
            )) {
              linked.add(m[1].split('/').pop() as string);
            }
          }
        }
      };
      walk(dist);
      for (const file of linked) {
        appendFileSync(join(assets, file), `\n${stylexCss}`);
      }
      console.log(
        `[stylex] appended generated CSS to ${linked.size} stylesheet(s)`
      );
    },
  },
};

export default defineConfig({
  title: 'ui-lib',
  description:
    'Base UI + StyleX components you own. Agent-friendly by design.',
  content: { root: 'content' },
  examples: {
    source: '../../packages/registry/examples',
    css: 'styles/examples.css',
  },
  integrations: [stylexIntegration as any],
});
