import fs from 'node:fs';
import path from 'node:path';

import kleur from 'kleur';

/**
 * Best-effort patchers for the user's own config files. Each one applies a
 * single, unambiguous string edit when the file has the expected shape, and
 * otherwise prints the exact snippet for the user to apply — never a risky
 * rewrite of a file we don't fully understand.
 *
 * Vite uses the official @stylexjs/unplugin
 * (https://stylexjs.com/docs/learn/installation/vite/vite-react):
 * it runs its own bundled Babel pass, so it works with @vitejs/plugin-react v6
 * (which dropped its Babel pipeline) and injects the extracted CSS into the
 * app's CSS asset — no PostCSS config or @stylex marker needed. Per the
 * official guide it must come BEFORE the React plugin to preserve Fast
 * Refresh, and the app must import at least one CSS file from its root.
 */

const STYLEX_PLUGIN_SNIPPET = `stylexPlugin.vite({
      aliases: {
        '@/*': [fileURLToPath(new URL('src/*', import.meta.url))],
      },
      unstable_moduleResolution: { type: 'commonJS' },
    })`;

const RESOLVE_ALIAS_SNIPPET = `resolve: {
    alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
  },`;

export function patchViteConfig(cwd, changed) {
  const file = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs']
    .map((f) => path.join(cwd, f))
    .find((f) => fs.existsSync(f));
  const instructions = [];

  if (!file) {
    instructions.push(
      `create a vite.config.ts with @stylexjs/unplugin registered:\n  plugins: [${STYLEX_PLUGIN_SNIPPET}, react()]`
    );
    return instructions;
  }

  const name = path.basename(file);
  let source = fs.readFileSync(file, 'utf8');
  if (source.includes('@stylexjs/unplugin')) {
    console.log(kleur.dim(`  = ${name} already configures StyleX`));
    return instructions;
  }

  let touched = false;

  // 1. Register the StyleX plugin BEFORE the React plugin (official guide:
  // preserves Fast Refresh).
  if (/react\(\s*\)/.test(source)) {
    source = source.replace(/react\(\s*\)/, `${STYLEX_PLUGIN_SNIPPET},\n    react()`);
    touched = true;
  } else {
    instructions.push(`${name}: add to the plugins array:\n  ${STYLEX_PLUGIN_SNIPPET}`);
  }

  // 2. `@` → ./src alias so component imports (@/lib/…) resolve at runtime.
  if (!/resolve\s*:/.test(source) && source.includes('defineConfig({')) {
    source = source.replace('defineConfig({', `defineConfig({\n  ${RESOLVE_ALIAS_SNIPPET}`);
    touched = true;
  } else if (!/alias/.test(source)) {
    instructions.push(`${name}: add inside defineConfig({ … }):\n  ${RESOLVE_ALIAS_SNIPPET}`);
  }

  if (touched) {
    const imports = [];
    if (!source.includes('@stylexjs/unplugin')) {
      imports.push("import { unplugin as stylexPlugin } from '@stylexjs/unplugin'");
    }
    if (!source.includes("from 'node:url'") && !source.includes('from "node:url"')) {
      imports.push("import { fileURLToPath } from 'node:url'");
    }
    if (imports.length > 0) {
      source = `${imports.join('\n')}\n${source}`;
    }
    fs.writeFileSync(file, source);
    changed.push(name);
    console.log(kleur.green(`  ~ ${name}: added StyleX plugin + '@' alias`));
  }

  return instructions;
}

export function patchTsconfigPaths(cwd, changed) {
  // Vite templates split config: compilerOptions live in tsconfig.app.json.
  const file = ['tsconfig.app.json', 'tsconfig.json']
    .map((f) => path.join(cwd, f))
    .find((f) => fs.existsSync(f));
  const instructions = [];
  if (!file) return instructions;

  const name = path.basename(file);
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes('"paths"')) {
    console.log(kleur.dim(`  = ${name} already defines paths`));
    return instructions;
  }
  // Targeted string insert: tsconfig files often contain comments, so a
  // JSON.parse round-trip would fail or destroy them. No baseUrl — modern
  // TypeScript resolves relative "paths" without it (and TS 6 deprecates it).
  const marker = '"compilerOptions": {';
  if (!source.includes(marker)) {
    instructions.push(`${name}: add to compilerOptions:\n  "paths": { "@/*": ["./src/*"] }`);
    return instructions;
  }
  fs.writeFileSync(
    file,
    source.replace(marker, `${marker}\n    "paths": { "@/*": ["./src/*"] },`)
  );
  changed.push(name);
  console.log(kleur.green(`  ~ ${name}: added "@/*" paths`));
  return instructions;
}
