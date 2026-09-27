import { describe, expect, test } from 'vitest';

import { checkSearchIndex, searchIndex, type SearchIndex } from '../site/search-index.ts';
import { pages, sources } from './fixtures/content.ts';

describe('search index', () => {
  const index = searchIndex(sources);

  test('one record per page, sorted by route, with the section the sidebar shows it under', () => {
    expect(index.pages.map(({ route, title, description, section }) => ({ route, title, description, section }))).toEqual([
      { route: '/changelog/v1-0-0', title: 'v1.0.0', description: '', section: 'Changelog' },
      { route: '/changelog/v1-1-0', title: 'v1.1.0', description: '', section: 'Changelog' },
      { route: '/docs', title: 'Introduction', description: 'Components you own.', section: 'Docs' },
      { route: '/docs/components/button', title: 'Button', description: 'Displays a button …', section: 'Components' },
    ]);
  });

  test('content is the page body as plain text: code blocks and components dropped, inline code and component prose kept', () => {
    const button = index.pages.find((page) => page.route === '/docs/components/button');
    // A block component with no blank line after its opening tag parses as
    // one HTML node holding the first paragraph; the next paragraph follows
    // it without a space, as in today's index.
    expect(button?.content).toBe('Install Buttons submit forms by default.Set type="button" otherwise. Usage');
  });

  test('Popular is the first six sidebar pages', () => {
    expect(index.popular).toEqual([
      { route: '/changelog/v1-1-0', title: 'v1.1.0' },
      { route: '/changelog/v1-0-0', title: 'v1.0.0' },
      { route: '/docs', title: 'Introduction' },
      { route: '/docs/components/button', title: 'Button' },
    ]);
  });
});

describe('search index checks', () => {
  // A healthy index over the fixture: every record long enough.
  const long = 'Enough words to count as a real page body. '.repeat(4);
  const healthy: SearchIndex = {
    popular: [{ route: '/docs', title: 'Introduction' }],
    pages: pages.map((page) => ({ route: page.route, title: page.title, description: '', content: long, section: 'Docs' })),
  };

  test('a healthy index passes', () => {
    expect(checkSearchIndex(healthy, pages)).toEqual([]);
  });

  test('an empty index fails', () => {
    expect(checkSearchIndex({ popular: [], pages: [] }, [])).toContain('the index is empty');
  });

  test('a page count that differs from the route list fails', () => {
    const problems = checkSearchIndex({ ...healthy, pages: healthy.pages.slice(1) }, pages);
    expect(problems).toContain('3 records for 4 pages in the route list');
  });

  test('a record below the minimum body text fails', () => {
    const short = healthy.pages.map((page, i) => (i === 0 ? { ...page, content: 'Too short.' } : page));
    expect(checkSearchIndex({ ...healthy, pages: short }, pages)).toContain(
      '/changelog/v1-0-0: 10 characters of body text, fewer than 100',
    );
  });

  test('a duplicate link fails', () => {
    const duplicated = [...healthy.pages.slice(0, 3), { ...healthy.pages[0]! }];
    expect(checkSearchIndex({ ...healthy, pages: duplicated }, pages)).toContain('/changelog/v1-0-0 appears twice');
  });

  test('a Popular link without a page fails', () => {
    const popular = [...healthy.popular, { route: '/docs/gone', title: 'Gone' }];
    expect(checkSearchIndex({ ...healthy, popular }, pages)).toContain('Popular links to /docs/gone, which has no page');
  });
});
