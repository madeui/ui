import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import kleur from 'kleur';

export const CONFIG_FILE = 'madeui.json';

export const DEFAULT_CONFIG = {
  registry: 'https://madeui.com/r',
  paths: {
    ui: 'components/ui',
    lib: 'lib',
  },
};

export function loadConfig(cwd) {
  const file = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(file)) return null;
  return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(file, 'utf8')) };
}

export function saveConfig(cwd, config) {
  fs.writeFileSync(
    path.join(cwd, CONFIG_FILE),
    JSON.stringify(config, null, 2) + '\n'
  );
}

/** Maps an item file's `target` through the configured paths. */
export function resolveTarget(target, config) {
  if (target.startsWith('components/ui/')) {
    return path.join(config.paths.ui, target.slice('components/ui/'.length));
  }
  if (target.startsWith('lib/')) {
    return path.join(config.paths.lib, target.slice('lib/'.length));
  }
  return target;
}

export function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
}

const CLI_VERSION = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8')
).version;

/**
 * How to invoke this CLI again from the user's project, e.g. `npx @madeui/cli
 * add`. Follows the project's package manager, and pins the version when this
 * is a prerelease (a `beta` snapshot), so the next command does not silently
 * resolve to `latest`.
 */
export function cliCommand(cwd, subcommand) {
  const runner = { npm: 'npx', pnpm: 'pnpm dlx', yarn: 'yarn dlx', bun: 'bunx' }[detectPackageManager(cwd)];
  const spec = CLI_VERSION.includes('-') ? `@madeui/cli@${CLI_VERSION}` : '@madeui/cli';
  return `${runner} ${spec} ${subcommand}`;
}

export function readPackageJson(cwd) {
  const file = path.join(cwd, 'package.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function missingDependencies(cwd, deps) {
  const pkg = readPackageJson(cwd);
  if (!pkg) return deps;
  const have = { ...pkg.dependencies, ...pkg.devDependencies };
  return deps.filter((d) => !have[d]);
}

export async function installDependencies(cwd, deps, { dev = false, dryRun = false } = {}) {
  if (deps.length === 0) return;
  const pm = detectPackageManager(cwd);
  const args = [
    pm === 'npm' ? 'install' : 'add',
    ...(dev ? [pm === 'npm' ? '--save-dev' : '-D'] : []),
    ...deps,
  ];
  if (dryRun) {
    console.log(kleur.dim(`  (skipped) ${pm} ${args.join(' ')}`));
    return;
  }
  console.log(kleur.dim(`  $ ${pm} ${args.join(' ')}`));
  await execa(pm, args, { cwd, stdio: 'inherit' });
}
