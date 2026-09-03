// Generates shadcn-compatible registry JSON from the component sources.
// Output: packages/registry/public/r/<item>.json + registry.json index.
// Registry JSON is always generated, never hand-edited (see AGENTS.md).
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'r');

const REGISTRY_NAME = 'madeui';
const HOMEPAGE = 'https://madeui.com';

const DESCRIPTIONS = {
  accordion: 'Vertically stacked collapsible panels built on Base UI Accordion.',
  autocomplete:
    'Free-text input with a filtered suggestion popup, built on Base UI Autocomplete.',
  'aspect-ratio': 'Constrains content to a given width/height ratio.',
  'button-group': 'Fuses buttons and inputs into one segmented control.',
  'checkbox-group':
    'Shared checked state across checkboxes, built on Base UI Checkbox Group.',
  command:
    'Command palette built on Base UI Autocomplete (inline mode): input, filtered list, dialog wrapper.',
  drawer:
    'Swipeable panel built on Base UI Drawer. Directions: down, up, left, right.',
  empty: 'Empty state with media, title, description, and content slots.',
  field:
    'Accessible form field layout built on Base UI Field: label, description, validation errors.',
  form:
    'Form built on Base UI Form: validates fields, consolidates errors, accepts server errors.',
  'input-group':
    'Input with leading/trailing addons, buttons, and text, drawn as one control.',
  item: 'Generic list row with media, content, and actions. Variants: default, outline, muted.',
  kbd: 'Keyboard key hint.',
  meter: 'Graduated gauge built on Base UI Meter with label and value.',
  'number-field':
    'Numeric input with increment/decrement buttons, built on Base UI Number Field.',
  spinner: 'Loading indicator.',
  toolbar: 'Grouped controls built on Base UI Toolbar; compose with Button/Toggle via render.',
  alert:
    'Callout for user attention with an optional action slot. Variants: default, destructive.',
  'alert-dialog':
    'Modal confirmation dialog built on Base UI Alert Dialog: Action, Cancel, Media. Sizes: md, sm.',
  breadcrumb: 'Path navigation with links, separators, and ellipsis.',
  collapsible: 'Collapsible region built on Base UI Collapsible (unstyled parts).',
  combobox:
    'Autocomplete input built on Base UI Combobox: filtering popup list, multi-select chips, select-like trigger, clear button.',
  'context-menu':
    'Right-click menu built on Base UI Context Menu: items, checkbox/radio items, submenus, shortcuts.',
  'input-otp':
    'One-time-code input built on Base UI OTP Field with joined slots.',
  menubar:
    'Desktop-style menu bar built on Base UI Menubar, composing the dropdown-menu parts.',
  'navigation-menu':
    'Site navigation with animated popup panels, built on Base UI Navigation Menu.',
  'hover-card': 'Preview card shown on hover, built on Base UI Preview Card.',
  label: 'Form label with spacing for inline controls.',
  pagination: 'Page navigation with previous/next and page links, built on Button.',
  progress: 'Task progress bar built on Base UI Progress with label and value.',
  'scroll-area': 'Custom scrollbars built on Base UI Scroll Area.',
  separator: 'Visual divider built on Base UI Separator. Horizontal or vertical.',
  sheet: 'Side panel dialog built on Base UI Dialog. Sides: top, right, bottom, left.',
  skeleton: 'Loading placeholder with pulse animation.',
  slider: 'Range slider built on Base UI Slider with one or more thumbs.',
  table: 'Data table with header, body, footer, and caption.',
  toggle: 'Two-state button built on Base UI Toggle. Variants: default, outline.',
  'toggle-group':
    'Group of toggles built on Base UI Toggle Group. Spacing: gap, joined.',
  avatar:
    'Avatar built on Base UI with image and fallback, plus badge, group, and group-count parts. Sizes: sm, md, lg.',
  badge:
    'Small status descriptor. Variants: primary, secondary, outline, ghost, destructive.',
  button:
    'Button built on Base UI. Variants: primary, secondary, outline, ghost, destructive. Sizes: xs, sm, md, lg, icon, iconXs, iconSm, iconLg.',
  card:
    'Content container with header, action, content, and footer sections. Sizes: md, sm.',
  checkbox: 'Checkbox built on Base UI with checked/indeterminate states.',
  dialog: 'Modal dialog built on Base UI Dialog.',
  'dropdown-menu':
    'Menu of actions built on Base UI Menu: items, groups, labels, separators.',
  input: 'Text input built on Base UI Input.',
  popover:
    'Floating panel anchored to a trigger, built on Base UI Popover, with header, title, and description parts.',
  'radio-group': 'Radio group built on Base UI Radio/RadioGroup.',
  select: 'Select built on Base UI Select with popup list and indicators.',
  switch: 'Toggle switch built on Base UI Switch.',
  tabs: 'Tabbed panels built on Base UI Tabs.',
  textarea: 'Multi-line text input.',
  toast:
    'Stacked, swipeable notifications built on Base UI Toast with an imperative toast() API.',
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
  const registryDependencies = ['@madeui/theme'];
  if (content.includes("'@/lib/stylex-utils'")) {
    registryDependencies.push('@madeui/utils');
  }
  // Components composed from other components (e.g. pagination → button).
  for (const match of content.matchAll(/from '@\/components\/ui\/([a-z-]+)'/g)) {
    registryDependencies.push(`@madeui/${match[1]}`);
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
    'StyleX design tokens: themable vars (tokens.stylex.ts), non-themed scales (constants.stylex.ts), and the dark theme (themes.ts). Edit lib/tokens.stylex.ts to retheme your app.',
    ['tokens.stylex.ts', 'constants.stylex.ts', 'themes.ts']
  ),
  await libItem(
    'utils',
    'StyleX utilities',
    'ring(): box-shadow edge recipe for popups (borders shift Base UI positioning).',
    ['stylex-utils.ts']
  ),
  await libItem(
    'use-hotkey',
    'useHotkey',
    'Global keyboard shortcut hook (e.g. ⌘K for the command palette).',
    ['use-hotkey.ts']
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
