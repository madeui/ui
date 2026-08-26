// Generates shadcn-compatible registry JSON from the component sources.
// Output: packages/registry/public/r/<item>.json + registry.json index.
// Registry JSON is always generated, never hand-edited (see CLAUDE.md).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'r');

const REGISTRY_NAME = 'ui-lib';
// Placeholder until the registry is hosted; local installs use file paths.
const HOMEPAGE = 'https://example.com';

const read = (path) => readFile(join(root, path), 'utf8');

const themeItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'theme',
  type: 'registry:lib',
  title: 'Design tokens',
  description:
    'StyleX design tokens (defineVars) and the dark theme (createTheme). Edit lib/tokens.stylex.ts to retheme your app.',
  dependencies: ['@stylexjs/stylex'],
  files: [
    {
      path: 'lib/tokens.stylex.ts',
      content: await read('src/lib/tokens.stylex.ts'),
      type: 'registry:lib',
      target: 'lib/tokens.stylex.ts',
    },
    {
      path: 'lib/themes.ts',
      content: await read('src/lib/themes.ts'),
      type: 'registry:lib',
      target: 'lib/themes.ts',
    },
  ],
};

const uiItem = async (name, description) => ({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name,
  type: 'registry:ui',
  title: name[0].toUpperCase() + name.slice(1),
  description,
  dependencies: ['@base-ui/react', '@stylexjs/stylex'],
  registryDependencies: [`${HOMEPAGE}/r/theme.json`],
  files: [
    {
      path: `ui/${name}.tsx`,
      content: await read(`src/ui/${name}.tsx`),
      type: 'registry:ui',
      target: `components/ui/${name}.tsx`,
    },
  ],
});

const items = [
  themeItem,
  await uiItem(
    'button',
    'Button built on Base UI, styled with StyleX. Variants: primary, secondary, outline, ghost, destructive.'
  ),
  await uiItem(
    'dialog',
    'Modal dialog built on Base UI Dialog, styled with StyleX.'
  ),
];

await mkdir(outDir, { recursive: true });

for (const item of items) {
  await writeFile(
    join(outDir, `${item.name}.json`),
    `${JSON.stringify(item, null, 2)}\n`
  );
}

const index = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  items: items.map(({ files, ...rest }) => ({
    ...rest,
    files: files.map(({ content, ...file }) => file),
  })),
};

await writeFile(
  join(outDir, 'registry.json'),
  `${JSON.stringify(index, null, 2)}\n`
);

console.log(
  `Built ${items.length} registry items → ${outDir.replace(`${process.cwd()}/`, '')}`
);
