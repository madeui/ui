import { describe, expect, test } from 'vitest';

import { eyebrow, pager, sidebar } from '../site/nav.ts';
import type { ContentPage } from '../site/routes.ts';

// Loose guides with a sidebar order, a components folder, changelog entries.
const pages: ContentPage[] = [
  { route: '/docs/components/button', file: 'docs/components/button.mdx', title: 'Button', badge: 'New' },
  { route: '/docs/installation', file: 'docs/installation.mdx', title: 'Installation', order: 1 },
  { route: '/changelog/v1-0-0', file: 'changelog/v1-0-0.mdx', title: 'v1.0.0', date: new Date('2026-09-02') },
  { route: '/docs', file: 'docs/index.mdx', title: 'Introduction', order: 0 },
  { route: '/docs/components/alert', file: 'docs/components/alert.mdx', title: 'Alert' },
  { route: '/changelog/v1-1-0', file: 'changelog/v1-1-0.mdx', title: 'v1.1.0', date: new Date('2026-09-09') },
];

describe('sidebar', () => {
  test('the Docs tab: the guides under "Getting started", then one group per folder', () => {
    expect(sidebar(pages, '/docs')).toEqual([
      {
        label: 'Getting started',
        links: [
          { route: '/docs', title: 'Introduction' },
          { route: '/docs/installation', title: 'Installation' },
        ],
      },
      {
        label: 'Components',
        links: [
          { route: '/docs/components/alert', title: 'Alert' },
          { route: '/docs/components/button', title: 'Button', badge: 'New' },
        ],
      },
    ]);
  });

  test('the Changelog tab: its entries, newest first, without a heading', () => {
    expect(sidebar(pages, '/changelog')).toEqual([
      {
        links: [
          { route: '/changelog/v1-1-0', title: 'v1.1.0' },
          { route: '/changelog/v1-0-0', title: 'v1.0.0' },
        ],
      },
    ]);
  });
});

describe('pager', () => {
  test('walks the flattened sidebar of the page’s tab', () => {
    expect(pager(pages, '/docs/installation')).toEqual({
      prev: { route: '/docs', title: 'Introduction' },
      next: { route: '/docs/components/alert', title: 'Alert' },
    });
  });

  test('the first page has no previous, the last no next, and tabs do not leak', () => {
    expect(pager(pages, '/docs')).toEqual({ next: { route: '/docs/installation', title: 'Installation' } });
    expect(pager(pages, '/docs/components/button')).toEqual({
      prev: { route: '/docs/components/alert', title: 'Alert' },
    });
    expect(pager(pages, '/changelog/v1-0-0')).toEqual({ prev: { route: '/changelog/v1-1-0', title: 'v1.1.0' } });
  });
});

describe('eyebrow', () => {
  test('a page inside a group shows the group label; a guide shows none', () => {
    expect(eyebrow(pages, '/docs/components/button')).toBe('Components');
    expect(eyebrow(pages, '/docs/installation')).toBeUndefined();
    expect(eyebrow(pages, '/changelog/v1-0-0')).toBeUndefined();
  });
});
