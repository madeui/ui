---
version: 1
slug: "apps-docs-pages-index-astro"
primary_target: "apps/docs/pages/index.astro"
related_targets: ["apps/docs/landing/IndexPage.tsx"]
---

# Landing (apps/docs/pages/index.astro)

Scope: the marketing landing at `/`. Mode: Persuade. Related: `apps/docs/landing/**`.

Audience: React developers and their coding agents evaluating a component library. Job: understand in seconds what madeui is, see the real components working in real product screens, and run the install command or open the docs. Action: `npx @madeui/cli init` / Get started. Proof: live components inside four app scenes (Dashboard, Inbox, Settings, Team) built only from registry components; no screenshots, no invented claims (no users, customers, numbers).

Constraints from the maintainer: 9ui-style scene tabs instead of a flat component grid; custom StyleX header with Blume's real search dialog (⌘K) wired in; a wide footer that carries the logo lockup; GitHub and npm links only, X link left commented out; hero copy rewritten but product-true; nothing committed.

## Direction contract

THESIS: One product window, four real screens. The landing refuses the component-grid bento and the metric-hero template; the proof is an app frame the visitor can operate, with a "Show components" switch that labels every part with the madeui component it is and links to its docs.

OWN-WORLD: madeui's established monochrome world: ink-on-paper that flips per theme, Geist display at -0.04em, token-only spacing, hairline borders, rounded-xl frame, no hue accent. Recognizable with content removed by the four-square glyph, the pill controls, and the single large frame.

STORY: "Real components, in real screens, that I own down to the token" → believes styles cannot drift → runs `npx @madeui/cli init` or opens the docs.

FIRST VIEWPORT (1440x900): header 64px (lockup, Docs/Components/Changelog, search pill "Search docs… ⌘K", GitHub, theme). Centered hero: version pill, H1 two lines ≈60px, one-sentence sub, solid "Get started" + ghost "Browse components", install chip. The frame's top bar with the four scene tabs and the "Show components" switch is visible at ≈620px; the frame continues below the fold.

FORM: precisely specified by the brief; shaped directly, no concept roll (seed: none).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
