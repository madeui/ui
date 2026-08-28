import fs from 'node:fs';
import path from 'node:path';

import { resolveItems } from './registry.mjs';
import {
  loadConfig,
  resolveTarget,
  missingDependencies,
  installDependencies,
} from './project.mjs';

export async function add(cwd, names, flags) {
  const config = loadConfig(cwd);
  if (!config) {
    throw new Error(
      "no ui-lib.json found — run `ui-lib init` first (or create one with a `registry` field)."
    );
  }
  const registry = flags.registry ?? config.registry;
  if (names.length === 0) {
    throw new Error('nothing to add — pass one or more component names.');
  }

  const items = await resolveItems(registry, names);
  const written = [];
  const skipped = [];
  const deps = new Set();

  for (const item of items) {
    for (const dep of item.dependencies ?? []) deps.add(dep);
    for (const file of item.files ?? []) {
      const target = resolveTarget(file.target ?? file.path, config);
      const dest = path.join(cwd, target);
      if (fs.existsSync(dest)) {
        const current = fs.readFileSync(dest, 'utf8');
        if (current === file.content) continue; // already up to date
        if (!flags.overwrite) {
          skipped.push(target);
          continue;
        }
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, file.content);
      written.push(target);
    }
  }

  for (const f of written) console.log(`  + ${f}`);
  for (const f of skipped) {
    console.log(`  ! ${f} exists with local changes — kept (use --overwrite to replace)`);
  }
  if (written.length === 0 && skipped.length === 0) {
    console.log('  everything already up to date.');
  }

  const missing = missingDependencies(cwd, [...deps]);
  if (missing.length > 0) {
    console.log('installing dependencies:');
    installDependencies(cwd, missing, { dryRun: flags.noInstall });
  }
}
