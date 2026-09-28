// The <head> every page carries: title, description, canonical, the Open
// Graph / Twitter set with the page's card (/og/<route>.png), the feed and
// Markdown alternates, and the JSON-LD graph. Pure: page facts in, Next.js
// Metadata and JSON-LD out. The pages call these from generateMetadata; the
// discovery links and the JSON-LD script render through <PageHead>.

import type { Metadata } from 'next';

import { absoluteUrl, changelogFeed, site } from './artifacts/site.ts';
import { markdownPath, ogImagePath } from './routes.ts';

/** What a page's head is built from. */
export interface HeadPage {
  /** Clean URL path: `/docs/components/button`. */
  route: string;
  /** The page title (the JSON-LD headline); `<title>` adds " - madeui". */
  title: string;
  /** Frontmatter description; the site's one-liner when absent. */
  description?: string;
  /** Changelog entries: publish date (the page becomes an article). */
  date?: Date;
  /** The page has a Markdown mirror at `<route>.md`. */
  markdown?: boolean;
}

/** The OG card: one per page, always 1200x630 PNG. */
export const OG_IMAGE = { width: 1200, height: 630, type: 'image/png' } as const;

/** `https://madeui.com` + route, without the home's trailing slash (JSON-LD ids). */
const pageUrl = (route: string) => `${site.url}${route === '/' ? '' : route}`;

/** Every page's head links to the agent-facing descriptions of the site. */
export const discoveryLinks = [
  { href: '/agent-readability.json', type: 'application/json' },
  { href: '/llms.txt', type: 'text/plain' },
] as const;

/** The changelog feed, advertised on every docs and changelog page. */
const feedAlternate = {
  'application/rss+xml': [{ url: changelogFeed.path, title: changelogFeed.title }],
};

function social({ route, title, description }: { route: string; title: string; description: string }) {
  const image = absoluteUrl(ogImagePath(route));
  return {
    openGraph: {
      siteName: site.name,
      title,
      description,
      url: absoluteUrl(route),
      images: [{ url: image, ...OG_IMAGE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
  };
}

export function pageMetadata(page: HeadPage): Metadata {
  const title = `${page.title} - ${site.name}`;
  const description = page.description ?? site.description;
  const { openGraph, twitter } = social({ route: page.route, title, description });
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(page.route),
      types: {
        ...feedAlternate,
        ...(page.markdown ? { 'text/markdown': markdownPath(page.route, 'md') } : {}),
      },
    },
    openGraph: page.date
      ? { type: 'article', ...openGraph, publishedTime: page.date.toISOString() }
      : { type: 'website', ...openGraph },
    twitter,
  };
}

const website = { '@id': `${site.url}#website`, '@type': 'WebSite', name: site.name, url: site.url } as const;

/** WebSite + TechArticle, the graph every docs and changelog page carries. */
export function pageJsonLd(page: HeadPage) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      {
        '@id': `${pageUrl(page.route)}#page`,
        '@type': 'TechArticle',
        headline: page.title,
        inLanguage: 'en',
        name: page.title,
        url: pageUrl(page.route),
        description: page.description ?? site.description,
        ...(page.date ? { datePublished: page.date.toISOString() } : {}),
        isPartOf: { '@id': website['@id'] },
      },
    ],
  };
}

/** The landing: its own title and pitch, and the site's card at /og/index.png. */
export const landing = {
  /** The hero headline (components/landing/index-page.tsx), without its period. */
  headline: 'UI you own, down to the token',
  title: 'madeui — UI you own, down to the token',
  description:
    'Base UI + StyleX components you own. Copied into your project as editable source, styled with compile-time tokens. Agent-friendly by design.',
} as const;

/** The changelog index (/changelog). It has no Markdown mirror. */
export const changelogIndex: HeadPage = {
  route: '/changelog',
  title: 'Changelog',
  description: 'Product updates, new features, and fixes from every release.',
};

export function landingMetadata(): Metadata {
  const { openGraph, twitter } = social({ route: '/', title: landing.title, description: landing.description });
  return {
    title: { absolute: landing.title },
    description: landing.description,
    alternates: { canonical: absoluteUrl('/') },
    openGraph: { type: 'website', ...openGraph },
    twitter,
  };
}

/** The landing's graph: the WebSite node every page shares, and the landing as its home WebPage. */
export function landingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      {
        '@id': `${absoluteUrl('/')}#page`,
        '@type': 'WebPage',
        name: landing.title,
        inLanguage: 'en',
        url: absoluteUrl('/'),
        description: landing.description,
        isPartOf: { '@id': website['@id'] },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl(ogImagePath('/')),
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
        },
      },
    ],
  } as const;
}

/**
 * The 404 page: a text-only summary card. Next.js adds the noindex robots tag
 * to every 404 response itself; declaring it here would print it twice.
 */
export const notFoundMetadata: Metadata = {
  title: { absolute: 'Page not found' },
  description: site.description,
  openGraph: { type: 'website', siteName: site.name, title: 'Page not found', description: site.description },
  twitter: { card: 'summary', title: 'Page not found', description: site.description },
};

/**
 * JSON-LD as a script body: `<` escaped, so no string in the data can close
 * the script element.
 */
export const jsonLdScript = (data: object) => JSON.stringify(data).replace(/</gu, '\\u003c');
