import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';

import { add } from '../src/add.mjs';

const ITEMS = [
  {
    name: 'theme',
    type: 'registry:lib',
    files: [{ path: 'lib/tokens.stylex.ts', target: 'lib/tokens.stylex.ts', content: 'tokens\n' }],
  },
  {
    name: 'button',
    type: 'registry:ui',
    registryDependencies: ['@madeui/theme'],
    files: [{ path: 'ui/button.tsx', target: 'components/ui/button.tsx', content: 'button\n' }],
  },
];

let cwd;
const read = (rel) => fs.readFileSync(path.join(cwd, rel), 'utf8');
const write = (rel, content) => {
  fs.mkdirSync(path.dirname(path.join(cwd, rel)), { recursive: true });
  fs.writeFileSync(path.join(cwd, rel), content);
};

beforeEach(() => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'madeui-add-'));
  cwd = path.join(root, 'app');
  const registry = path.join(root, 'r');
  fs.mkdirSync(cwd);
  fs.mkdirSync(registry);
  for (const item of ITEMS) {
    fs.writeFileSync(path.join(registry, `${item.name}.json`), JSON.stringify(item));
  }
  fs.writeFileSync(path.join(cwd, 'madeui.json'), JSON.stringify({ registry }));
  write('lib/tokens.stylex.ts', 'rethemed\n');
  write('components/ui/button.tsx', 'edited\n');
});

afterEach(() => {
  fs.rmSync(path.dirname(cwd), { recursive: true, force: true });
});

test('--overwrite replaces the named item but keeps changed dependency files', async (t) => {
  const log = t.mock.method(console, 'log', () => {});
  await add(cwd, ['button'], { overwrite: true, noInstall: true });
  assert.equal(read('components/ui/button.tsx'), 'button\n');
  assert.equal(read('lib/tokens.stylex.ts'), 'rethemed\n');
  const output = log.mock.calls.map((c) => c.arguments.join(' ')).join('\n');
  assert.match(output, /lib\/tokens\.stylex\.ts kept — theme is a dependency; name it too/);
});

test('--overwrite replaces a dependency when it is named too', async (t) => {
  t.mock.method(console, 'log', () => {});
  await add(cwd, ['button', 'theme'], { overwrite: true, noInstall: true });
  assert.equal(read('lib/tokens.stylex.ts'), 'tokens\n');
});
