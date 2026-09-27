import type { PageSource } from '../../site/artifacts/llms.ts';
import type { ResolveExample } from '../../site/artifacts/markdown.ts';

// A small site in the shape of apps/docs/content: a guide with a sidebar
// order, a component page with an Example and a Callout, and two changelog
// entries (listed oldest first, so ordering has to come from the generators).

const introduction = `---
title: Introduction
description: Components you own.
sidebar:
  order: 0
---

Start here.
`;

const button = `---
title: Button
description: "Displays a button …"
---

<Component path="button-demo" />

## Install

\`\`\`bash
npx @madeui/cli add button
\`\`\`

<Callout type="warning">
Buttons submit forms by default.

Set \`type="button"\` otherwise.
</Callout>

## Usage

\`\`\`mdx
<Component path="button-demo" />
\`\`\`

<Component path="does-not-exist" />
`;

const v100 = `---
title: v1.0.0
type: changelog
date: 2026-09-02
---

The first release.
`;

const v110 = `---
title: v1.1.0
type: changelog
date: 2026-09-09
---

Five new components.
`;

export const sources: PageSource[] = [
  {
    page: { route: '/changelog/v1-0-0', file: 'changelog/v1-0-0.mdx', title: 'v1.0.0', date: new Date('2026-09-02') },
    source: v100,
  },
  {
    page: {
      route: '/docs/components/button',
      file: 'docs/components/button.mdx',
      title: 'Button',
      description: 'Displays a button …',
    },
    source: button,
  },
  {
    page: { route: '/docs', file: 'docs/index.mdx', title: 'Introduction', description: 'Components you own.', order: 0 },
    source: introduction,
  },
  {
    page: { route: '/changelog/v1-1-0', file: 'changelog/v1-1-0.mdx', title: 'v1.1.0', date: new Date('2026-09-09') },
    source: v110,
  },
];

export const pages = sources.map((entry) => entry.page);

export const buttonDemo = `export default function ButtonDemo() {
  return <button type="button">Button</button>;
}
`;

/** Example sources by <Component path>. */
export const resolve: ResolveExample = (path) =>
  path === 'button-demo' ? { lang: 'tsx', source: buttonDemo } : undefined;
