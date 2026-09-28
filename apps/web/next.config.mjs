import path from 'node:path';

import { createMDX } from 'fumadocs-mdx/next';

import { ACCEPTS_MARKDOWN } from './site/negotiation.mjs';

// ESM: createMDX() needs it. babel.config.js stays CommonJS, as init writes it.
const root = process.cwd();

// The Showcase (app/showcase/page.showcase.tsx) is a page only in dev and in
// SHOWCASE=1 builds: its page extension is registered nowhere else, so the
// production build never compiles it and /showcase is a 404 there. A
// SHOWCASE=1 build goes to its own dist dir (the local VRT's), leaving the
// production build in .next untouched; `SHOWCASE=1 next start` serves it.
const showcaseBuild = process.env.SHOWCASE === '1';
const showcase = showcaseBuild || process.env.NODE_ENV !== 'production';

// Markdown content negotiation: a page URL requested with an `Accept` header
// that lists `text/markdown` (or `text/x-markdown`, without q=0) gets the
// page's Markdown mirror at the same address. The pattern and its rules:
// site/negotiation.mjs.
const acceptsMarkdown = [{ type: 'header', key: 'accept', value: ACCEPTS_MARKDOWN }];
// The page URLs that have a mirror, without the landing (its mirror is
// `/index.md`): `/docs`, every docs page and every changelog entry. The
// changelog index has no mirror and always serves HTML. No dots, so file
// URLs (`.md`, `.json`, `.xml`, …) are never negotiated.
const mirroredPage = '/:route(docs|docs/[^.]+|changelog/[^/.]+)';
// Both representations vary by `Accept`, so shared caches keep them apart.
// `next start` (16.3) replaces a configured Vary on App Router pages with its
// own (vercel/next.js#85999), so locally only the Markdown side carries it.
const varyAccept = [{ key: 'Vary', value: 'Accept' }];

/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: false,
  // fumadocs-mdx's default page extensions, plus the Showcase's when it is on.
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts', ...(showcase ? ['showcase.tsx'] : [])],
  ...(showcaseBuild && { distDir: '.next-vrt' }),
  // The type-check step inside `next build` runs out of memory over the
  // registry + MDX graph; `pnpm --filter @madeui/web typecheck` runs tsc on
  // its own instead.
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    // The registry source lives outside this app.
    root: path.resolve(root, '../..'),
  },
  async rewrites() {
    return {
      // Before the filesystem, in order: a direct request for the internal
      // mirror path goes nowhere (404), then `/<route>.md` and `.mdx` reach the
      // Markdown mirror handler (app/markdown-mirror), then a page URL that
      // negotiates Markdown reaches the same handler as its `.md`. Rewrites
      // run in one pass, so the first rule never sees what the later ones
      // produce.
      beforeFiles: [
        { source: '/markdown-mirror/:path*', destination: '/_not-found' },
        { source: '/:route(.+)\\.:format(md|mdx)', destination: '/markdown-mirror/:format/:route' },
        { source: '/', has: acceptsMarkdown, destination: '/markdown-mirror/md/index' },
        { source: mirroredPage, has: acceptsMarkdown, destination: '/markdown-mirror/md/:route' },
      ],
    };
  },
  async headers() {
    return [
      // Agents and registry tools fetch cross-origin: every response allows it.
      {
        source: '/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      // Registry endpoints (public/r, copied from packages/registry/public/r
      // before dev and build): the contract the madeui CLI relies on.
      {
        source: '/r/:file(.+\\.json)',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      // The negotiated page URLs, HTML and Markdown alike.
      { source: '/', headers: varyAccept },
      { source: mirroredPage, headers: varyAccept },
      // Agent discovery on the landing: the site manifest, the llms.txt index
      // and the landing's Markdown mirror (RFC 8288 registered relations).
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</agent-readability.json>; rel="describedby"; type="application/json"',
              '</llms.txt>; rel="describedby"; type="text/plain"',
              '</index.md>; rel="alternate"; type="text/markdown"',
            ].join(', '),
          },
        ],
      },
      // Markdown mirrors and the .txt artifacts need no rule here: their route
      // handlers set their own Content-Type, and a path rule would also label
      // the HTML 404 page under those extensions.
    ];
  },
};

export default createMDX()(config);
