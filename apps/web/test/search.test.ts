import { describe, expect, test } from 'vitest';

import { createSearch, excerptFor, highlight, matchSnippet } from '../site/search.ts';
import type { SearchPage } from '../site/search-index.ts';

const page = (route: string, title: string, content: string, section = 'Components', description = ''): SearchPage => ({
  route,
  title,
  description,
  content,
  section,
});

const pages: SearchPage[] = [
  page('/docs/components/combobox', 'Combobox', 'An input combined with a list of options.'),
  page('/docs/components/dialog', 'Dialog', 'A window overlaid on the page. Focus is trapped inside.'),
  page('/docs/components/sheet', 'Sheet', 'Extends the dialog to slide in from an edge of the screen.'),
  page('/docs/dark-mode', 'Dark mode', 'Tokens switch with color-scheme on the page.', 'Docs', 'Light and dark themes.'),
  page('/changelog/v1-0-0', 'v1.0.0', 'The first release, with a dialog and a sheet.', 'Changelog'),
];

describe('search', () => {
  const search = createSearch(pages);

  test('a title match outranks a mention in the body', () => {
    expect(search('dialog').hits.map((hit) => hit.route)).toEqual([
      '/docs/components/dialog',
      // Both mention it once; the shorter body ranks higher.
      '/changelog/v1-0-0',
      '/docs/components/sheet',
    ]);
  });

  test('prefixes match, typos do not', () => {
    expect(search('comb').hits.map((hit) => hit.route)).toEqual(['/docs/components/combobox']);
    expect(search('dialgo').hits).toEqual([]);
  });

  test('any query word matches', () => {
    expect(search('combobox sheet').hits.map((hit) => hit.route).sort()).toEqual([
      '/changelog/v1-0-0',
      '/docs/components/combobox',
      '/docs/components/sheet',
    ]);
  });

  test('sections are counted over every match, in rank order; a section filter narrows the hits only', () => {
    const all = search('dialog');
    expect(all.sections).toEqual([
      { label: 'Components', count: 2 },
      { label: 'Changelog', count: 1 },
    ]);
    const changelog = search('dialog', 'Changelog');
    expect(changelog.hits.map((hit) => hit.route)).toEqual(['/changelog/v1-0-0']);
    expect(changelog.sections).toEqual(all.sections);
  });

  test('at most 12 hits show, sections count the first 48 matches', () => {
    const many = Array.from({ length: 60 }, (_, i) =>
      page(`/docs/components/c${String(i).padStart(2, '0')}`, `Item ${i}`, 'Shared words in every page.', i < 50 ? 'Components' : 'Docs'),
    );
    const result = createSearch(many)('shared');
    expect(result.hits).toHaveLength(12);
    expect(result.sections.reduce((sum, section) => sum + section.count, 0)).toBe(48);
  });

  test('a hit carries its excerpt and its content for the preview', () => {
    const [hit] = search('trapped').hits;
    expect(hit).toEqual({
      route: '/docs/components/dialog',
      title: 'Dialog',
      section: 'Components',
      excerpt: 'A window overlaid on the page. Focus is trapped inside.',
      content: 'A window overlaid on the page. Focus is trapped inside.',
    });
  });
});

describe('excerpts', () => {
  const long = `${'Lorem ipsum dolor sit amet. '.repeat(10)}The needle sits here. ${'Consectetur adipiscing elit. '.repeat(10)}`;

  test('a window around the first match, a third of it before the match, ellipses where cut', () => {
    const snippet = matchSnippet(long, 'needle', 60);
    expect(snippet).toBe('…dolor sit amet. The needle sits here. Consectetur adipiscing…');
  });

  test('without a match: the head of the text', () => {
    expect(matchSnippet('Short text.', 'absent', 60)).toBe('Short text.');
    expect(matchSnippet(long, 'absent', 20)).toBe('Lorem ipsum dolor si…');
  });

  test('the body when it matches, else the description, else the head of the body', () => {
    expect(excerptFor('A description.', 'Body with the needle.', 'needle')).toBe('Body with the needle.');
    expect(excerptFor('A description.', 'Body text.', 'needle')).toBe('A description.');
    expect(excerptFor('', 'x'.repeat(150), 'needle')).toBe(`${'x'.repeat(140)}…`);
  });
});

describe('highlight', () => {
  test('marks every occurrence of each query word, case-insensitively', () => {
    expect(highlight('Dark mode and dark themes', 'dark MODE')).toEqual([
      { text: '', mark: false },
      { text: 'Dark', mark: true },
      { text: ' ', mark: false },
      { text: 'mode', mark: true },
      { text: ' and ', mark: false },
      { text: 'dark', mark: true },
      { text: ' themes', mark: false },
    ]);
  });

  test('regex characters in the query are literal', () => {
    expect(highlight('next.js and nextXjs', 'next.js')).toEqual([
      { text: '', mark: false },
      { text: 'next.js', mark: true },
      { text: ' and nextXjs', mark: false },
    ]);
  });

  test('an empty query marks nothing', () => {
    expect(highlight('Text', '  ')).toEqual([{ text: 'Text', mark: false }]);
  });
});
