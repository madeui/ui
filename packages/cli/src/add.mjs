import fs from 'node:fs';
import path from 'node:path';

import { createTwoFilesPatch } from 'diff';
import kleur from 'kleur';
import prompts from 'prompts';

import { resolveItems } from './registry.mjs';
import {
  loadConfig,
  resolveTarget,
  cliCommand,
  createSpinner,
  missingDependencies,
  installDependencies,
} from './project.mjs';

function printPatch(target, oldContent, newContent) {
  const patch = createTwoFilesPatch(target, target, oldContent, newContent);
  for (const line of patch.split('\n').slice(4)) {
    if (line.startsWith('+')) console.log(kleur.green(line));
    else if (line.startsWith('-')) console.log(kleur.red(line));
    else if (line.startsWith('@@')) console.log(kleur.cyan(line));
    else console.log(kleur.dim(line));
  }
}

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
  const config = loadConfig(cwd);
  if (!config) {
    throw new Error(
      `no madeui.json found — run \`${cliCommand(cwd, 'init')}\` first (or create one with a \`registry\` field).`
    );
  }
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

  const written = [];
  const kept = [];
  const deps = new Set();

  for (const item of items) {
    for (const dep of item.dependencies ?? []) deps.add(dep);
    for (const file of item.files ?? []) {
      const target = resolveTarget(file.target ?? file.path, config);
      const dest = path.join(cwd, target);
      const current = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;

      if (current === file.content) continue; // already up to date

      if (flags.diff) {
        if (current === null) {
          console.log(kleur.green(`+ ${target} (new file)`));
        } else {
          console.log(kleur.bold(`~ ${target}`));
          printPatch(target, current, file.content);
        }
        continue;
      }

      if (current !== null && !flags.overwrite && !(await confirmOverwrite(target))) {
        kept.push(target);
        continue;
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, file.content);
      written.push(target);
    }
  }

  if (flags.diff) return;

  for (const f of written) console.log(kleur.green(`  + ${f}`));
  for (const f of kept) {
    console.log(kleur.yellow(`  ! ${f} kept — rerun with --overwrite or --diff to compare`));
  }
  if (written.length === 0 && kept.length === 0) {
    console.log(kleur.dim('  everything already up to date.'));
  }

  const missing = missingDependencies(cwd, [...deps]);
  if (missing.length > 0) {
    await installDependencies(cwd, missing, { dryRun: flags.noInstall });
  }
}
