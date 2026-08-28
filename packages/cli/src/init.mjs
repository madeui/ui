import fs from 'node:fs';
import path from 'node:path';

import kleur from 'kleur';

import { add } from './add.mjs';
import {
  CONFIG_FILE,
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
  readPackageJson,
  missingDependencies,
  installDependencies,
} from './project.mjs';

const BABEL_CONFIG = `const path = require('path');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev,
        runtimeInjection: false,
        treeshakeCompensation: true,
        aliases: { '@/*': [path.join(__dirname, '*')] },
        unstable_moduleResolution: { type: 'commonJS' },
      },
    ],
  ],
};
`;

const POSTCSS_CONFIG = `const babelConfig = require('./babel.config');

module.exports = {
  plugins: {
    '@stylexjs/postcss-plugin': {
      include: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
      ],
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ['typescript', 'jsx'] },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: true,
    },
  },
};
`;

// The reset layer MUST be declared before @stylex: with useCSSLayers, any
// unlayered global CSS outranks every StyleX rule and silently zeroes
// component paddings/margins.
const GLOBALS_CSS = `@layer base;

@stylex;

@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}
`;

const AGENTS_MD = `# UI components (ui-lib)

Components in \`components/ui\` are owned by this project (installed via
\`ui-lib add <name>\`, edit freely). They wrap Base UI primitives and are styled
with StyleX (compile-time CSS).

## Rules

- Tokens over literals: colors/radius/fonts/shadows come from
  \`lib/tokens.stylex.ts\` (themable, \`defineVars\`); spacing/type/z/duration
  scales from \`lib/constants.stylex.ts\` (\`defineConsts\`). Never hardcode
  colors, spacing, font sizes, z-indices, or durations in component styles.
- Every component accepts \`variant\`, \`size\` (where meaningful), and a
  \`style?: StyleXStyles\` prop merged last via \`stylex.props(...)\` — caller
  styles always win. Extend by adding variants, not inline escapes.
- StyleX has no attribute selectors. Base UI state (checked/open/highlighted)
  is styled via the \`stateProps\` adapter in \`lib/stylex-utils.ts\`:
  \`{...stateProps((s) => [styles.root, s.checked && styles.checked, style])}\`.
- Popup edges use the \`ring()\` recipe (box-shadow), not borders — Base UI
  positioning math ignores borders.
- Theming: apply themes (e.g. \`darkTheme\` from \`lib/themes.ts\`) to \`<html>\`,
  not a wrapper — dialogs/popovers portal to \`<body>\`.
- Global CSS: keep resets inside \`@layer base\` (declared before \`@stylex\`);
  unlayered CSS overrides all StyleX rules.

## Adding a variant

1. Add the variant name to the component's type union.
2. Add a named style object in its \`stylex.create\` variants map using tokens.
3. Never fork a component for a one-off — pass \`style\` for layout-level tweaks.
`;

function detectFramework(cwd) {
  const pkg = readPackageJson(cwd);
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  if (deps.next) return 'next';
  if (deps.vite) return 'vite';
  return null;
}

function writeIfAbsent(cwd, file, content, changed) {
  const dest = path.join(cwd, file);
  if (fs.existsSync(dest)) {
    console.log(kleur.dim(`  = ${file} exists — left untouched`));
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  changed.push(file);
  console.log(kleur.green(`  + ${file}`));
  return true;
}

function patchGlobalsCss(cwd, changed) {
  const candidates = ['app/globals.css', 'src/app/globals.css', 'styles/globals.css'];
  const existing = candidates.find((f) => fs.existsSync(path.join(cwd, f)));
  if (!existing) {
    writeIfAbsent(cwd, 'app/globals.css', GLOBALS_CSS, changed);
    return;
  }
  const file = path.join(cwd, existing);
  const css = fs.readFileSync(file, 'utf8');
  if (css.includes('@stylex')) {
    console.log(kleur.dim(`  = ${existing} already contains @stylex`));
    return;
  }
  fs.writeFileSync(file, `@layer base;\n\n@stylex;\n\n@layer base {\n${css.trimEnd()}\n}\n`);
  changed.push(existing);
  console.log(kleur.green(`  ~ ${existing}: prepended @stylex, wrapped existing CSS in @layer base`));
}

export async function init(cwd, flags) {
  const pkg = readPackageJson(cwd);
  if (!pkg) {
    throw new Error('no package.json here — run this inside your app.');
  }
  const framework = detectFramework(cwd);
  if (framework !== 'next') {
    throw new Error(
      framework === 'vite'
        ? 'Vite setup is not automated yet — see the docs (StyleX via @stylexswc/unplugin + @stylexjs/postcss-plugin).'
        : 'could not detect a supported framework (Next.js).'
    );
  }

  console.log(kleur.bold('Setting up StyleX for Next.js:'));
  const changed = [];
  writeIfAbsent(cwd, 'babel.config.js', BABEL_CONFIG, changed);
  writeIfAbsent(cwd, 'postcss.config.js', POSTCSS_CONFIG, changed);
  patchGlobalsCss(cwd, changed);
  writeIfAbsent(cwd, 'AGENTS.md', AGENTS_MD, changed);

  const existingConfig = loadConfig(cwd);
  const config = existingConfig ?? {
    ...DEFAULT_CONFIG,
    ...(flags.registry ? { registry: flags.registry } : {}),
  };
  if (!existingConfig) {
    saveConfig(cwd, config);
    console.log(kleur.green(`  + ${CONFIG_FILE}`));
  }

  const missing = missingDependencies(cwd, ['@stylexjs/stylex']);
  const missingDev = missingDependencies(cwd, [
    '@stylexjs/babel-plugin',
    '@stylexjs/postcss-plugin',
  ]);
  if (missing.length + missingDev.length > 0) {
    console.log(kleur.bold('installing dependencies:'));
    await installDependencies(cwd, missing, { dryRun: flags.noInstall });
    await installDependencies(cwd, missingDev, { dev: true, dryRun: flags.noInstall });
  }

  console.log(kleur.bold('installing tokens + utils:'));
  await add(cwd, ['theme', 'utils'], flags);

  console.log(`\nDone. Add components with: ${kleur.bold('ui-lib add button dialog …')}`);
}
