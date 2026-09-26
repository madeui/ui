#!/usr/bin/env node

import { Command } from 'commander';
import kleur from 'kleur';

import { add } from './add.ts';
import { diff } from './diff.ts';
import { init } from './init.ts';
import { fetchItem } from './registry.ts';
import { CLI_VERSION, loadConfig } from './project.ts';
import type { CommandOptions, Flags } from './types.ts';


const program = new Command();

program
  .name('madeui')
  .description('components you own, built on Base UI + StyleX')
  .version(CLI_VERSION);

program
  .command('init')
  .description('set up the StyleX build, tokens, and AGENTS.md in this app')
  .option('--registry <url|dir>', 'registry to use')
  .option('--remove-tailwind', 'strip Tailwind (packages, PostCSS/Vite wiring, CSS at-rules) without asking')
  .option('--keep-tailwind', 'leave Tailwind in place without asking')
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
  .command('diff')
  .description('compare installed components with the registry')
  .argument('[components...]', 'component names to show patches for (default: summary of every installed item)')
  .option('--registry <url|dir>', 'registry to use')
  .option('--json', 'print a machine-readable report (includes patches)')
  .option('--exit-code', 'exit with 1 when any installed item differs from the registry')
  .action((names, opts) => diff(process.cwd(), names, opts));

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
function normalize(opts: CommandOptions): Flags {
  return {
    ...opts,
    noInstall: opts.install === false,
    // undefined → ask; true/false → decided by flag.
    removeTailwind: opts.removeTailwind ? true : opts.keepTailwind ? false : undefined,
  };
}

program.parseAsync().catch((err) => {
  console.error(kleur.red(`error: ${err.message}`));
  process.exitCode = 1;
});
