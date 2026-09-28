import babelConfig from './babel.config.js';

// The PostCSS setup `madeui init` writes for Next.js. The include globs swap
// the app-local lib/ (here `@/lib/*` is the registry's) for the registry
// source and examples, which the site compiles in place.
const config = {
  plugins: {
    '@stylexjs/postcss-plugin': {
      include: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        '../../packages/registry/src/**/*.{ts,tsx}',
        '../../packages/registry/examples/**/*.{ts,tsx}',
      ],
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ['typescript', 'jsx'] },
        plugins: babelConfig.plugins,
      },
      // StyleX declares the layer order itself: base first, then its own
      // priority layers — so the reset in globals.css loses to every
      // component style.
      useCSSLayers: { before: ['base'] },
    },
  },
};

export default config;
