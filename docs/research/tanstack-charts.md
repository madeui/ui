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

## Second pass, 2026-09-06: first paint and the house look

### First paint (supersedes the reveal-on-measure fix above)

The reveal-on-measure fix was wrong for the docs site. Astro renders the
previews as `client:visible` islands, so a chart below the fold stays
unhydrated until it is scrolled to — and with the wrapper hiding the surface
until its layout effect, that meant an empty box. Measured on the shipped
build at `:4399` with scripts blocked: `visibility: hidden`, host `512x240`,
`viewBox="0 0 640 240"`, and the element not screenshottable at all.

The real cause of the letterbox is a ratio mismatch, not the scale. From
`dist/svg-renderer.js`, the SSR root is
`<svg class="ts-chart" width="100%" height="100%" viewBox="0 0 W H"
style="display:block;overflow:visible">` with **no `preserveAspectRatio`**, so
it defaults to `xMidYMid meet`. From `dist/adapter-shared.js`, the scene is
laid out at `width = props.width ?? initialWidth ?? 640` and
`height = props.height ?? (aspectRatio ? initialWidth / aspectRatio : 320)`.
From `dist/react/RendererChart.js`, the host div gets
`height: height ?? (aspectRatio ? undefined : 320)` and
`aspectRatio: height === undefined ? aspectRatio : undefined` — so `height`
wins over `aspectRatio` for the CSS box whenever both are passed.

Therefore:

- With a fixed `height`, the `viewBox` ratio is `initialWidth / height` and the
  host's is `containerWidth / height`. They differ, `meet` letterboxes, and
  the plot paints small and centred.
- With `aspectRatio` and no `height`, both ratios are exactly `aspectRatio`.
  `meet` fills the box. The server-rendered chart is correct at first paint
  and only its scale differs from the hydrated one.

The wrapper now renders the library's component straight through, and every
example is sized with `aspectRatio`. Measured on the dev server, chart 0,
`waitUntil: 'commit'` + 0ms versus + 1500ms:

| viewport | host at 0ms | host at 1500ms | pixels changed |
| --- | --- | --- | --- |
| 1280 | 512x288, viewBox 640x360 | 512x288, viewBox 512x288 | 1.19% |
| 390 | 292x164, viewBox 640x360 | 292x164, viewBox 292x164 | 7.14% |

The box never moves. What changes is the scale of the tick labels and
gridlines, which the browser draws at `containerWidth / initialWidth` until the
chart re-lays out — 0.8 at 1280, 0.46 at 390, hence the larger mobile figure.
`initialWidth` is the only lever left for that residual; nothing in the library
lets a scene be laid out at a width the server does not know. With scripts
blocked the chart is now `visibility: visible` with its marks painted (~32% of
the host's pixels non-white at both widths).

### Styling hooks used for the house look

- **The grid has no public dash or weight option.** `ChartAxisOptions.grid` is
  a boolean, and `createGrid` in `dist/scene.js` hardcodes
  `{ stroke: theme.grid, strokeOpacity: 0.11, strokeWidth: 1 }`. But `renderSvg`
  receives the whole `ChartScene` before serialization, `SceneGroup.style` is a
  public `SceneStyle` with `strokeDasharray`, and the grid group is
  `scene.nodes[0]` (`nodes.unshift(createGrid(...))`). So the wrapper's
  `renderSvg` replaces that one group's style with `colors.border` at opacity 1,
  dashed. This is the general escape hatch for any scene default the options do
  not reach.
- **`axis: false` keeps the scale and its grid** (`hasScaleGrid` tests
  `options.grid === true`, `hasScaleGuide` tests `options.axis !== false`), but
  `resolveTickCount` then falls back to `plotLength / defaultSpacing`, which on
  a 288px plot draws nine gridlines. `chartGridAxis` (`line: false`,
  `ticks: { count: 4, size: 0 }`, `tickLabels: false`) hides the axis and keeps
  the count fixed.
- **Curves need `d3-shape`.** `@tanstack/charts/d3/shape` exports only
  `d3Curve(curveFactory)`; there are no built-in named curves, and `d3-shape` is
  not in the CLI's dependency map. `chartCurve` in `chart.tsx` is a
  Fritsch–Carlson monotone cubic written against the public `ChartCurve`
  interface (`{ line, area }` returning path data).
- **Gradients work but cost the swatch.** `defineChart({ gradients })` emits
  `<linearGradient>` into the scene defs and `renderChartSvg`'s `resolvePaint`
  rewrites `url(#id)` to the scoped id, so `fill: 'url(#id)'` on a mark is
  enough, and a stop's `color` may be a `var()`. The catch is in
  `dist/area.js`: `point.color = fill`, so a gradient fill propagates into the
  tooltip row and legend swatch, which cannot paint `url(#…)`. Gradients are
  therefore only used on marks with no tooltip (the sparkline).
- **`areaY.stroke` outlines the closed path**, both vertical sides and the
  bottom included, not just the top edge. A top-only edge on a stacked band is
  not reachable: `LineOptions` has no `layout`, so a `lineY` cannot be stacked
  to sit on the band's top.
- **`barY.radius` becomes the rect's `rx`** and rounds all four corners, so it
  stays at 4 rather than the 8 a top-only radius would carry.
- **Mark and scene sizes are plain numbers** in SVG user units. `rem` scales
  convert at the 16px root; the `stroke` scale is already in pixels and must
  not go through the same helper.
- **`radialArc` takes `stroke`/`strokeWidth`**, which is how the donut's slices
  are separated by the surface color instead of an angular gap. There is no
  centre-label mark; the total is HTML stacked over the plot.
