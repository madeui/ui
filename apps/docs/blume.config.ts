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

// Dev-only: `astro:build:done` never runs under `blume dev`, so the generated
// StyleX CSS is served as a virtual module instead, imported into every page.
// The CSS is produced by the @stylexswc PostCSS plugin scanning the registry
// sources (same rs-compiler as the unplugin, so class hashes match).
const VIRTUAL_CSS = 'virtual:ui-lib-stylex.css';
const RESOLVED_CSS = `\0${VIRTUAL_CSS}`;

const devStylexCss = () => {
  let server: any;
  const generate = async () => {
    const { default: postcss } = await import('postcss');
    const { default: stylexPostcss } = await import(
      '@stylexswc/postcss-plugin'
    );
    const result = await postcss([
      stylexPostcss({
        cwd: root,
        include: [
          join(registry, 'src/**/*.{ts,tsx}'),
          join(registry, 'examples/**/*.tsx'),
        ],
        rsOptions,
      }) as any,
    ]).process('@stylex;', { from: 'ui-lib-stylex.css' });
    return result.css;
  };
  return {
    name: 'ui-lib-dev-stylex-css',
    apply: 'serve' as const,
    configureServer(s: any) {
      server = s;
    },
    resolveId(id: string) {
      if (id === VIRTUAL_CSS) return RESOLVED_CSS;
    },
    async load(id: string) {
      if (id === RESOLVED_CSS) return await generate();
    },
    handleHotUpdate(ctx: any) {
      if (!ctx.file.startsWith(registry)) return;
      const mod = server?.moduleGraph.getModuleById(RESOLVED_CSS);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
};

const stylexIntegration = {
  name: 'stylex',
  hooks: {
    'astro:config:setup': ({ updateConfig, injectScript, command }: any) => {
      if (command === 'dev') {
        injectScript('page-ssr', `import '${VIRTUAL_CSS}';`);
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
          plugins: [
            devStylexCss(),
            // No CSS layers: the docs' own (unlayered) styles would beat
            // layered StyleX rules; unlayered + appended last wins instead.
            StylexRsPlugin({
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
