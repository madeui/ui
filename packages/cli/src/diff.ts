
import { createTwoFilesPatch } from 'diff';
import kleur from 'kleur';

import { bareName, fetchItem } from './registry.ts';
import { cliCommand, createSpinner, matchesRegistry, readInstalled, requireConfig } from './project.ts';
import type { Config, DiffFlags, RegistryIndexItem, RegistryItem } from './types.ts';

export type FileStatus = 'same' | 'differs' | 'missing';

export interface FileReport {
  path: string;
  status: FileStatus;
  /** Only when `differs`: local copy → registry. */
  patch?: string;
}

export interface ItemReport {
  name: string;
  type: string;
  status: 'same' | 'differs' | 'not-installed';
  files: FileReport[];
  /** Only when `differs`: the command that restores the registry version. */
  fix?: string;
}

/** The `--json` output. */
export interface DiffReport {
  registry: string;
  items: ItemReport[];
}

/**
 * Unified diff from the local file to the registry version: what `add
 * --overwrite` would change. Starts at the `---` header.
 */
export function unifiedPatch(target: string, oldContent: string, newContent: string): string {
  return createTwoFilesPatch(target, target, oldContent, newContent)
    .split('\n')
    .slice(2)
    .join('\n');
}

/** Prints a patch from unifiedPatch, colored, without its file headers. */
export function printPatch(patch: string): void {
  for (const line of patch.split('\n').slice(2)) {
    if (line.startsWith('+')) console.log(kleur.green(line));
    else if (line.startsWith('-')) console.log(kleur.red(line));
    else if (line.startsWith('@@')) console.log(kleur.cyan(line));
    else console.log(kleur.dim(line));
  }
}

/**
 * Compares installed files with the registry's current version. There is no
 * record of what was installed, so an item counts as installed when any of
 * its files exists at its target, and a file either matches the registry
 * (`same`), does not (`differs`), or is absent (`missing`). Named items are
 * checked on their own, without their registry dependencies.
 */
export async function collectDiff(
  cwd: string,
  { registry, names = [], config }: { registry: string; names?: string[]; config: Config }
): Promise<DiffReport> {
  const index = await fetchItem(registry, 'registry');
  const byName = new Map((index.items ?? []).map((item) => [item.name, item]));

  let candidates: RegistryIndexItem[];
  if (names.length > 0) {
    candidates = [...new Set(names.map(bareName))].map((name) => {
      const item = byName.get(name);
      if (!item) throw new Error(`registry item not found: ${name}`);
      return item;
    });
  } else {
    candidates = [...byName.values()];
  }

  const installed = candidates.filter((item) =>
    (item.files ?? []).some((file) => readInstalled(cwd, file, config).current !== null)
  );
  const full = new Map(
    await Promise.all(
      installed.map(async (item): Promise<[string, RegistryItem]> => [item.name, await fetchItem(registry, item.name)])
    )
  );

  // The fix has to install from the registry the patch was computed against.
  const registryFlag = registry === config.registry ? '' : ` --registry ${shellQuote(registry)}`;
  const items: ItemReport[] = [];
  for (const candidate of candidates) {
    const item = full.get(candidate.name);
    if (!item) {
      if (names.length > 0) {
        items.push({ name: candidate.name, type: candidate.type, status: 'not-installed', files: [] });
      }
      continue;
    }

    const files = (item.files ?? []).map((file): FileReport => {
      const { target, current } = readInstalled(cwd, file, config);
      if (current === null) return { path: target, status: 'missing' };
      if (matchesRegistry(current, file.content)) return { path: target, status: 'same' };
      return { path: target, status: 'differs', patch: unifiedPatch(target, current, file.content) };
    });

    const entry: ItemReport = { name: item.name, type: item.type, status: 'same', files };
    if (files.some((f) => f.status !== 'same')) {
      entry.status = 'differs';
      // A plain add restores missing files and keeps the rest; replacing a
      // changed file needs --overwrite.
      const overwrite = files.some((f) => f.status === 'differs');
      entry.fix = cliCommand(cwd, `add ${item.name}${overwrite ? ' --overwrite' : ''}${registryFlag}`);
    }
    items.push(entry);
  }

  return { registry, items };
}

function shellQuote(value: string): string {
  return /^[\w@%+=:,./-]+$/.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`;
}

const MARK: Record<FileStatus, string> = { same: kleur.dim('='), differs: kleur.yellow('~'), missing: kleur.red('-') };

export async function diff(cwd: string, names: string[], flags: DiffFlags): Promise<void> {
  const config = requireConfig(cwd);
  const registry = flags.registry ?? config.registry;

  // JSON goes to stdout untouched; the spinner would only be noise there.
  const spinner = flags.json ? null : createSpinner({ text: 'comparing with the registry' }).start();
  let report: DiffReport;
  try {
    report = await collectDiff(cwd, { registry, names, config });
    spinner?.stop();
  } catch (err) {
    spinner?.fail();
    throw err;
  }

  const differs = report.items.filter((item) => item.status === 'differs');
  if (flags.exitCode && differs.length > 0) process.exitCode = 1;

  if (flags.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (report.items.length === 0) {
    console.log(kleur.dim('  no madeui components found in this project.'));
    return;
  }

  for (const item of report.items) {
    if (item.status === 'not-installed') {
      console.log(`  ${kleur.dim('?')} ${kleur.bold(item.name)} ${kleur.dim('not installed')}`);
      continue;
    }
    if (item.status === 'same') {
      console.log(`  ${MARK.same} ${item.name}`);
      continue;
    }
    console.log(`  ${MARK.differs} ${kleur.bold(item.name)}`);
    for (const file of item.files) {
      if (file.status === 'same') continue;
      console.log(`      ${MARK[file.status]} ${file.path} ${kleur.dim(file.status)}`);
      // Patches only when asked for by name; the bare command is a summary.
      if (names.length > 0 && file.patch) printPatch(file.patch);
    }
    console.log(kleur.dim(`      → ${item.fix}`));
  }

  const installed = report.items.filter((item) => item.status !== 'not-installed').length;
  console.log(kleur.dim(`\n  ${installed} installed · ${differs.length} differ from the registry`));
  if (names.length === 0 && differs.length > 0) {
    console.log(kleur.dim(`  see the changes: ${cliCommand(cwd, 'diff <name>')}`));
  }
}
