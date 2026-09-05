---
status: accepted
date: 2026-09-05
---

# Chart builds on TanStack Charts, pinned to an exact alpha version

TanStack Charts (`@tanstack/charts`) is pre-1.0 and allows breaking changes in
minor releases (16 minors in its first four weeks). We still chose it over
Recharts: it ships no CSS, themes through CSS custom properties and
`currentColor`, renders accessible SVG with SSR support, and has no Redux-style
runtime. To contain the churn the registry item pins the exact version
(`@tanstack/charts@0.16.0`), the docs page carries an alpha notice, and our
surface stays thin: a theme bridge (`ChartContainer`), a tooltip body, and an
HTML legend. The library's `Chart` and `defineChart` are used directly, so a
library upgrade is a deliberate bump of the pin plus a docs changelog entry.

## Consequences

- Users who raise the pin themselves may hit breaking changes; the docs say so.
- Requires React 19, which the library already requires.
