import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { collectDiff } from '../src/diff.mjs';
import { DEFAULT_CONFIG, loadConfig } from '../src/project.mjs';

const BUTTON = "export function Button() {}\n";
const TOKENS = 'export const tokens = {};\n';
const THEMES = 'export const darkTheme = {};\n';

const ITEMS = [
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

let cwd;
let registry;

function write(rel, content) {
  const file = path.join(cwd, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run(names = [], config = { ...DEFAULT_CONFIG, registry }) {
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
      files: files.map(({ content, ...file }) => file),
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
    assert.deepEqual(items.map((i) => i.name), ['button']);
  });

  test('a file matching the registry is same, with no fix', async () => {
    write('components/ui/button.tsx', BUTTON);
    const [button] = (await run()).items;
    assert.equal(button.status, 'same');
    assert.deepEqual(button.files, [{ path: 'components/ui/button.tsx', status: 'same' }]);
    assert.equal(button.fix, undefined);
  });

  test('a changed file differs, carries a patch toward the registry, and an overwrite fix', async () => {
    write('components/ui/button.tsx', 'export function Button() { return null; }\n');
    const [button] = (await run()).items;
    assert.equal(button.status, 'differs');
    assert.equal(button.files[0].status, 'differs');
    assert.match(button.files[0].patch, /^--- components\/ui\/button\.tsx/);
    assert.match(button.files[0].patch, /^-export function Button\(\) \{ return null; \}$/m);
    assert.match(button.files[0].patch, /^\+export function Button\(\) \{\}$/m);
    assert.match(button.fix, /add button --overwrite$/);
  });

  test('an item with one file present counts as installed; the absent file is missing', async () => {
    write('lib/tokens.stylex.ts', TOKENS);
    const [theme] = (await run()).items;
    assert.equal(theme.name, 'theme');
    assert.equal(theme.status, 'differs');
    assert.deepEqual(theme.files, [
      { path: 'lib/tokens.stylex.ts', status: 'same' },
      { path: 'lib/themes.ts', status: 'missing' },
    ]);
    // Only missing files: a plain add restores them without touching the rest.
    assert.match(theme.fix, /add theme$/);
  });

  test('named items skip their registry dependencies', async () => {
    write('components/ui/button.tsx', BUTTON);
    write('lib/tokens.stylex.ts', 'retheme\n');
    const { items } = await run(['button']);
    assert.deepEqual(items.map((i) => i.name), ['button']);
  });

  test('a named item that is not installed reports not-installed', async () => {
    const [dialog] = (await run(['@madeui/dialog'])).items;
    assert.deepEqual(dialog, { name: 'dialog', type: 'registry:ui', status: 'not-installed', files: [] });
  });

  test('a name missing from the registry is an error', async () => {
    await assert.rejects(run(['nope']), /registry item not found: nope/);
  });

  test('targets follow the configured paths', async () => {
    const config = { ...DEFAULT_CONFIG, paths: { ui: 'src/ui', lib: 'src/lib' } };
    write('src/ui/button.tsx', BUTTON);
    const [button] = (await run([], config)).items;
    assert.deepEqual(button.files, [{ path: 'src/ui/button.tsx', status: 'same' }]);
  });

  test('a partial paths config keeps the default for the rest', async () => {
    const config = { registry, paths: { ui: 'src/ui' } };
    fs.writeFileSync(path.join(cwd, 'madeui.json'), JSON.stringify(config));
    write('lib/tokens.stylex.ts', TOKENS);
    const [theme] = (await run([], loadConfig(cwd))).items;
    assert.equal(theme.files[0].status, 'same');
  });

  test('CRLF line endings alone do not make a file differ', async () => {
    write('components/ui/button.tsx', BUTTON.replace(/\n/g, '\r\n'));
    const [button] = (await run()).items;
    assert.equal(button.status, 'same');
  });

  test('the fix installs from the registry the diff was computed against', async () => {
    write('components/ui/button.tsx', 'edited\n');
    const config = { ...DEFAULT_CONFIG, registry: 'https://madeui.com/r' };
    const [button] = (await run([], config)).items;
    assert.match(button.fix, new RegExp(`add button --overwrite --registry ${registry}$`));
    const [same] = (await collectDiff(cwd, { registry, config: { ...config, registry } })).items;
    assert.doesNotMatch(same.fix, /--registry/);
  });
});
