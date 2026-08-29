#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command } from 'commander';
import kleur from 'kleur';

import { add } from './add.mjs';
import { init } from './init.mjs';
import { fetchItem } from './registry.mjs';
import { loadConfig } from './project.mjs';

const pkg = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json'),
    'utf8'
  )
);

const program = new Command();

program
  .name('madeui')
  .description('components you own, built on Base UI + StyleX')
  .version(pkg.version);

program
  .command('init')
  .description('set up the StyleX build, tokens, and AGENTS.md in this app')
  .option('--registry <url|dir>', 'registry to use')
  .option('--no-install', 'print dependency installs instead of running them')
  .action((opts) => init(process.cwd(), normalize(opts)));

program
  .command('add')
  .description('install components from the registry')
  .argument('<components...>', 'component names (e.g. button dialog select)')
  .option('--registry <url|dir>', 'registry to use')
  .option('--overwrite', 'replace files that have local changes without asking')
  .option('--diff', 'show what would change without writing anything')
  .option('--no-install', 'print dependency installs instead of running them')
  .action((names, opts) => add(process.cwd(), names, normalize(opts)));

program
  .command('list')
  .description('list available registry items')
  .option('--registry <url|dir>', 'registry to use')
  .action(async (opts) => {
    const registry = opts.registry ?? loadConfig(process.cwd())?.registry;
    if (!registry) {
      throw new Error('no registry configured — pass --registry or run init.');
    }
    const index = await fetchItem(registry, 'registry');
    for (const item of index.items ?? []) {
      console.log(`  ${kleur.bold(item.name.padEnd(16))} ${kleur.dim(item.description ?? '')}`);
    }
  });

// Commander's --no-install arrives as `install: false`; flip it into the
// affirmative flag the commands use.
function normalize(opts) {
  return { ...opts, noInstall: opts.install === false };
}

program.parseAsync().catch((err) => {
  console.error(kleur.red(`error: ${err.message}`));
  process.exitCode = 1;
});
