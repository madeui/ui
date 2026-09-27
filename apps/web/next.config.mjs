import path from 'node:path';

import { createMDX } from 'fumadocs-mdx/next';

// ESM: createMDX() needs it. babel.config.js stays CommonJS, as init writes it.
const root = process.cwd();

// The Showcase (app/showcase/page.showcase.tsx) is a page only in dev and in
// SHOWCASE=1 builds: its page extension is registered nowhere else, so the
// production build never compiles it and /showcase is a 404 there. A
// SHOWCASE=1 build goes to its own dist dir (the local VRT's), leaving the
// production build in .next untouched; `SHOWCASE=1 next start` serves it.
const showcaseBuild = process.env.SHOWCASE === '1';
const showcase = showcaseBuild || process.env.NODE_ENV !== 'production';

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
    // The registry source and the docs content live outside this app.
    root: path.resolve(root, '../..'),
  },
  async rewrites() {
    return {
      // Before the filesystem, in order: a direct request for the internal
      // mirror path goes nowhere (404), then `/<route>.md` and `.mdx` reach the
      // Markdown mirror handler (app/markdown-mirror). Rewrites run in one
      // pass, so the first rule never sees what the second one produces.
      beforeFiles: [
        { source: '/markdown-mirror/:path*', destination: '/_not-found' },
        { source: '/:route(.+)\\.:format(md|mdx)', destination: '/markdown-mirror/:format/:route' },
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
      {
        source: '/:path(.+\\.mdx?)',
        headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }],
      },
      {
        source: '/:path(.+\\.txt)',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default createMDX()(config);
