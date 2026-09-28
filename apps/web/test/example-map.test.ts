import { describe, expect, test } from 'vitest';

import { renderExampleMap } from '../site/example-map.ts';

describe('renderExampleMap', () => {
  const source = renderExampleMap(['button-demo', 'charts/bar-demo']);

  test('is a client module', () => {
    expect(source.startsWith("'use client';\n")).toBe(true);
  });

  test('loads every Example through its own dynamic import, keyed by its <Component path>', () => {
    expect(source).toContain(`"button-demo": dynamic(() => import("@examples/button-demo")),`);
    expect(source).toContain(`"charts/bar-demo": dynamic(() => import("@examples/charts/bar-demo")),`);
    expect(source.match(/dynamic\(/gu)).toHaveLength(2);
  });

  test('imports no Example statically', () => {
    expect(source).not.toMatch(/^import .*@examples\//mu);
  });
});
