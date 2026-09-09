---
status: accepted
date: 2026-09-09
supersedes: 0002-tanstack-charts-pinned-alpha.md
---

# Chart builds on Recharts, and is client-only

Chart's engine moves from `@tanstack/charts@0.16.0` to `recharts@^3`. The pinned
alpha in [0002](./0002-tanstack-charts-pinned-alpha.md) was a bet that the churn
would settle; it did not, and pinning an alpha is a standing tax on a component
users own the source of. Recharts is stable, has a large installed base, and its
composable element API (`<BarChart><Bar/><XAxis/></BarChart>`) is the shape this
component already exposes.

Our surface is a `ChartConfig` object keyed by series, a `ChartContainer` that
provides it through context, tooltip and legend bodies that read labels and
colors out of it, and `useChart()`. Recharts' own elements are composed
directly and are not wrapped, so the library's API is the API and an upgrade is
a plain dependency bump.

Series colors live in the config and are read back where the mark is declared
(`fill={chartConfig.revenue.color}`) rather than being pushed into per-series
CSS custom properties. StyleX needs custom-property names to be literal at
compile time, so a generated `--color-<key>` per series is not expressible; the
config reference is, it needs no injected stylesheet or inline `style`
attribute, and it keeps one value feeding the plot, the tooltip, and the legend.

## Consequences

- **Charts render in the browser.** Recharts holds its layout in a Redux store
  populated from an effect, so server rendering yields an empty `<svg>`
  ([recharts#5997](https://github.com/recharts/recharts/issues/5997), open, with
  no plan to change). `ChartContainer` reserves the box with `aspect-ratio` so
  the page does not shift; the docs page states it plainly. We do not fork or
  work around it.
- Chart files need `'use client'` in the App Router.
- The TanStack-specific exports are gone: `chartTheme`, `chartAxis`,
  `chartGridAxis`, `chartCurve`, and the `renderSvg` surface that restyled the
  scene. Axis and grid presentation is now props on Recharts' own guides, with
  tokens passed as SVG paint.
- Base UI has no charts and no near-term plan for them
  ([base-ui#4779](https://github.com/mui/base-ui/issues/4779),
  [mui-x#22388](https://github.com/mui/mui-x/issues/22388)). If they ship, they
  can be added as an alternative; the public surface here is designed to stay
  put across that change.
