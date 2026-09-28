import { describe, expect, test } from 'vitest';

import { closestRoutes, suggestions } from '../site/not-found.ts';

// A slice of the real route list: the guides, a few components with short,
// similar names, and the changelog.
const routes = [
  { route: '/docs', title: 'Introduction' },
  { route: '/docs/installation', title: 'Installation' },
  { route: '/docs/customization', title: 'Customization' },
  { route: '/docs/dark-mode', title: 'Dark mode' },
  { route: '/docs/cli', title: 'CLI' },
  { route: '/docs/agents', title: 'For AI agents' },
  { route: '/docs/components/badge', title: 'Badge' },
  { route: '/docs/components/button', title: 'Button' },
  { route: '/docs/components/button-group', title: 'Button Group' },
  { route: '/docs/components/meter', title: 'Meter' },
  { route: '/docs/components/menubar', title: 'Menubar' },
  { route: '/docs/components/table', title: 'Table' },
  { route: '/docs/components/tabs', title: 'Tabs' },
  { route: '/changelog', title: 'Changelog' },
  { route: '/changelog/v1-0-0', title: 'v1.0.0' },
];

const found = (path: string) => closestRoutes(path, routes).map((ref) => ref.route);

describe('closestRoutes', () => {
  test('a typo in a component address finds the component, and only close neighbours', () => {
    const matches = found('/docs/componets/buton');
    expect(matches[0]).toBe('/docs/components/button');
    expect(matches).not.toContain('/docs/components/badge');
    expect(matches).not.toContain('/docs/components/meter');
  });

  test('a guide under an old folder finds the guide where it lives now', () => {
    expect(found('/docs/guides/dark-mode')).toEqual(['/docs/dark-mode']);
  });

  test('gibberish matches nothing', () => {
    expect(found('/qzxv-wmpt')).toEqual([]);
    expect(found('/docs/components/zzzzzz')).toEqual([]);
  });

  test('the root has no name to match, so nothing is suggested', () => {
    expect(found('/')).toEqual([]);
  });

  test('a page address with a file extension or in capitals finds the page', () => {
    expect(found('/docs/installation.html')).toEqual(['/docs/installation']);
    expect(found('/docs/components/Button.md')[0]).toBe('/docs/components/button');
  });
});

describe('suggestions', () => {
  const routesOf = (refs: { route: string }[]) => refs.map((ref) => ref.route);

  test('the best match is the "Did you mean"; it is not listed again among the others', () => {
    const { best, others } = suggestions('/docs/componets/buton', routes);
    expect(best?.route).toBe('/docs/components/button');
    expect(routesOf(others)).toEqual([]);
  });

  test('other close matches follow the best one', () => {
    const { best, others } = suggestions('/docs/components/tabl', routes);
    expect(best?.route).toBe('/docs/components/table');
    expect(routesOf(others)).toEqual(['/docs/components/tabs']);
  });

  test('nothing close: no best match and no others', () => {
    expect(suggestions('/qzxv-wmpt', routes)).toEqual({ best: undefined, others: [] });
  });
});
