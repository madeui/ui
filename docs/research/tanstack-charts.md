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
- Six palette tokens `chart1..chart6` added to `colors` (light and dark).
