---
status: accepted
date: 2026-09-27
---

# Official StyleX Babel + PostCSS setup over the faster community compiler

The docs site (`apps/web`) compiles StyleX with the setup `madeui init`
writes for Next.js: `babel.config.js` with `@stylexjs/babel-plugin`,
`postcss.config.mjs` with `@stylexjs/postcss-plugin`, and the `@stylex`
marker after `@layer base` in the global stylesheet. It is the only setup
StyleX documents for Next.js, and it works under Turbopack in dev and build.
The site's copy differs only where it must: its aliases and PostCSS globs
point at the registry source it compiles in place.

We measured the alternative: the community Rust compiler (`@stylexswc`), as
a Turbopack loader plus its PostCSS plugin. It is clearly faster. On a copy
of the playground, cold first-page compile dropped 44% (7.9 s → 4.5 s) and
the `next build` compile step 40% (7.2 s → 4.3 s); on a spike of the docs
site, cold dev start went from 12.6 s to 7.5 s and the build from 12.9 s to
9.7 s. The emitted CSS and JS were equivalent (byte-identical on the
playground), so runtime performance is the same either way.

We keep the official setup anyway:

- **The site dogfoods what users run.** Its purpose includes proving that
  `init`'s Next.js setup works on a real app with the whole registry. A
  different compiler would prove something users don't have.
- **Dependency risk.** The community compiler has one maintainer, is not
  maintained by the StyleX team, needs pnpm build-script approval for
  `@swc/core`, and its loader wiring only works with Turbopack.
- **Both setups already beat the old site.** Dev start, HMR and build times
  with the official setup are all faster than Blume's, so the speed-up is
  not needed to meet the site's budget.

## Consequences

- `init` stays as it is. Switching `init` (and then the site) to a faster
  compiler is a separate CLI decision, not part of the site.
- The known cost is dev speed: Babel also runs over every compiled MDX
  module, and the first component edit after a warm restart can take a few
  seconds.
- If the official project ships a Turbopack integration, or the measured gap
  starts to matter to users, this decision is reopened for `init` first.
