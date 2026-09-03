# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

React developers (Next.js and Vite apps) who want product UI they can read and
edit rather than a black-box package, and the AI coding agents that work in
those codebases alongside them. They evaluate madeui through the docs site and
adopt it through the CLI in a terminal.

## Product Purpose

madeui is an open-source UI library that follows the code-ownership model:
components are copied into the user's project as editable source. Every
component is built on Base UI (headless behavior and accessibility) and styled
with StyleX (compile-time, atomic CSS) bound to a typed design-token scale.
Success means a developer or agent can install a component in one command,
read its real source, and customize it without ever fighting specificity or
inventing one-off values.

## Positioning

The only copy-paste component library where the consumer owns the StyleX
styles too. Astryx (Meta) validates StyleX plus agent tooling but keeps
components centralized; madeui takes the opposite bet: owned source, owned
tokens, deterministic style merging, zero-runtime CSS. Distribution is both
its own CLI and a shadcn-compatible registry (mentioning that compatibility is
fine; never frame shadcn as the benchmark in public text).

## Operating Context

- Terminal: `npx @madeui/cli init` wires the StyleX build and copies tokens;
  `add` copies components; `npx shadcn@latest add @madeui/<name>` also works.
- Docs site (Blume, madeui.com): per-component pages with live previews,
  one focused example per feature, Base UI API links, changelog, search (⌘K),
  llms.txt for agents.
- Codebase: `components/ui/*.tsx` plus `lib/tokens.stylex.ts`,
  `lib/constants.stylex.ts`, `lib/themes.ts` in the consumer's project.

## Capabilities and Constraints

- 54 components (Button, Dialog, Combobox, Command, Drawer, Toast, Table,
  Tabs, Autocomplete, Meter, Number Field, Toolbar, Checkbox Group, ...).
  No chart, calendar, or date-picker component yet.
- Every component exposes `variant`, `size`, and a `style` prop merged last.
- Dark mode is one `stylex.createTheme`; themes are static objects.
- Landing and docs share theme state via the `blume-theme` localStorage key.
- Styling doctrine is binding: tokens over literals, variants over escape
  hatches, no raw colors or magic numbers in components or examples.
- Version 1.0.0 is the first release (2026).

## Brand Commitments

- Name: **madeui** (lowercase). Tagline in use: "Components, made yours."
- Monochrome identity: the accent is ink and flips per theme; no violet or
  other hue accent.
- Logo: a 2x2 arrangement of rounded squares, three solid and one dashed,
  tilted slot snapping into place; wordmark is Geist 700, outlined
  (`apps/docs/public/brand/*.svg`, `apps/docs/landing/brand.ts`).
- Typeface on marketing surfaces: Geist.
- Repo and all public text in English. Never phrase shadcn as a benchmark in
  public-facing text.
- Social: GitHub (github.com/madeui/ui) and npm (@madeui/cli) exist. An X
  account is planned but does not exist yet; leave its link commented out.

## Evidence on Hand

- The components themselves and 215 runnable examples in
  `packages/registry/examples/` are the proof; the landing shows them live.
- Changelog v1.0.0 (`apps/docs/content/changelog/v1-0-0.mdx`).
- Absent, do not fabricate: users, customers, testimonials, download counts,
  benchmarks, pricing.

## Product Principles

- Consistency is the API: identical prop conventions across every component
  so humans and agents can predict them.
- Constraints are the product: if a value is not on a scale it does not
  compile.
- Prove with the real thing: the landing renders actual components in real
  product scenes, never screenshots or mockups.
- Ownership over abstraction: the escape hatch is the source file, not a
  config surface.
