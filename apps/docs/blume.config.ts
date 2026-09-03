import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unplugin as stylexPlugin } from '@stylexjs/unplugin';
import { defineConfig } from 'blume';

const root = dirname(fileURLToPath(import.meta.url));
const registry = join(root, '../../packages/registry');

// The generated registry JSON (packages/registry/public/r) is what the
// shadcn CLI fetches — it has to ship with the site, but it lives outside
// this app so it can't sit in public/. Copy it into the build output.
const registryEndpoints = {
  name: 'registry-endpoints',
  hooks: {
    'astro:build:done': async ({ dir }: any) => {
      const { cp } = await import('node:fs/promises');
      await cp(join(registry, 'public/r'), join(fileURLToPath(dir), 'r'), {
        recursive: true,
      });
    },
  },
};

// Blume sizes the header brand mark with a hardcoded utility class and exposes
// no config for it, so madeui's one override ships as a plain stylesheet:
// copied into the build output and linked from every page. A CSS `import` via
// injectScript is silently dropped here, hence the copy-and-link route (the
// same shape as registryEndpoints above). The dev hook re-adds it client-side,
// since astro:build:done never runs under `blume dev`.
const brandStyles = {
  name: 'brand-styles',
  hooks: {
    'astro:config:setup': ({ injectScript, command }: any) => {
      if (command === 'dev') {
        injectScript(
          'page',
          `if (!document.querySelector('link[data-madeui-brand]')) {
             const l = document.createElement('link');
             l.rel = 'stylesheet'; l.href = '/brand.css';
             l.setAttribute('data-madeui-brand', '');
             document.head.appendChild(l);
           }`,
        );
      }
    },
    'astro:build:done': async ({ dir }: any) => {
      const { copyFile, readdir, readFile, writeFile } = await import('node:fs/promises');
      const dist = fileURLToPath(dir);
      await copyFile(join(root, 'styles/brand.css'), join(dist, 'brand.css'));
      const tag = '<link rel="stylesheet" href="/brand.css" data-madeui-brand>';
      const walk = async (d: string): Promise<string[]> => {
        const out: string[] = [];
        for (const e of await readdir(d, { withFileTypes: true })) {
          const full = join(d, e.name);
          if (e.isDirectory()) out.push(...(await walk(full)));
          else if (e.name.endsWith('.html')) out.push(full);
        }
        return out;
      };
      for (const file of await walk(dist)) {
        const html = await readFile(file, 'utf8');
        if (html.includes('data-madeui-brand') || !html.includes('</head>')) continue;
        await writeFile(file, html.replace('</head>', `${tag}</head>`));
      }
    },
  },
};

const stylexIntegration = {
  name: 'stylex',
  hooks: {
    // The unplugin appends all collected StyleX CSS to ONE css asset (the
    // docs' shared chunk). The landing page (custom page, own chunk) never
    // links it — find the asset by a token only StyleX css contains and add
    // the link so the live component bento renders styled.
    'astro:build:done': async ({ dir }: any) => {
      const { readdir, readFile, writeFile } = await import('node:fs/promises');
      const dist = fileURLToPath(dir);
      const astroDir = join(dist, '_astro');
      const files = (await readdir(astroDir)).filter((f: string) => f.endsWith('.css'));
      let target: string | undefined;
      for (const f of files) {
        const css = await readFile(join(astroDir, f), 'utf8');
        if (css.includes('cubic-bezier(.23, 1, .32, 1)') || css.includes('cubic-bezier(0.23, 1, 0.32, 1)')) {
          target = f;
          break;
        }
      }
      if (!target) return;
      const indexPath = join(dist, 'index.html');
      let html = await readFile(indexPath, 'utf8');
      if (!html.includes(target)) {
        html = html.replace('</head>', `<link rel="stylesheet" href="/_astro/${target}"></head>`);
        await writeFile(indexPath, html);
      }
    },
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
  title: 'madeui',
  description:
    'Base UI + StyleX components you own. Agent-friendly by design.',
  // Full lockup SVG (glyph + wordmark); text lives inside the SVG.
  logo: { image: '/brand/lockup.svg', text: '' },
  theme: {
    // The brand is monochrome: the accent is ink, so it has to flip per mode
    // (a single near-black accent would vanish on the dark background).
    // Same values as the `foreground` token in lib/tokens.stylex.ts.
    accent: { light: '#0A0A0A', dark: '#FAFAFA' },
  },
  content: { root: 'content' },
  // Absolute origin for sitemap, canonicals, and the changelog RSS feed.
  deployment: { site: 'https://madeui.com' },
  navigation: {
    // href lands on the generated timeline index; without it the tab would
    // resolve to the newest entry (the changelog index isn't a content page).
    tabs: [
      { label: 'Docs', path: '/docs' },
      { label: 'Changelog', path: '/changelog', href: '/changelog' },
    ],
  },
  examples: {
    source: '../../packages/registry/examples',
    css: 'styles/examples.css',
  },
  integrations: [stylexIntegration as any, registryEndpoints as any, brandStyles as any],
});
