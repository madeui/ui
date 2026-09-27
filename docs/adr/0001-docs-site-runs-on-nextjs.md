---
status: accepted
date: 2026-09-27
---

# The docs site runs on Next.js, not Blume

The docs site (madeui.com: landing, docs, changelog and the `/r/*.json`
registry endpoints) moves from Blume, an Astro-based docs framework, to a
Next.js App Router app at `apps/web`.

Blume served us well for content, but the library it documents is a StyleX
library, and every StyleX feature needed an Astro workaround: the Blume
config carried a Vite plugin injection, a CSS-chunk finder and a stylesheet
keeper just to get compiled styles onto every page. Blume's own chrome ships
Tailwind, which is the wrong thing for a StyleX library to put in front of
its users. And Next.js is the framework most of our users run, yet our own
site never exercised the setup `madeui init` writes for it; a separate
Next.js playground carried that smoke test, with a manual copy step after
every registry change.

`apps/web` is built with exactly the StyleX setup `init` writes for Next.js
(see [0002](./0002-official-stylex-babel-postcss-setup.md)), compiles the
registry source in place through aliases, and builds its chrome from our own
registry components and tokens. There is no Tailwind anywhere in the repo.

## What we keep, and what is ours

- **Content and URLs do not change.** The `.mdx` files and the
  `<Component path>` syntax stay as they are. Every Published URL keeps its
  bytes and semantics: the registry JSON, the Agent artifacts, the HTML
  routes.
- **fumadocs is a headless core, nothing more.** fumadocs-mdx (Config API)
  and fumadocs-core, both pinned to exact versions, handle MDX compilation,
  the Turbopack loader, frontmatter schemas, page loading and static params,
  the table of contents, structured data and Shiki. fumadocs' UI layer is not
  used: the chrome is ours.
- **Agent artifacts are our own code.** Navigation order, the Markdown
  mirrors (`.md` downleveled by a position splice over the source, `.mdx`
  verbatim), `llms.txt`, `llms-full.txt`, the sitemap, robots, the feed and
  `agent-readability.json` are small pure generators over the content. Byte
  parity with what agents already consume needs a splice, not a re-stringify,
  so no framework generator fits.
- **One route list** in navigation order is the single source for the
  sidebar, prev/next, llms, the sitemap, OG images and search.

## Consequences

- **Examples are client components, loaded per page.** A generated map of
  `next/dynamic` imports gives each Example its own chunk. Static imports are
  forbidden: with one catch-all docs route they put every demo on every page.
- **JavaScript cannot match an Astro page on light pages.** Next.js has a
  runtime floor of about 130 KB (brotli), so the JS budget is a per-page
  ceiling, checked in CI, not parity.
- **`next build` does not type-check** (it runs out of memory over the
  registry and MDX graph); a separate `tsc --noEmit` does.
- **The registry is smoke-tested by the site itself.** Registry source must
  compile and type-check in `apps/web` under `init`'s setup; the playground
  and its copy step go away.
- **fumadocs has a single maintainer and frequent majors.** The surface we
  use is small and pinned; if it has to go, `@next/mdx` replaces the loader
  side and our own code stays.
