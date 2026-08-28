#!/usr/bin/env node
import { add } from './add.mjs';
import { init } from './init.mjs';
import { fetchItem } from './registry.mjs';
import { loadConfig } from './project.mjs';

const HELP = `ui-lib — components you own, built on Base UI + StyleX

Usage:
  ui-lib init                      set up StyleX build + tokens in this app
  ui-lib add <name> [...names]     install components from the registry
  ui-lib list                      list available registry items

Flags:
  --registry <url|dir>   registry to use (default: ui-lib.json "registry")
  --overwrite            replace existing files that have local changes
  --no-install           print dependency installs instead of running them
`;

function parseArgs(argv) {
  const flags = { overwrite: false, noInstall: false, registry: undefined };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--overwrite') flags.overwrite = true;
    else if (a === '--no-install') flags.noInstall = true;
    else if (a === '--registry') flags.registry = argv[++i];
    else if (a === '--help' || a === '-h') flags.help = true;
    else positional.push(a);
  }
  return { flags, positional };
}

async function list(cwd, flags) {
  const registry = flags.registry ?? loadConfig(cwd)?.registry;
  if (!registry) throw new Error('no registry configured — pass --registry or run init.');
  const index = await fetchItem(registry, 'registry');
  for (const item of index.items ?? []) {
    console.log(`  ${item.name.padEnd(16)} ${item.description ?? ''}`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { flags, positional } = parseArgs(rest);
  const cwd = process.cwd();

  if (!command || flags.help || command === 'help') {
    console.log(HELP);
    return;
  }

  switch (command) {
    case 'init':
      await init(cwd, flags);
      break;
    case 'add':
      await add(cwd, positional, flags);
      break;
    case 'list':
      await list(cwd, flags);
      break;
    default:
      console.error(`unknown command: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(`error: ${err.message}`);
  process.exitCode = 1;
});
