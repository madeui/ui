import { describe, expect, test } from 'vitest';

import { sitemap } from '../site/artifacts/sitemap.ts';

describe('sitemap.xml', () => {
  const xml = sitemap(['/docs', '/', '/docs/components/alert', '/changelog', '/docs/components/alert-dialog']);

  test('one <url><loc> line per page, no lastmod, sorted as whole lines', () => {
    // Plain string order of the lines: "-" and "/" sort before "<", so
    // alert-dialog precedes alert and /docs comes after everything under it.
    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        '  <url><loc>https://madeui.com/</loc></url>\n' +
        '  <url><loc>https://madeui.com/changelog</loc></url>\n' +
        '  <url><loc>https://madeui.com/docs/components/alert-dialog</loc></url>\n' +
        '  <url><loc>https://madeui.com/docs/components/alert</loc></url>\n' +
        '  <url><loc>https://madeui.com/docs</loc></url>\n' +
        '</urlset>\n',
    );
  });

  test('a route listed twice appears once', () => {
    expect(sitemap(['/docs', '/docs']).match(/<url>/gu)).toHaveLength(1);
  });
});
