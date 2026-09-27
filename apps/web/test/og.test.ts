import { describe, expect, test } from 'vitest';

import { ogCards, ogParams } from '../site/og.ts';
import { publishedInventory } from '../site/routes.ts';
import { pages } from './fixtures/content.ts';

describe('OG cards', () => {
  const withCategory = pages.map((page) =>
    page.route === '/changelog/v1-1-0' ? { ...page, category: 'Release' } : page,
  );
  const cards = ogCards(withCategory);

  test('one card per HTML page, at /og/<route>.png (the landing at /og/index.png)', () => {
    expect([...cards.keys()].sort()).toEqual(publishedInventory(pages).og.sort());
    expect(cards.has('/og/index.png')).toBe(true);
    expect(cards.has('/og/changelog.png')).toBe(true);
  });

  test('prerendered as catch-all params; the route segments end in the .png file', () => {
    expect(ogParams(withCategory)).toContainEqual({ slug: ['docs', 'components', 'button.png'] });
    expect(ogParams(withCategory)).toContainEqual({ slug: ['index.png'] });
  });

  test('a component page: its title, description and URL, and the command that installs it', () => {
    expect(cards.get('/og/docs/components/button.png')).toEqual({
      title: 'Button',
      description: 'Displays a button …',
      url: 'madeui.com/docs/components/button',
      footer: { kind: 'command', text: 'npx @madeui/cli add button' },
    });
  });

  test('a guide: the init command', () => {
    expect(cards.get('/og/docs.png')?.footer).toEqual({ kind: 'command', text: 'npx @madeui/cli init' });
  });

  test('a changelog entry: category and publish date instead of a description', () => {
    expect(cards.get('/og/changelog/v1-1-0.png')).toEqual({
      title: 'v1.1.0',
      url: 'madeui.com/changelog/v1-1-0',
      footer: { kind: 'meta', text: 'Release · September 9, 2026' },
    });
    expect(cards.get('/og/changelog/v1-0-0.png')?.footer).toEqual({ kind: 'meta', text: 'September 2, 2026' });
  });

  test('the landing: its headline, as a statement', () => {
    expect(cards.get('/og/index.png')).toMatchObject({ title: 'UI you own, down to the token', statement: true, url: 'madeui.com' });
  });
});
