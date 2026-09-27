import { describe, expect, test } from 'vitest';

import { navGroups, publishedInventory, routeList, type ContentPage } from '../site/routes.ts';

// A small content tree in the shape of apps/docs/content: loose guides with a
// sidebar order, a components folder without one, and dated changelog entries.
const fixture: ContentPage[] = [
  { route: '/docs/components/button-group', file: 'docs/components/button-group.mdx', title: 'Button Group' },
  { route: '/docs/installation', file: 'docs/installation.mdx', title: 'Installation', description: 'Set it up.', order: 1 },
  { route: '/changelog/v1-0-0', file: 'changelog/v1-0-0.mdx', title: 'v1.0.0', date: new Date('2026-09-02') },
  { route: '/docs/components/button', file: 'docs/components/button.mdx', title: 'Button', badge: 'New' },
  { route: '/docs', file: 'docs/index.mdx', title: 'Introduction', order: 0 },
  { route: '/changelog/sep-27-2026', file: 'changelog/sep-27-2026.mdx', title: 'Dark mode', date: new Date('2026-09-27') },
  { route: '/docs/components/alert-dialog', file: 'docs/components/alert-dialog.mdx', title: 'Alert Dialog' },
  { route: '/docs/agents', file: 'docs/agents.mdx', title: 'For AI agents', order: 5 },
  { route: '/docs/components/alert', file: 'docs/components/alert.mdx', title: 'Alert' },
  { route: '/changelog/v1-1-0', file: 'changelog/v1-1-0.mdx', title: 'v1.1.0', date: new Date('2026-09-09') },
];

const routesOf = (pages: ContentPage[]) => pages.map((page) => page.route);

describe('navGroups', () => {
  test('groups pages by content folder, in sidebar order', () => {
    const groups = navGroups(fixture);
    expect(groups.map((group) => [group.label, group.depth])).toEqual([
      ['Changelog', 2],
      ['Docs', 2],
      ['Components', 3],
    ]);
    const [changelog, docs, components] = groups;
    // Changelog newest first.
    expect(routesOf(changelog!.pages)).toEqual(['/changelog/sep-27-2026', '/changelog/v1-1-0', '/changelog/v1-0-0']);
    // Guides by sidebar.order.
    expect(routesOf(docs!.pages)).toEqual(['/docs', '/docs/installation', '/docs/agents']);
    // No order: alphabetical by title ("Alert" before "Alert Dialog").
    expect(routesOf(components!.pages)).toEqual([
      '/docs/components/alert',
      '/docs/components/alert-dialog',
      '/docs/components/button',
      '/docs/components/button-group',
    ]);
  });
});

describe('publishedInventory', () => {
  const pages = fixture.filter((page) =>
    ['/docs', '/docs/components/button', '/changelog/v1-0-0'].includes(page.route),
  );
  const inventory = publishedInventory(pages);

  test('HTML pages: the landing, the changelog index and every content page', () => {
    expect(inventory.html.toSorted()).toEqual(
      ['/', '/changelog', '/changelog/v1-0-0', '/docs', '/docs/components/button'].toSorted(),
    );
  });

  test('Markdown mirrors: .md and .mdx per content page, plus the synthesized /index', () => {
    expect(inventory.markdown.toSorted()).toEqual(
      [
        '/index.md',
        '/index.mdx',
        '/docs.md',
        '/docs.mdx',
        '/docs/components/button.md',
        '/docs/components/button.mdx',
        '/changelog/v1-0-0.md',
        '/changelog/v1-0-0.mdx',
      ].toSorted(),
    );
  });

  test('text artifacts at their fixed URLs', () => {
    expect(inventory.artifacts.toSorted()).toEqual(
      ['/llms.txt', '/llms-full.txt', '/agent-readability.json', '/robots.txt', '/sitemap.xml', '/changelog/rss.xml'].toSorted(),
    );
  });

  test('one OG image per HTML page, the landing at /og/index.png', () => {
    expect(inventory.og.toSorted()).toEqual(
      [
        '/og/index.png',
        '/og/changelog.png',
        '/og/changelog/v1-0-0.png',
        '/og/docs.png',
        '/og/docs/components/button.png',
      ].toSorted(),
    );
  });
});

describe('routeList', () => {
  test('lists every page once, in the order the sidebar reads', () => {
    expect(routesOf(routeList(fixture))).toEqual([
      '/changelog/sep-27-2026',
      '/changelog/v1-1-0',
      '/changelog/v1-0-0',
      '/docs',
      '/docs/installation',
      '/docs/agents',
      '/docs/components/alert',
      '/docs/components/alert-dialog',
      '/docs/components/button',
      '/docs/components/button-group',
    ]);
  });
});
