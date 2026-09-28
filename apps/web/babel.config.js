const path = require('path');

// The StyleX Babel setup `madeui init` writes for Next.js, with one change:
// the aliases point at the registry source instead of an app-local `@/*`, so
// the site compiles packages/registry directly (no copies).
//
// Project root. Not __dirname: when Turbopack loads postcss.config.mjs it
// bundles this file too, and __dirname becomes the virtual '/ROOT/'.
const root = process.cwd();
const registry = path.resolve(root, '../../packages/registry');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV !== 'production',
        runtimeInjection: false,
        treeshakeCompensation: true,
        aliases: {
          '@/components/ui/*': [path.join(registry, 'src/ui/*')],
          '@/lib/*': [path.join(registry, 'src/lib/*')],
          '@/components/site/*': [path.join(root, 'components/site/*')],
          '@/components/landing/*': [path.join(root, 'components/landing/*')],
          '@examples/*': [path.join(registry, 'examples/*')],
        },
        unstable_moduleResolution: { type: 'commonJS' },
      },
    ],
  ],
};
