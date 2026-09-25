import fs from 'node:fs';
import path from 'node:path';

import kleur from 'kleur';
import prompts from 'prompts';

import { printPatch, unifiedPatch } from './diff.mjs';
import { bareName, resolveItems } from './registry.mjs';
import {
  requireConfig,
  readInstalled,
  matchesRegistry,
  createSpinner,
  missingDependencies,
  installDependencies,
} from './project.mjs';

async function confirmOverwrite(target) {
  if (!process.stdout.isTTY) return false;
  const { overwrite } = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: `${target} has local changes — overwrite?`,
    initial: false,
  });
  return overwrite === true;
}

export async function add(cwd, names, flags) {
  const config = requireConfig(cwd);
  const registry = flags.registry ?? config.registry;

  const spinner = createSpinner({ text: `resolving ${names.join(', ')}` }).start();
  let items;
  try {
    items = await resolveItems(registry, names);
    spinner.succeed(`resolved ${items.length} item(s)`);
  } catch (err) {
    spinner.fail();
    throw err;
  }

  // --overwrite covers the items asked for, not the registry dependencies
  // they pull in: `add button --overwrite` must not reset a rethemed
  // tokens file. Name the dependency to replace it too.
  const named = new Set(names.map(bareName));
  const written = [];
  const kept = [];
  const deps = new Set();

  for (const item of items) {
    for (const dep of item.dependencies ?? []) deps.add(dep);
    for (const file of item.files ?? []) {
      const { target, dest, current } = readInstalled(cwd, file, config);
      if (matchesRegistry(current, file.content)) continue; // already up to date

      if (flags.diff) {
        if (current === null) {
          console.log(kleur.green(`+ ${target} (new file)`));
        } else {
          console.log(kleur.bold(`~ ${target}`));
          printPatch(unifiedPatch(target, current, file.content));
        }
        continue;
      }

      const overwrite = flags.overwrite && named.has(item.name);
      if (current !== null && !overwrite && !(await confirmOverwrite(target))) {
        kept.push({ target, dependency: flags.overwrite ? item.name : null });
        continue;
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, file.content);
      written.push(target);
    }
  }

  if (flags.diff) return;

  for (const f of written) console.log(kleur.green(`  + ${f}`));
  for (const { target, dependency } of kept) {
    const hint = dependency
      ? `${dependency} is a dependency; name it too to overwrite it`
      : 'rerun with --overwrite or --diff to compare';
    console.log(kleur.yellow(`  ! ${target} kept — ${hint}`));
  }
  if (written.length === 0 && kept.length === 0) {
    console.log(kleur.dim('  everything already up to date.'));
  }

  const missing = missingDependencies(cwd, [...deps]);
  if (missing.length > 0) {
    await installDependencies(cwd, missing, { dryRun: flags.noInstall });
  }
}
