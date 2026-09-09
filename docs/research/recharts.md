# Recharts (Chart)

Researched 2026-09-09 for the `chart` registry item. See ADR 0003. Supersedes
the engine choice recorded in [tanstack-charts.md](./tanstack-charts.md), which
is kept as history.

## Facts

- `recharts` 3.10.1, stable, MIT. Peers: React 16.8–19, `react-dom`,
  `react-is`. Runtime dependencies: `@reduxjs/toolkit`, `react-redux`,
  `reselect`, `immer`, `es-toolkit`, `victory-vendor` (the d3 modules),
  `decimal.js-light`, `eventemitter3`, `clsx`, `tiny-invariant`,
  `use-sync-external-store`.
- Composable element API: a chart element (`BarChart`, `LineChart`,
  `AreaChart`, `PieChart`, `RadarChart`, `RadialBarChart`, …) containing marks
  (`Bar`, `Line`, `Area`, `Pie`, `Radar`, `RadialBar`), guides
  (`CartesianGrid`, `XAxis`, `YAxis`, `PolarGrid`, `PolarAngleAxis`), and
  `Tooltip` / `Legend`. `ResponsiveContainer` measures the parent box.
- `Tooltip` and `Legend` take `content`. If `content` is an element it is
  rendered with `React.cloneElement(content, injectedProps)`; if a function, it
  is called as a component. Injected tooltip props: `active`, `payload`,
  `label`, `coordinate`, `activeIndex`, `accessibilityLayer`, plus the
  `Tooltip`'s own resolved props. Injected legend props: `payload`, plus the
  `Legend`'s resolved props (`verticalAlign` defaults to `bottom`). Props the
  caller did not set are absent from the clone, so props set on the content
  element itself survive. Source: `es6/component/Tooltip.js`,
  `es6/component/Legend.js` in 3.10.1.
- Tooltip payload entries expose `name`, `dataKey`, `value`, `color`, and
  `payload` (the datum). For a pie or a radial bar every slice comes from one
  series, so the discriminator lives in the datum under the mark's `nameKey`.
- `accessibilityLayer` on the chart element makes the plot focusable, walks the
  data with the arrow keys (moving the tooltip with focus), and announces
  points to assistive technology.
- Colors, dashes, and geometry are props on the marks and guides, taken as SVG
  presentation attributes. StyleX `defineVars` tokens compile to `var()`, which
  SVG paint resolves, so `stroke={colors.border}` and
  `tick={{ fill: colors.mutedForeground }}` theme correctly in light and dark.
  There is no CSS file to import.

## SSR: charts are client-only

Recharts holds chart layout in a Redux store that is populated from effects, so
a server render produces an empty `<svg>` and the plot appears only after
mount.

- [recharts#5997](https://github.com/recharts/recharts/issues/5997) — open ~15
  months. A maintainer: "recharts is a client side library … there is no plan"
  to add server rendering.
- Consequence we accepted: reserve the box with `aspect-ratio` so nothing
  shifts, state it on the docs page, and do not fork or work around it. No
  skeleton or placeholder — an empty reserved box is quieter than a shimmer
  that is replaced a frame later.

## Base UI charts

Not imminent. [base-ui#4779](https://github.com/mui/base-ui/issues/4779) and
[mui-x#22388](https://github.com/mui/mui-x/issues/22388) are placeholders with
no design or timeline; a maintainer's estimate on the thread is "could be
2030+". If they ship, they become an alternative engine rather than a
replacement, which is why our public surface is kept independent of Recharts'
own types.
