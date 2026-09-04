import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';
import kleur from 'kleur';
import prompts from 'prompts';

import { detectPackageManager, readPackageJson } from './project.mjs';

/**
 * Tailwind removal for `init`. madeui components are styled with StyleX;
 * keeping Tailwind alongside it means two CSS pipelines, a PostCSS config we
 * cannot own, and a globals.css we cannot wrap in `@layer base`. So when a
 * freshly scaffolded app (create-next-app / create-vite with the Tailwind
 * option) is detected, `init` offers to strip it: packages, the Tailwind
 * PostCSS/Vite plugin wiring, and the Tailwind at-rules in the CSS.
 *
 * Everything here is deliberately conservative: config files are edited
 * with single, unambiguous string replacements and only deleted when nothing
 * but Tailwind is left in them; CSS at-rules are removed by a small scanner
 * that understands braces and strings. Anything we cannot handle safely is
 * reported as a manual step instead of guessed at.
 */

const TAILWIND_PACKAGE = /^(tailwindcss|@tailwindcss\/.+|tailwindcss-.+|tw-animate-css|prettier-plugin-tailwindcss)$/;

/** Statement at-rules Tailwind adds: `@name … ;` (v3 + v4). */
const STATEMENT_AT_RULES = new Set(['tailwind', 'plugin', 'source', 'config', 'reference']);
/** Block at-rules Tailwind adds: `@name … { … }` (v4). */
const BLOCK_AT_RULES = new Set(['theme', 'utility', 'variant']);
/** `@custom-variant` can be either form. */
const EITHER_AT_RULES = new Set(['custom-variant']);
/** `@import` targets that belong to Tailwind. */
const TAILWIND_IMPORT = /^(tailwindcss|tw-animate-css)(\/|$)/;

const CSS_DIRS = ['app', 'src', 'styles', 'pages'];
const IGNORED_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

export function tailwindPackages(cwd) {
  const pkg = readPackageJson(cwd);
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  return Object.keys(deps).filter((d) => TAILWIND_PACKAGE.test(d));
}

/**
 * Decides whether to remove Tailwind: explicit flags win, then an interactive
 * prompt (default yes), then — with no TTY to ask — keep it and say how to
 * re-run non-interactively.
 */
export async function shouldRemoveTailwind(flags, packages) {
  if (flags.removeTailwind === true) return true;
  if (flags.removeTailwind === false) return false;

  console.log(kleur.yellow(`Tailwind detected (${packages.join(', ')}).`));
  console.log(
    kleur.dim(
      '  madeui styles with StyleX; running both means two CSS pipelines and a\n' +
        '  PostCSS config init cannot own. Removing it deletes the Tailwind packages,\n' +
        '  its PostCSS/Vite wiring, and Tailwind at-rules in your global CSS.'
    )
  );
  if (!process.stdout.isTTY) {
    console.log(
      kleur.dim('  (non-interactive: keeping Tailwind — pass --remove-tailwind to strip it)')
    );
    return false;
  }
  const { remove } = await prompts({
    type: 'confirm',
    name: 'remove',
    message: 'Remove Tailwind from this project?',
    initial: true,
  });
  return remove === true;
}

/**
 * Removes Tailwind from the project. Returns manual steps for anything we
 * did not touch.
 */
export async function removeTailwind(cwd, packages, changed, { dryRun = false } = {}) {
  console.log(kleur.bold('removing Tailwind:'));
  const instructions = [];

  instructions.push(...removePostcssPlugin(cwd, changed));
  instructions.push(...removeVitePlugin(cwd, changed));
  removeConfigFiles(cwd, changed);
  instructions.push(...stripCssFiles(cwd, changed));

  await uninstallDependencies(cwd, packages, { dryRun });

  instructions.push(
    'Tailwind utility classes in your components (className="flex …") no longer do anything — restyle those with StyleX.'
  );
  return instructions;
}

// ---------------------------------------------------------------------------
// package.json

async function uninstallDependencies(cwd, deps, { dryRun }) {
  if (deps.length === 0) return;
  const pm = detectPackageManager(cwd);
  const args = [pm === 'npm' ? 'uninstall' : 'remove', ...deps];
  if (dryRun) {
    console.log(kleur.dim(`  (skipped) ${pm} ${args.join(' ')}`));
    return;
  }
  console.log(kleur.dim(`  $ ${pm} ${args.join(' ')}`));
  await execa(pm, args, { cwd, stdio: 'inherit' });
}

// ---------------------------------------------------------------------------
// postcss.config.*

const POSTCSS_CONFIGS = ['postcss.config.mjs', 'postcss.config.js', 'postcss.config.cjs', 'postcss.config.ts'];

function removePostcssPlugin(cwd, changed) {
  const instructions = [];
  for (const name of POSTCSS_CONFIGS) {
    const file = path.join(cwd, name);
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!/tailwindcss/.test(source)) continue;

    // Drop the plugin entry: `"@tailwindcss/postcss": {},` (object form) or
    // `tailwindcss: {},` / `require('tailwindcss'),` (v3 forms).
    const stripped = source
      .replace(/^[ \t]*['"]?@tailwindcss\/postcss['"]?\s*:\s*\{[^}]*\},?[ \t]*\r?\n/gm, '')
      .replace(/^[ \t]*['"]?tailwindcss['"]?\s*:\s*\{[^}]*\},?[ \t]*\r?\n/gm, '')
      .replace(/^[ \t]*require\(['"]tailwindcss['"]\)(\([^)]*\))?,?[ \t]*\r?\n/gm, '')
      .replace(/^[ \t]*import\s+\w+\s+from\s+['"]@tailwindcss\/postcss['"];?[ \t]*\r?\n/gm, '');

    if (/tailwindcss/.test(stripped)) {
      instructions.push(`${name}: remove the Tailwind plugin by hand (unrecognized shape).`);
      continue;
    }
    // Nothing else configured → the whole file only existed for Tailwind and
    // would shadow the postcss.config.mjs that init writes for StyleX.
    if (/plugins\s*:\s*\{\s*\}/.test(stripped) || /plugins\s*:\s*\[\s*\]/.test(stripped)) {
      fs.unlinkSync(file);
      changed.push(name);
      console.log(kleur.green(`  - ${name} (only configured Tailwind)`));
      continue;
    }
    fs.writeFileSync(file, stripped);
    changed.push(name);
    console.log(kleur.green(`  ~ ${name}: removed the Tailwind plugin`));
    instructions.push(
      `${name} still configures other PostCSS plugins — merge the '@stylexjs/postcss-plugin' entry printed below into it (Next.js must see a single PostCSS config).`
    );
  }
  return instructions;
}

// ---------------------------------------------------------------------------
// vite.config.* (@tailwindcss/vite)

function removeVitePlugin(cwd, changed) {
  const instructions = [];
  const file = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs']
    .map((f) => path.join(cwd, f))
    .find((f) => fs.existsSync(f));
  if (!file) return instructions;
  const name = path.basename(file);
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('@tailwindcss/vite')) return instructions;

  const importMatch = source.match(/^[ \t]*import\s+(\w+)\s+from\s+['"]@tailwindcss\/vite['"];?[ \t]*\r?\n/m);
  if (!importMatch) {
    instructions.push(`${name}: remove the @tailwindcss/vite plugin by hand (unrecognized import).`);
    return instructions;
  }
  const local = importMatch[1];
  let stripped = source.replace(importMatch[0], '');
  // `tailwindcss(),` inside the plugins array, on its own line or inline.
  const call = new RegExp(`^[ \\t]*${local}\\(\\s*\\),?[ \\t]*\\r?\\n|\\b${local}\\(\\s*\\)\\s*,\\s*|,\\s*${local}\\(\\s*\\)`, 'm');
  if (!call.test(stripped)) {
    instructions.push(`${name}: remove the ${local}() plugin call by hand.`);
    return instructions;
  }
  stripped = stripped.replace(call, '');
  fs.writeFileSync(file, stripped);
  changed.push(name);
  console.log(kleur.green(`  ~ ${name}: removed the @tailwindcss/vite plugin`));
  return instructions;
}

// ---------------------------------------------------------------------------
// tailwind.config.* (v3)

function removeConfigFiles(cwd, changed) {
  for (const name of ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'tailwind.config.cjs']) {
    const file = path.join(cwd, name);
    if (!fs.existsSync(file)) continue;
    fs.unlinkSync(file);
    changed.push(name);
    console.log(kleur.green(`  - ${name}`));
  }
}

// ---------------------------------------------------------------------------
// CSS

function* walkCss(cwd) {
  const stack = CSS_DIRS.map((d) => path.join(cwd, d)).filter((d) => fs.existsSync(d));
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) stack.push(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.css')) {
        yield path.join(dir, entry.name);
      }
    }
  }
}

function stripCssFiles(cwd, changed) {
  const instructions = [];
  for (const file of walkCss(cwd)) {
    const css = fs.readFileSync(file, 'utf8');
    const { css: stripped, removed } = stripTailwindCss(css);
    if (removed.length === 0) continue;
    const rel = path.relative(cwd, file);
    fs.writeFileSync(file, stripped);
    changed.push(rel);
    console.log(kleur.green(`  ~ ${rel}: removed ${removed.join(', ')}`));
    if (/@apply\b/.test(stripped)) {
      instructions.push(`${rel}: still uses @apply — rewrite those rules as plain CSS.`);
    }
  }
  return instructions;
}

/**
 * Removes Tailwind at-rules from a stylesheet. Tracks strings, comments and
 * brace depth so a `@theme { … }` block nested with `@media` inside it, or a
 * `;` within a string, cannot derail the scan. Everything else is left
 * byte-for-byte untouched.
 */
export function stripTailwindCss(css) {
  const removed = [];
  let out = '';
  let i = 0;

  while (i < css.length) {
    const ch = css[i];

    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? css.length : end + 2;
      out += css.slice(i, stop);
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const stop = skipString(css, i);
      out += css.slice(i, stop);
      i = stop;
      continue;
    }
    if (ch === '@') {
      const m = /^@([\w-]+)/.exec(css.slice(i));
      if (m && isTailwindAtRule(css, i, m[1])) {
        const stop = skipAtRule(css, i);
        // Also swallow the trailing newline so no blank line is left behind.
        const eol = /^[ \t]*\r?\n/.exec(css.slice(stop));
        i = eol ? stop + eol[0].length : stop;
        const label = m[1] === 'import' ? '@import "tailwindcss"' : `@${m[1]}`;
        if (!removed.includes(label)) removed.push(label);
        continue;
      }
    }
    out += ch;
    i += 1;
  }

  return {
    css: removed.length > 0 ? out.replace(/^\s*\n/, '').replace(/\n{3,}/g, '\n\n') : css,
    removed,
  };
}

function isTailwindAtRule(css, at, name) {
  if (STATEMENT_AT_RULES.has(name) || BLOCK_AT_RULES.has(name) || EITHER_AT_RULES.has(name)) {
    return true;
  }
  if (name !== 'import') return false;
  const rest = css.slice(at + '@import'.length).trimStart();
  const target = /^(?:url\()?\s*['"]([^'"]+)['"]/.exec(rest);
  return target ? TAILWIND_IMPORT.test(target[1]) : false;
}

/** Returns the index just past the at-rule starting at `at` (after `;` or the closing `}`). */
function skipAtRule(css, at) {
  let i = at;
  let depth = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      i = skipString(css, i);
      continue;
    }
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }
    if (ch === ';' && depth === 0) return i + 1;
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
    i += 1;
  }
  return css.length;
}

function skipString(css, at) {
  const quote = css[at];
  let i = at + 1;
  while (i < css.length && css[i] !== quote) {
    if (css[i] === '\\') i += 1;
    i += 1;
  }
  return i + 1;
}
