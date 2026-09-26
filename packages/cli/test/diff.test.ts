import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { collectDiff } from '../src/diff.ts';
import { DEFAULT_CONFIG, loadConfig } from '../src/project.ts';
import type { Config, RegistryItem } from '../src/types.ts';

const BUTTON = "export function Button() {}\n";
const TOKENS = 'export const tokens = {};\n';
const THEMES = 'export const darkTheme = {};\n';

const ITEMS: RegistryItem[] = [
  {
    name: 'theme',
    type: 'registry:lib',
    files: [
      { path: 'lib/tokens.stylex.ts', target: 'lib/tokens.stylex.ts', content: TOKENS },
      { path: 'lib/themes.ts', target: 'lib/themes.ts', content: THEMES },
    ],
  },
  {
    name: 'button',
    type: 'registry:ui',
    registryDependencies: ['@madeui/theme'],
    files: [{ path: 'ui/button.tsx', target: 'components/ui/button.tsx', content: BUTTON }],
  },
  {
    name: 'dialog',
    type: 'registry:ui',
    files: [{ path: 'ui/dialog.tsx', target: 'components/ui/dialog.tsx', content: 'dialog\n' }],
  },
];

let cwd: string;
let registry: string;

function write(rel: string, content: string) {
  const file = path.join(cwd, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run(names: string[] = [], config: Config = { ...DEFAULT_CONFIG, registry }) {
  return collectDiff(cwd, { registry, names, config });
}

beforeEach(() => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'madeui-diff-'));
  cwd = path.join(root, 'app');
  registry = path.join(root, 'r');
  fs.mkdirSync(cwd);
  fs.mkdirSync(registry);
  // The index lists file targets without content, like the generated one.
  const index = {
    name: 'madeui',
    items: ITEMS.map(({ files, ...item }) => ({
      ...item,
      files: files?.map(({ content: _, ...file }) => file),
    })),
  };
  fs.writeFileSync(path.join(registry, 'registry.json'), JSON.stringify(index));
  for (const item of ITEMS) {
    fs.writeFileSync(path.join(registry, `${item.name}.json`), JSON.stringify(item));
  }
});

afterEach(() => {
  fs.rmSync(path.dirname(cwd), { recursive: true, force: true });
});

describe('collectDiff', () => {
  test('lists only installed items when no names are given', async () => {
    write('components/ui/button.tsx', BUTTON);
    const { items } = await run();
    expect(items.map((i) => i.name)).toEqual(['button']);
  });

  test('a file matching the registry is same, with no fix', async () => {
    write('components/ui/button.tsx', BUTTON);
    const [button] = (await run()).items;
    expect(button).toEqual({
      name: 'button',
      type: 'registry:ui',
      status: 'same',
      files: [{ path: 'components/ui/button.tsx', status: 'same' }],
    });
  });

  test('a changed file differs, carries a patch toward the registry, and an overwrite fix', async () => {
    write('components/ui/button.tsx', 'export function Button() { return null; }\n');
    const [button] = (await run()).items;
    expect(button?.status).toBe('differs');
    const patch = button?.files[0]?.patch;
    expect(button?.files[0]?.status).toBe('differs');
    expect(patch).toMatch(/^--- components\/ui\/button\.tsx/);
    expect(patch).toMatch(/^-export function Button\(\) \{ return null; \}$/m);
    expect(patch).toMatch(/^\+export function Button\(\) \{\}$/m);
    expect(button?.fix).toMatch(/add button --overwrite$/);
  });

  test('an item with one file present counts as installed; the absent file is missing', async () => {
    write('lib/tokens.stylex.ts', TOKENS);
    const [theme] = (await run()).items;
    expect(theme).toEqual({
      name: 'theme',
      type: 'registry:lib',
      status: 'differs',
      files: [
        { path: 'lib/tokens.stylex.ts', status: 'same' },
        { path: 'lib/themes.ts', status: 'missing' },
      ],
      // Only missing files: a plain add restores them without touching the rest.
      fix: expect.stringMatching(/add theme$/),
    });
  });

  test('named items skip their registry dependencies', async () => {
    write('components/ui/button.tsx', BUTTON);
    write('lib/tokens.stylex.ts', 'retheme\n');
    const { items } = await run(['button']);
    expect(items.map((i) => i.name)).toEqual(['button']);
  });

  test('a named item that is not installed reports not-installed', async () => {
    const [dialog] = (await run(['@madeui/dialog'])).items;
    expect(dialog).toEqual({ name: 'dialog', type: 'registry:ui', status: 'not-installed', files: [] });
  });

  test('a name missing from the registry is an error', async () => {
    await expect(run(['nope'])).rejects.toThrow(/registry item not found: nope/);
  });

  test('targets follow the configured paths', async () => {
    const config = { ...DEFAULT_CONFIG, registry, paths: { ui: 'src/ui', lib: 'src/lib' } };
    write('src/ui/button.tsx', BUTTON);
    const [button] = (await run([], config)).items;
    expect(button?.files).toEqual([{ path: 'src/ui/button.tsx', status: 'same' }]);
  });

  test('a partial paths config keeps the default for the rest', async () => {
    fs.writeFileSync(path.join(cwd, 'madeui.json'), JSON.stringify({ registry, paths: { ui: 'src/ui' } }));
    write('lib/tokens.stylex.ts', TOKENS);
    const config = loadConfig(cwd);
    expect(config?.paths).toEqual({ ui: 'src/ui', lib: 'lib' });
    const [theme] = (await run([], config ?? undefined)).items;
    expect(theme?.files[0]?.status).toBe('same');
  });

  test('CRLF line endings alone do not make a file differ', async () => {
    write('components/ui/button.tsx', BUTTON.replace(/\n/g, '\r\n'));
    const [button] = (await run()).items;
    expect(button?.status).toBe('same');
  });

  test('the fix installs from the registry the diff was computed against', async () => {
    write('components/ui/button.tsx', 'edited\n');
    const hosted = { ...DEFAULT_CONFIG, registry: 'https://madeui.com/r' };
    const [button] = (await run([], hosted)).items;
    expect(button?.fix).toMatch(new RegExp(`add button --overwrite --registry ${registry}$`));
    const [configured] = (await run()).items;
    expect(configured?.fix).not.toMatch(/--registry/);
  });
});
