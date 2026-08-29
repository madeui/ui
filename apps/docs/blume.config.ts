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
        // The runtime injects a <style id="__stylex_virtual__"> into the
        // initial document only. Astro's ClientRouter swaps in a whole new
        // <head> on client-side navigation, dropping that tag — and no HMR
        // update fires to restore it, so components render unstyled until a
        // hard reload. Keep the CSS in memory and stamp it onto the INCOMING
        // document at astro:before-swap (synchronously, so no unstyled
        // frame — same pattern as the dark-theme fix), then refetch after
        // each navigation to pick up newly transformed modules.
        injectScript(
          'page',
          `if (import.meta.env.DEV) {
  let lastStylexCss = '';
  const mountStylexCss = (doc, css) => {
    let el = doc.getElementById('__stylex_virtual__');
    if (!el) {
      el = doc.createElement('style');
      el.id = '__stylex_virtual__';
      doc.head.appendChild(el);
    }
    if (css && el.textContent !== css) el.textContent = css;
  };
  const refreshStylexCss = async () => {
    try {
      const css = await (await fetch('/virtual:stylex.css')).text();
      if (css) {
        lastStylexCss = css;
        mountStylexCss(document, css);
      }
    } catch {}
  };
  document.addEventListener('astro:before-swap', (event) => {
    const current = document.getElementById('__stylex_virtual__');
    if (current?.textContent) lastStylexCss = current.textContent;
    mountStylexCss(event.newDocument, lastStylexCss);
  });
  document.addEventListener('astro:page-load', refreshStylexCss);
  refreshStylexCss();
}`
        );
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
  navigation: {
    // href lands on the generated timeline index; without it the tab would
    // resolve to the newest entry (the changelog index isn't a content page).
    tabs: [{ label: 'Changelog', path: '/changelog', href: '/changelog' }],
  },
  examples: {
    source: '../../packages/registry/examples',
    css: 'styles/examples.css',
  },
  integrations: [stylexIntegration as any],
});
