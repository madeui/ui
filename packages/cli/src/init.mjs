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
import { removeTailwind, shouldRemoveTailwind, tailwindPackages } from './tailwind.mjs';
import { patchViteConfig, patchTsconfigPaths } from './vite.mjs';

const STYLEX_BABEL_PLUGIN = (aliasRoot) => `[
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV !== 'production',
        runtimeInjection: false,
        treeshakeCompensation: true,
        aliases: { '@/*': [path.join(__dirname, ${aliasRoot})] },
        unstable_moduleResolution: { type: 'commonJS' },
      },
    ]`;

const NEXT_BABEL_CONFIG = `const path = require('path');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    ${STYLEX_BABEL_PLUGIN("'*'")},
  ],
};
`;

const NEXT_POSTCSS_CONFIG = `const babelConfig = require('./babel.config');

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

const AGENTS_MD = `# UI components (madeui)

The components under the configured \`ui\` path (see madeui.json) are owned by
this project (installed via \`madeui add <name>\`, edit freely). They wrap
Base UI primitives and are styled with StyleX (compile-time CSS).

## Rules

- Tokens over literals: colors/radius/fonts/shadows come from
  \`tokens.stylex.ts\` (themable, \`defineVars\`); spacing/type/z/duration
  scales from \`constants.stylex.ts\` (\`defineConsts\`). Never hardcode
  colors, spacing, font sizes, z-indices, or durations in component styles.
- Every component accepts \`variant\`, \`size\` (where meaningful), and a
  \`style?: StyleXStyles\` prop merged last via \`stylex.props(...)\` — caller
  styles always win. Extend by adding variants, not inline escapes.
- Base UI state (checked/open/highlighted) is styled with attribute-selector
  condition keys inside \`stylex.create\` — Base UI mirrors state as data
  attributes: \`backgroundColor: { default: '...', '[data-checked]': ... }\`.
  Conditional custom properties: use \`default: null\` + \`var(--x, fallback)\`
  where consumed (a non-null default is emitted unlayered and always wins).
- Popup edges use the \`ring()\` recipe (box-shadow), not borders — Base UI
  positioning math ignores borders.
- Icons are \`lucide-react\`, sized with the \`icon\` styles from
  \`stylex-utils.ts\` (\`{...stylex.props(icon.md)}\`) — never hand-drawn SVG,
  never the \`size\` prop.
- Theming: apply themes (e.g. \`darkTheme\` from \`themes.ts\`) to \`<html>\`,
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

/**
 * Finds (or creates) the global CSS file and ensures it starts with the
 * layered reset + @stylex marker. Returns the file path for madeui.json —
 * detection happens once here, every later run reads the config instead.
 */
function ensureGlobalsCss(cwd, candidates, fallback, changed) {
  const existing = candidates.find((f) => fs.existsSync(path.join(cwd, f)));
  if (!existing) {
    writeIfAbsent(cwd, fallback, GLOBALS_CSS, changed);
    return fallback;
  }
  const file = path.join(cwd, existing);
  const css = fs.readFileSync(file, 'utf8');
  if (css.includes('@stylex')) {
    console.log(kleur.dim(`  = ${existing} already contains @stylex`));
    return existing;
  }
  // Tailwind kept: `@import` must stay first and we cannot wrap the file in
  // @layer base (an @import inside a block is invalid), so only add the
  // marker after the Tailwind import.
  const tailwindImport = /^[ \t]*@import\s+['"]tailwindcss['"];?[ \t]*\r?\n/m.exec(css);
  if (tailwindImport) {
    const at = tailwindImport.index + tailwindImport[0].length;
    fs.writeFileSync(file, `${css.slice(0, at)}\n@stylex;\n${css.slice(at)}`);
    changed.push(existing);
    console.log(kleur.green(`  ~ ${existing}: added @stylex after the Tailwind import`));
    return existing;
  }
  fs.writeFileSync(file, `@layer base;\n\n@stylex;\n\n@layer base {\n${css.trimEnd()}\n}\n`);
  changed.push(existing);
  console.log(kleur.green(`  ~ ${existing}: prepended @stylex, wrapped existing CSS in @layer base`));
  return existing;
}

const FRAMEWORKS = {
  next: {
    label: 'Next.js',
    paths: { ui: 'components/ui', lib: 'lib' },
    cssCandidates: ['app/globals.css', 'src/app/globals.css', 'styles/globals.css'],
    cssFallback: 'app/globals.css',
    devDependencies: ['@stylexjs/babel-plugin', '@stylexjs/postcss-plugin'],
    setup(cwd, changed) {
      writeIfAbsent(cwd, 'babel.config.js', NEXT_BABEL_CONFIG, changed);
      // Next.js reads exactly one PostCSS config; writing ours next to an
      // existing .mjs/.cjs would make the outcome depend on lookup order.
      const other = ['postcss.config.mjs', 'postcss.config.cjs', 'postcss.config.ts'].find((f) =>
        fs.existsSync(path.join(cwd, f))
      );
      if (other) {
        console.log(kleur.dim(`  = ${other} exists — not writing postcss.config.js`));
        return [
          `${other}: add the '@stylexjs/postcss-plugin' entry (see https://stylexjs.com/docs/learn/installation/nextjs):\n${NEXT_POSTCSS_CONFIG}`,
        ];
      }
      writeIfAbsent(cwd, 'postcss.config.js', NEXT_POSTCSS_CONFIG, changed);
      return [];
    },
  },
  vite: {
    label: 'Vite + React',
    paths: { ui: 'src/components/ui', lib: 'src/lib' },
    // The official @stylexjs/unplugin extracts and injects the CSS itself —
    // no @stylex marker, no PostCSS config, and (with unlayered output) no
    // reset-layer concern in the user's global CSS.
    css: null,
    devDependencies: ['@stylexjs/unplugin'],
    setup(cwd, changed) {
      return [
        ...patchViteConfig(cwd, changed),
        ...patchTsconfigPaths(cwd, changed),
      ];
    },
  },
};

export async function init(cwd, flags) {
  const pkg = readPackageJson(cwd);
  if (!pkg) {
    throw new Error('no package.json here — run this inside your app.');
  }
  const name = detectFramework(cwd);
  const framework = FRAMEWORKS[name];
  if (!framework) {
    throw new Error('could not detect a supported framework (Next.js or Vite).');
  }

  const changed = [];
  const instructions = [];

  const tailwind = tailwindPackages(cwd);
  if (tailwind.length > 0) {
    if (await shouldRemoveTailwind(flags, tailwind)) {
      instructions.push(...(await removeTailwind(cwd, tailwind, changed, { dryRun: flags.noInstall })));
    } else {
      instructions.push(
        'Tailwind kept: madeui components ignore Tailwind classes; keep the reset in @layer base and @stylex after the Tailwind import.'
      );
    }
  }

  console.log(kleur.bold(`Setting up StyleX for ${framework.label}:`));
  instructions.push(...framework.setup(cwd, changed));
  const cssFile =
    framework.css === null
      ? null
      : ensureGlobalsCss(cwd, framework.cssCandidates, framework.cssFallback, changed);
  writeIfAbsent(cwd, 'AGENTS.md', AGENTS_MD, changed);

  const existingConfig = loadConfig(cwd);
  const config = existingConfig ?? {
    ...DEFAULT_CONFIG,
    ...(flags.registry ? { registry: flags.registry } : {}),
    paths: framework.paths,
    ...(cssFile ? { css: cssFile } : {}),
  };
  if (!existingConfig) {
    saveConfig(cwd, config);
    console.log(kleur.green(`  + ${CONFIG_FILE}`));
  }

  const missing = missingDependencies(cwd, ['@stylexjs/stylex']);
  const missingDev = missingDependencies(cwd, framework.devDependencies);
  if (missing.length + missingDev.length > 0) {
    console.log(kleur.bold('installing dependencies:'));
    await installDependencies(cwd, missing, { dryRun: flags.noInstall });
    await installDependencies(cwd, missingDev, { dev: true, dryRun: flags.noInstall });
  }

  console.log(kleur.bold('installing tokens + utils:'));
  await add(cwd, ['theme', 'utils'], flags);

  if (instructions.length > 0) {
    console.log(kleur.yellow('\nManual steps:'));
    for (const step of instructions) console.log(`  • ${step}`);
  }
  console.log(`\nDone. Add components with: ${kleur.bold('madeui add button dialog …')}`);
}
