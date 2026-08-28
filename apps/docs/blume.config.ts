import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unplugin as stylexPlugin } from '@stylexjs/unplugin';
import { defineConfig } from 'blume';

const root = dirname(fileURLToPath(import.meta.url));
const registry = join(root, '../../packages/registry');

const stylexIntegration = {
  name: 'stylex',
  hooks: {
    'astro:config:setup': ({ updateConfig, injectScript, command }: any) => {
      // Dev: the plugin serves its CSS at /virtual:stylex.css and ships a
      // runtime script that inlines it (+ HMR updates), but it injects that
      // script via Vite's transformIndexHtml, which Astro never runs on its
      // pages — so inject it ourselves on every page.
      if (command === 'dev') {
        injectScript('page', `import 'virtual:stylex:runtime';`);
      }
      const stylex = stylexPlugin.vite({
        dev: process.env.NODE_ENV !== 'production',
        aliases: {
          '@/components/ui/*': [join(registry, 'src/ui/*')],
          '@/lib/*': [join(registry, 'src/lib/*')],
        },
        unstable_moduleResolution: { type: 'commonJS' },
      });
      // Workaround (report upstream): the plugin's configureServer starts a
      // 150ms polling interval cleared only via server.httpServer 'close' —
      // Astro's build-time Vite server runs in middleware mode (no
      // httpServer), so the interval leaks and `blume build` never exits.
      // configureServer only serves dev middleware; drop it for builds.
      if (command === 'build') {
        for (const p of Array.isArray(stylex) ? stylex : [stylex]) {
          delete (p as any).configureServer;
        }
      }
      updateConfig({
        vite: {
          resolve: {
            alias: {
              '@/components/ui': join(registry, 'src/ui'),
              '@/lib': join(registry, 'src/lib'),
            },
            // The registry sources live outside the Vite root; without dedupe
            // the dev server can evaluate a second React copy and every island
            // dies with "Invalid hook call".
            dedupe: ['react', 'react-dom'],
          },
          optimizeDeps: {
            entries: [join(registry, 'examples/**/*.tsx')],
          },
          // Official StyleX plugin: transforms the JS and routes the
          // extracted CSS through the module graph itself, so it ends up in
          // the page-linked stylesheets in both dev and build — no virtual
          // CSS module or post-build append step needed. No CSS layers: the
          // docs' own (unlayered) styles would beat layered StyleX rules.
          plugins: [stylex],
        },
      });
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
