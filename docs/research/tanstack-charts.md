# TanStack Charts (Chart)

Researched 2026-09-05 for the `chart` registry item. See ADR 0002.

## Facts

- `@tanstack/charts` 0.16.0 (2026-08-26). First publish 2026-07-29; 30
  publishes and 16 minor bumps in four weeks. Alpha: minors may break while the
  major is 0; the docs recommend exact pins. Sources:
  https://tanstack.com/charts/latest/docs/stability,
  https://github.com/TanStack/charts
- React adapter: `import { Chart } from '@tanstack/charts/react'`; the
  `/react/tooltip` entry adds `renderTooltipBody`. Peer React 19 only. The old
  `react-charts` package is unmaintained (last publish 2023).
- Definition object: `defineChart({ marks, scales, tooltip, color, theme })`
  with marks `barX/barY`, `lineX/lineY`, `areaX/areaY`, `dot`, `cell`, polar
  marks under `/polar`, transforms under `/transform/*`.
- Theming: no CSS file. 17 custom properties: `--ts-chart-1..6` (palette),
  focus/crosshair fills, and `--ts-chart-tooltip-*` (background, color,
  border, border-radius, shadow, max-width, padding, font). Text and grid use
  `currentColor`; background is transparent.
- Responsive: width auto-measured with a ResizeObserver when `width` is
  omitted; `height` or `aspectRatio` from the caller; default 320px.
- SSR: full SVG rendered on the server at `initialWidth`; the consuming file
  needs `'use client'` in the Next.js App Router.
- Legend: `colorLegend` renders inside the SVG with no class or render hooks.
  `onRender(context)` exposes `context.scene.colors` (`domain`, `range`,
  `map`), enough to render an HTML legend outside the SVG.
- Alternative weighed: Recharts 3.10 is stable but depends on Redux Toolkit,
  react-redux, immer, and reselect.

## Decisions

- Pin `@tanstack/charts@0.16.0` exactly; alpha notice on the docs page.
- Thin surface: `ChartContainer` (theme bridge: tokens → `--ts-chart-*`),
  `Chart` re-export, `ChartTooltipContent`, `ChartLegend` + `useChartLegend`.
  No preset chart helpers; definitions are written with the library API.
  Amended 2026-09-05: `Chart` is a wrapper rather than a bare re-export (it
  owns the focus ring and the reveal-on-measure), and `chartTheme` /
  `chartAxis` were added so definitions written with the library API still
  land on the house look. See the two sections below.
- Six palette tokens `chart1..chart6` added to `colors` (light and dark).

## Styling hooks, verified against 0.16.0 sources (2026-09-05)

Read from `dist/` rather than the docs, because the guides do not name the
opacities. Everything below is what the library actually exposes.

- **CSS custom properties (17, all read with fallbacks).** `--ts-chart-1..6`,
  `--ts-chart-focus-fill`, `--ts-chart-crosshair-marker-fill`,
  `--ts-chart-crosshair-label-halo`, and `--ts-chart-tooltip-{background,
  color,border,border-radius,shadow,max-width,padding,font}`. They are read
  from the container by inheritance, so `ChartContainer` is the only place
  they need to be set.
- **`defineChart({ theme })`** takes `foreground`, `muted`, `grid`,
  `background`, `palette`; all default to `currentColor` except a transparent
  background and the palette, which reads `--ts-chart-1..6`. This is the only
  hook for scene colors.
- **The scene paints each role at a fixed opacity** (`dist/scene.js`):
  gridlines `theme.grid` at 11% and stroke width 1; axis domain lines and tick
  stubs `theme.foreground` at 28%; tick labels `theme.muted` at 68%, 11px
  (10px under 360px wide); axis titles `theme.foreground` at 76%, 11px,
  weight 600. Only the tick-label opacity is overridable, through
  `axis.tickLabels.opacity`. So a token cannot be handed straight to `grid`:
  `colors.border` at 11% is invisible, and `colors.foreground` at 11% is what
  lands on `colors.border`.
- **Axis presentation** (`scales.<id>.axis`): `line`, `ticks`
  (`count | spacing | values`, `size`, `padding`, `format`), `tickLabels`
  (`rotate`, `thin`, `fontSize`, `fontWeight`, `opacity`, `anchor`, `dx`,
  `dy`), `label`. The axis title has no style hook — `ChartAxisLabelOptions`
  is `{ text, offset, motion }` — so its 11px/600 stays as the library
  paints it.
- **Scene sizes are numbers in SVG user units.** Themeable tokens resolve to
  `var()` and cannot be used for them; only the `defineConsts` scales can, by
  mirroring the rem value at the 16px root.
- **Mark styling** is per mark: `barY`/`barX` take `radius`, `inset`,
  `maxThickness`, `fill*`, `stroke*`; `lineY`/`lineX` take `strokeWidth`,
  `strokeDasharray`, `curve`, `points`. `radius` becomes the rect's `rx`, so
  it rounds all four corners — on a bar sitting on the baseline that reads
  wrong at anything but a very small value.
- **Scene node styles are emitted as SVG presentation attributes**, not inline
  `style`, so a CSS rule outclasses them. Scene groups carry class names
  (`ts-chart__grid`, `ts-chart__axes`, `ts-chart__marks`, `ts-chart__bar`).
  StyleX has no descendant selectors, so this repo does not use that route —
  it is the escape hatch if a default ever cannot be reached otherwise.
- **The surface is a serialized string**, not React elements. The `renderSvg`
  prop is the seam: wrapping `renderChartSvg` and adding a `className` puts a
  class on the root `<svg>`, which is where the library's `tabindex` lives.
  The focus-guide serializer re-parses that markup and keeps only the inner
  `g`, so the extra class is harmless there.
- **The host is `div.ts-chart-host`** with `width: 100%` and the `height` (or
  `aspect-ratio`) from props; the React `className`/`style` props land on it,
  with `style` merged after the library's own.

## SSR sizing (the "paints small, then grows" bug)

`initialWidth` defaults to 640. The server renders the scene at that width and
the browser fits the resulting `viewBox` into the real container, so a 512px
container shows the whole scene at 0.8 scale, letterboxed inside a fixed
`height`. The chart re-renders at the measured width in a layout effect, so an
app that hydrates immediately never paints the mismatch — but anything that
defers hydration (Astro's `client:visible`, which is how the docs previews
run) shows it for as long as the deferral lasts. Measured on the docs page:
every below-the-fold chart kept `viewBox="0 0 640 240"` in a 512px host until
it was scrolled into view.

The container cannot be measured before the first client render, so the fix is
to render hidden and reveal in a layout effect, after the library has
re-rendered at the real width. Passing a representative `initialWidth` is the
alternative when the server-rendered geometry has to be visible.
