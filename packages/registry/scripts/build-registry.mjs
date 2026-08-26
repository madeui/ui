// Generates shadcn-compatible registry JSON from the component sources.
// Output: packages/registry/public/r/<item>.json + registry.json index.
// Registry JSON is always generated, never hand-edited (see CLAUDE.md).
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'r');

const REGISTRY_NAME = 'ui-lib';
// Placeholder until the registry is hosted; local installs use file paths.
const HOMEPAGE = 'https://example.com';

const DESCRIPTIONS = {
  alert: 'Callout for user attention. Variants: default, destructive.',
  avatar: 'Avatar built on Base UI with image and fallback. Sizes: sm, md, lg.',
  badge: 'Small status descriptor. Variants: primary, secondary, outline, destructive.',
  button:
    'Button built on Base UI. Variants: primary, secondary, outline, ghost, destructive. Sizes: sm, md, lg, icon.',
  card: 'Content container with header, content, and footer sections.',
  checkbox: 'Checkbox built on Base UI with checked/indeterminate states.',
  dialog: 'Modal dialog built on Base UI Dialog.',
  'dropdown-menu':
    'Menu of actions built on Base UI Menu: items, groups, labels, separators.',
  input: 'Text input built on Base UI Input.',
  popover: 'Floating panel anchored to a trigger, built on Base UI Popover.',
  'radio-group': 'Radio group built on Base UI Radio/RadioGroup.',
  select: 'Select built on Base UI Select with popup list and indicators.',
  switch: 'Toggle switch built on Base UI Switch.',
  tabs: 'Tabbed panels built on Base UI Tabs.',
  textarea: 'Multi-line text input.',
  toast: 'Notifications built on Base UI Toast: ToastProvider + Toaster + useToast().',
  tooltip: 'Text label on hover/focus, built on Base UI Tooltip.',
};

const read = (path) => readFile(join(root, path), 'utf8');

const libItem = async (name, title, description, files) => ({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name,
  type: 'registry:lib',
  title,
  description,
  dependencies: ['@stylexjs/stylex'],
  files: await Promise.all(
    files.map(async (file) => ({
      path: `lib/${file}`,
      content: await read(`src/lib/${file}`),
      type: 'registry:lib',
      target: `lib/${file}`,
    }))
  ),
});

const uiItem = async (name) => {
  const content = await read(`src/ui/${name}.tsx`);
  const dependencies = ['@stylexjs/stylex'];
  if (content.includes("from '@base-ui/react/")) {
    dependencies.unshift('@base-ui/react');
  }
  const registryDependencies = ['@ui-lib/theme'];
  if (content.includes("'@/lib/stylex-utils'")) {
    registryDependencies.push('@ui-lib/utils');
  }
  if (!DESCRIPTIONS[name]) {
    throw new Error(`Missing description for "${name}" in DESCRIPTIONS`);
  }
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:ui',
    title: name
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' '),
    description: DESCRIPTIONS[name],
    dependencies,
    registryDependencies,
    files: [
      {
        path: `ui/${name}.tsx`,
        content,
        type: 'registry:ui',
        target: `components/ui/${name}.tsx`,
      },
    ],
  };
};

const componentNames = (await readdir(join(root, 'src', 'ui')))
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''))
  .sort();

const items = [
  await libItem(
    'theme',
    'Design tokens',
    'StyleX design tokens (defineVars) and the dark theme (createTheme). Edit lib/tokens.stylex.ts to retheme your app.',
    ['tokens.stylex.ts', 'themes.ts']
  ),
  await libItem(
    'utils',
    'StyleX utilities',
    'stateProps: adapter mapping Base UI state to conditional StyleX styles.',
    ['stylex-utils.ts']
  ),
  ...(await Promise.all(componentNames.map(uiItem))),
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
