import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { add } from '../src/add.ts';
import type { RegistryItem } from '../src/types.ts';

const ITEMS: RegistryItem[] = [
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

let cwd: string;
const read = (rel: string) => fs.readFileSync(path.join(cwd, rel), 'utf8');
const write = (rel: string, content: string) => {
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
  vi.restoreAllMocks();
  fs.rmSync(path.dirname(cwd), { recursive: true, force: true });
});

test('--overwrite replaces the named item but keeps changed dependency files', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  await add(cwd, ['button'], { overwrite: true, noInstall: true });
  expect(read('components/ui/button.tsx')).toBe('button\n');
  expect(read('lib/tokens.stylex.ts')).toBe('rethemed\n');
  const output = log.mock.calls.map((args) => args.join(' ')).join('\n');
  expect(output).toMatch(/lib\/tokens\.stylex\.ts kept — theme is a dependency; name it too/);
});

test('--overwrite replaces a dependency when it is named too', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  await add(cwd, ['button', 'theme'], { overwrite: true, noInstall: true });
  expect(read('lib/tokens.stylex.ts')).toBe('tokens\n');
});
