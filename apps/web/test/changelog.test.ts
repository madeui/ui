import { describe, expect, test } from 'vitest';

import { llmsIndex } from '../site/artifacts/llms.ts';
import { rssFeed } from '../site/artifacts/rss.ts';
import { changelogEntries } from '../site/changelog.ts';
import { pager, sidebar } from '../site/nav.ts';
import type { ContentPage } from '../site/routes.ts';
import { pages } from './fixtures/content.ts';

// A new changelog .mdx is one more content page; nothing else changes. The
// entry below is dated between the fixture's two and listed last, so every
// output has to place it by its date.
const added: ContentPage = {
  route: '/changelog/sep-05-2026',
  file: 'changelog/sep-05-2026.mdx',
  title: 'Tabs & Toasts',
  date: new Date('2026-09-05'),
  category: 'Release',
};
const site = [...pages, added];
const isEntry = (page: ContentPage) => page.file.startsWith('changelog/');

describe('a new changelog entry, with no code change', () => {
  test('takes its place in the index, newest first', () => {
    expect(changelogEntries(site).map((entry) => entry.route)).toEqual([
      '/changelog/v1-1-0',
      '/changelog/sep-05-2026',
      '/changelog/v1-0-0',
    ]);
  });

  test('gets an RSS item between the two it was dated between', () => {
    const titles = [...rssFeed(site.filter(isEntry)).matchAll(/<title>(.+?)<\/title>/gu)].map((match) => match[1]);
    expect(titles).toEqual(['madeui — Changelog', 'v1.1.0', 'Tabs &amp; Toasts', 'v1.0.0']);
  });

  test('is listed in llms.txt under Changelog', () => {
    expect(llmsIndex(site)).toContain(
      '## Changelog\n\n' +
        '- [v1.1.0](https://madeui.com/changelog/v1-1-0)\n' +
        '- [Tabs & Toasts](https://madeui.com/changelog/sep-05-2026)\n' +
        '- [v1.0.0](https://madeui.com/changelog/v1-0-0)\n',
    );
  });

  test('joins the Changelog sidebar and prev/next', () => {
    expect(sidebar(site, '/changelog')[0]!.links.map((link) => link.title)).toEqual(['v1.1.0', 'Tabs & Toasts', 'v1.0.0']);
    expect(pager(site, added.route)).toEqual({
      prev: { route: '/changelog/v1-1-0', title: 'v1.1.0' },
      next: { route: '/changelog/v1-0-0', title: 'v1.0.0' },
    });
  });
});

describe('changelog index entries', () => {
  const [entry] = changelogEntries(site);

  test('each carries a heading id from its title, the long en date in UTC, and its category', () => {
    expect(changelogEntries(site).find((e) => e.route === added.route)).toEqual({
      route: '/changelog/sep-05-2026',
      title: 'Tabs & Toasts',
      id: 'tabs-toasts',
      date: 'September 5, 2026',
      category: 'Release',
    });
    expect(entry).toEqual({ route: '/changelog/v1-1-0', title: 'v1.1.0', id: 'v1-1-0', date: 'September 9, 2026' });
  });

  test('only changelog pages are entries', () => {
    expect(changelogEntries(site).every((e) => e.route.startsWith('/changelog/'))).toBe(true);
  });

  test('entries whose titles slug alike get -2, -3 so every id is unique', () => {
    const twice = [
      { ...added, route: '/changelog/a', file: 'changelog/a.mdx', title: 'Bug fixes', date: new Date('2026-09-03') },
      { ...added, route: '/changelog/b', file: 'changelog/b.mdx', title: 'Bug fixes', date: new Date('2026-09-02') },
      { ...added, route: '/changelog/c', file: 'changelog/c.mdx', title: 'Bug fixes!', date: new Date('2026-09-01') },
    ];
    expect(changelogEntries(twice).map((e) => e.id)).toEqual(['bug-fixes', 'bug-fixes-2', 'bug-fixes-3']);
  });
});
