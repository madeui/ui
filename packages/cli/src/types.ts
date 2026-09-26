/**
 * Shapes the CLI reads and writes. Types only: registry JSON and madeui.json
 * are trusted as generated and are not validated at runtime.
 */

/** Where a registry file goes: `target` when set, else `path`. */
export interface RegistryFileRef {
  path: string;
  type?: string;
  target?: string;
}

export interface RegistryFile extends RegistryFileRef {
  content: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

/** An item as `registry.json` lists it: files without content. */
export interface RegistryIndexItem extends Omit<RegistryItem, 'files'> {
  files?: RegistryFileRef[];
}

export interface RegistryIndex {
  name?: string;
  items?: RegistryIndexItem[];
}

/** madeui.json, with the defaults filled in. */
export interface Config {
  registry: string;
  paths: { ui: string; lib: string };
  css?: string;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** Command options as `init` and `add` use them. */
export interface Flags {
  registry?: string;
  overwrite?: boolean;
  diff?: boolean;
  noInstall?: boolean;
  /** undefined → ask; true/false → decided by flag. */
  removeTailwind?: boolean;
}

/** Commander's raw options for `init` and `add`, before normalize() in index.ts. */
export type CommandOptions = Omit<Flags, 'noInstall'> & {
  install?: boolean;
  keepTailwind?: boolean;
};

export interface DiffFlags {
  registry?: string;
  json?: boolean;
  exitCode?: boolean;
}
