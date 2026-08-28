import fs from 'node:fs';
import path from 'node:path';

/**
 * Registry access: a registry is either a URL prefix (https://…/r) or a local
 * directory containing the same `<name>.json` item files. Both come from the
 * generated `packages/registry/public/r` layout, so the CLI and any
 * shadcn-compatible consumer read identical files.
 */
export function isLocalRegistry(registry) {
  return !/^https?:\/\//.test(registry);
}

export async function fetchItem(registry, name) {
  // Accept namespaced ids (@ns/button) — the namespace is only routing sugar.
  const bare = name.startsWith('@') ? name.split('/').slice(1).join('/') : name;
  if (isLocalRegistry(registry)) {
    const file = path.join(registry, `${bare}.json`);
    if (!fs.existsSync(file)) {
      throw new Error(`registry item not found: ${file}`);
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const url = `${registry.replace(/\/$/, '')}/${bare}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`registry item not found: ${url} (${res.status})`);
  }
  return res.json();
}

/** Resolves an item plus its registryDependencies, depth-first, deduped. */
export async function resolveItems(registry, names, seen = new Map()) {
  for (const name of names) {
    const bare = name.startsWith('@') ? name.split('/').slice(1).join('/') : name;
    if (seen.has(bare)) continue;
    const item = await fetchItem(registry, bare);
    seen.set(bare, item);
    if (item.registryDependencies?.length) {
      await resolveItems(registry, item.registryDependencies, seen);
    }
  }
  return [...seen.values()];
}
