import { describe, expect, test } from 'vitest';

import { landingJsonLd, landingMetadata, notFoundMetadata, pageJsonLd, pageMetadata } from '../site/head.ts';

// Expected values are the head the site has always served (on
// /docs/components/button, /changelog/v1-1-0 and /changelog), written out.

const SITE_DESCRIPTION = 'Base UI + StyleX components you own. Agent-friendly by design.';

describe('page head', () => {
  const button = {
    route: '/docs/components/button',
    title: 'Button',
    description: 'Displays a button or a component that looks like a button. Built on Base UI, styled with StyleX.',
    markdown: true,
  };

  test('a docs page: "<title> - madeui", canonical, the OG/Twitter set with the 1200x630 card, feed and .md alternates', () => {
    expect(pageMetadata(button)).toEqual({
      title: { absolute: 'Button - madeui' },
      description: button.description,
      alternates: {
        canonical: 'https://madeui.com/docs/components/button',
        types: {
          'application/rss+xml': [{ url: '/changelog/rss.xml', title: 'madeui — Changelog' }],
          'text/markdown': '/docs/components/button.md',
        },
      },
      openGraph: {
        type: 'website',
        siteName: 'madeui',
        title: 'Button - madeui',
        description: button.description,
        url: 'https://madeui.com/docs/components/button',
        images: [
          {
            url: 'https://madeui.com/og/docs/components/button.png',
            type: 'image/png',
            width: 1200,
            height: 630,
            alt: 'Button - madeui',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Button - madeui',
        description: button.description,
        images: [{ url: 'https://madeui.com/og/docs/components/button.png', alt: 'Button - madeui' }],
      },
    });
  });

  test('a docs page: JSON-LD WebSite + TechArticle', () => {
    expect(JSON.stringify(pageJsonLd(button))).toBe(
      '{"@context":"https://schema.org","@graph":[{"@id":"https://madeui.com#website","@type":"WebSite","name":"madeui","url":"https://madeui.com"},{"@id":"https://madeui.com/docs/components/button#page","@type":"TechArticle","headline":"Button","inLanguage":"en","name":"Button","url":"https://madeui.com/docs/components/button","description":"Displays a button or a component that looks like a button. Built on Base UI, styled with StyleX.","isPartOf":{"@id":"https://madeui.com#website"}}]}',
    );
  });

  const entry = { route: '/changelog/v1-1-0', title: 'v1.1.0', date: new Date('2026-09-09'), markdown: true };

  test('a changelog entry: an article with its publish date; no description falls back to the site one', () => {
    const head = pageMetadata(entry);
    expect(head.description).toBe(SITE_DESCRIPTION);
    expect(head.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-09-09T00:00:00.000Z',
      title: 'v1.1.0 - madeui',
      description: SITE_DESCRIPTION,
    });
    expect(JSON.stringify(pageJsonLd(entry))).toBe(
      '{"@context":"https://schema.org","@graph":[{"@id":"https://madeui.com#website","@type":"WebSite","name":"madeui","url":"https://madeui.com"},{"@id":"https://madeui.com/changelog/v1-1-0#page","@type":"TechArticle","headline":"v1.1.0","inLanguage":"en","name":"v1.1.0","url":"https://madeui.com/changelog/v1-1-0","description":"Base UI + StyleX components you own. Agent-friendly by design.","datePublished":"2026-09-09T00:00:00.000Z","isPartOf":{"@id":"https://madeui.com#website"}}]}',
    );
  });

  test('the changelog index has no Markdown mirror, so no .md alternate', () => {
    const head = pageMetadata({ route: '/changelog', title: 'Changelog', description: 'Product updates.' });
    expect(head.alternates?.types).toEqual({
      'application/rss+xml': [{ url: '/changelog/rss.xml', title: 'madeui — Changelog' }],
    });
    expect(head.openGraph).toMatchObject({ images: [expect.objectContaining({ url: 'https://madeui.com/og/changelog.png' })] });
  });
});

describe('landing head', () => {
  test('keeps its own title and description, and gains canonical + OG/Twitter pointing at /og/index.png', () => {
    const head = landingMetadata();
    expect(head.title).toEqual({ absolute: 'madeui — UI you own, down to the token' });
    expect(head.alternates).toEqual({ canonical: 'https://madeui.com/' });
    expect(head.openGraph).toMatchObject({
      type: 'website',
      url: 'https://madeui.com/',
      title: 'madeui — UI you own, down to the token',
      images: [{ url: 'https://madeui.com/og/index.png', type: 'image/png', width: 1200, height: 630 }],
    });
    expect(head.twitter).toMatchObject({ card: 'summary_large_image', images: [{ url: 'https://madeui.com/og/index.png' }] });
  });

  test('JSON-LD: the same WebSite node as every page, and the landing as its WebPage with the card as image', () => {
    const [website, page] = landingJsonLd()['@graph'];
    expect(website).toEqual({ '@id': 'https://madeui.com#website', '@type': 'WebSite', name: 'madeui', url: 'https://madeui.com' });
    expect(page).toMatchObject({
      '@id': 'https://madeui.com/#page',
      '@type': 'WebPage',
      url: 'https://madeui.com/',
      isPartOf: { '@id': 'https://madeui.com#website' },
      primaryImageOfPage: { '@type': 'ImageObject', url: 'https://madeui.com/og/index.png', width: 1200, height: 630 },
    });
  });
});

test('404: a summary card, no canonical, no image and no robots of its own (Next.js adds noindex)', () => {
  expect(notFoundMetadata).toEqual({
    title: { absolute: 'Page not found' },
    description: SITE_DESCRIPTION,
    openGraph: { type: 'website', siteName: 'madeui', title: 'Page not found', description: SITE_DESCRIPTION },
    twitter: { card: 'summary', title: 'Page not found', description: SITE_DESCRIPTION },
  });
});
