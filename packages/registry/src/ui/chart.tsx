'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import type {
  ChartAxisPresentationOptions,
  ChartCurve,
  ChartKey,
  ChartPoint,
  ChartScene,
  ChartTheme,
  ChartTooltipContent as ChartTooltipModel,
  ChartTooltipRow,
  ChartValue,
  RenderChartSvgOptions,
  ResolvedColorScale,
  SceneNode,
} from '@tanstack/charts';
import {
  Chart as BaseChart,
  type ChartProps as BaseChartProps,
  type ChartTooltipBodyRenderContext,
} from '@tanstack/charts/react/tooltip';
import { renderChartSvg } from '@tanstack/charts/svg';

import {
  space,
  fontSize,
  lineHeight,
  fontWeight,
  iconSize,
  stroke,
} from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface DivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export type { ChartPoint, ChartTooltipBodyRenderContext };

/* ----------------------------------- Chart --------------------------------- */

export interface ChartProps<
  TDatum = unknown,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> extends BaseChartProps<TDatum, TXValue, TYValue> {}

/**
 * TanStack Charts' React component (the tooltip-capable entry, so
 * `renderTooltipBody` is available) with the house surface: the `<svg>` carries
 * the focus-visible ring and the gridlines are restyled to the house hairline.
 * Create definitions at module scope or inside `useMemo` — definition identity
 * is the update boundary.
 *
 * Size a chart with `aspectRatio` rather than `height`. The server cannot
 * measure the container, so it lays the scene out at `initialWidth` (640) and
 * gives the `<svg>` a `viewBox` of that size; the browser then fits that box
 * into the host. With `aspectRatio` the host box has the same ratio as the
 * `viewBox`, so the server-rendered chart fills it and only its scale differs
 * from the hydrated one. A fixed `height` makes the two ratios disagree and the
 * scene is letterboxed inside the host until the chart mounts. Set
 * `initialWidth` to the layout's usual width to shrink the remaining
 * difference to nothing.
 */
export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({ renderSvg, ...props }: ChartProps<TDatum, TXValue, TYValue>) {
  return (
    <BaseChart
      {...(props as ChartProps<TDatum, TXValue, TYValue>)}
      renderSvg={renderSvg ?? renderChartSurface}
    />
  );
}

// The surface is markup the library serializes, not a React element, so its
// styles ride the class name `renderChartSvg` puts on the `<svg>`, and its
// scene is restyled on the way to the serializer.
function renderChartSurface<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(scene: ChartScene<TDatum, TXValue, TYValue>, options: RenderChartSvgOptions) {
  const { className } = stylex.props(styles.surface);
  return renderChartSvg(withHouseGrid(scene as ChartScene), {
    ...options,
    className: options.className ? `${options.className} ${className}` : className,
  });
}

/* ---------------------------------- Theme ---------------------------------- */

// The scene is a numeric space in SVG user units, so scene-side sizes mirror
// the CSS scale at the 16px root. Themeable tokens resolve to `var()` and
// cannot be used for sizes here — only `defineConsts` scales can. Colors are
// the exception: they are serialized as SVG paint attributes, which resolve
// `var()` the same way CSS does.
const scenePx = (rem: string) => Number.parseFloat(rem) * 16;
// The stroke scale is written in pixels already, so it converts one to one.
const strokePx = (px: string) => Number.parseFloat(px);

// Gridlines are painted from `theme.grid` at a fixed 11% opacity and stroke
// width 1, and `grid` on a scale is a plain boolean — the library has no hook
// for their dash or weight. `renderSvg` hands over the whole scene before it is
// serialized, though, and `SceneStyle` is public, so the grid group is restyled
// here: one dashed hairline in `colors.border`, at full opacity so the token is
// the color that lands rather than a fraction of it. The grid group is the
// scene's first node.
const houseGrid = {
  stroke: colors.border,
  strokeOpacity: 1,
  strokeWidth: strokePx(stroke.border),
  // The spacing scale has no 3px step, so the dash is the 4px one.
  strokeDasharray: `${scenePx(space.s1)} ${scenePx(space.s1)}`,
};

function withHouseGrid(scene: ChartScene): ChartScene {
  const index = scene.nodes.findIndex(
    (node) => node.className === 'ts-chart__grid',
  );
  const grid = scene.nodes[index];
  if (!grid || grid.kind !== 'group') return scene;
  const nodes: SceneNode[] = [...scene.nodes];
  nodes[index] = { ...grid, style: { ...grid.style, ...houseGrid } };
  return { ...scene, nodes };
}

/**
 * Scene colors for `defineChart({ theme })`. The library paints each role at a
 * fixed opacity — 11% for gridlines, 68% for tick labels — so `grid` takes
 * `colors.foreground`, which at 11% lands on `colors.border`, and the tick
 * labels reach `colors.mutedForeground` through `chartAxis`'s `opacity: 1`.
 * `Chart`'s own surface renderer restyles the gridlines to `colors.border`
 * outright; this value is what a chart falls back to when `renderSvg` is
 * replaced.
 */
export const chartTheme: Partial<ChartTheme> = {
  foreground: colors.foreground,
  muted: colors.mutedForeground,
  grid: colors.foreground,
};

/**
 * Axis presentation for `scales.<id>.axis`: the gridlines carry the structure,
 * so the domain line and tick stubs are off and the tick labels sit at the
 * caption size in `colors.mutedForeground`. Spread it and add `label`; keep
 * `ticks` spread too when an axis needs its own `count` or `format`. Hide an
 * axis entirely with `axis: false`, which keeps the scale and its grid.
 */
export const chartAxis: ChartAxisPresentationOptions = {
  line: false,
  ticks: { size: 0, padding: scenePx(space.s2) },
  tickLabels: { fontSize: scenePx(fontSize.xs), opacity: 1 },
};

/**
 * Axis presentation for a scale whose gridlines are all that should show:
 * no domain line, no tick stubs, no labels, and four bands of grid. `axis:
 * false` hides an axis too, but it leaves the tick count to the plot height,
 * which on a tall chart draws about twice as many lines as the eye needs to
 * read a magnitude. Spread it to change the count.
 */
export const chartGridAxis: ChartAxisPresentationOptions = {
  line: false,
  ticks: { count: 4, size: 0 },
  tickLabels: false,
};

/**
 * Monotone cubic interpolation for a mark's `curve`, as `lineY`, `areaY`, and
 * the other curve-taking marks want it. The library's only curve adapter,
 * `d3Curve`, needs a `d3-shape` curve factory and so a dependency this
 * component does not carry; this is the same Fritsch–Carlson construction,
 * which smooths the path without letting it overshoot a data point.
 */
export const chartCurve: ChartCurve = {
  line: (points) => (points.length ? `M${point(points[0])}${curveTo(points)}` : ''),
  area: (top, bottom) => {
    if (!top.length) return '';
    const back = [...bottom].reverse();
    return `M${point(top[0])}${curveTo(top)}L${point(back[0])}${curveTo(back)}Z`;
  },
};

type CurvePoint = readonly [number, number];

const point = (value: CurvePoint | undefined) =>
  value ? `${value[0]},${value[1]}` : '';

// Cubic segments whose end tangents are the Fritsch–Carlson slopes: the
// average of the neighbouring secants, flattened to zero at a local extreme and
// clamped to three times the secant so a segment never leaves the interval its
// two points span.
function curveTo(points: readonly CurvePoint[]) {
  const slopes = tangents(points);
  let path = '';
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index] as CurvePoint;
    const [x1, y1] = points[index + 1] as CurvePoint;
    const third = (x1 - x0) / 3;
    const a = `${x0 + third},${y0 + (slopes[index] as number) * third}`;
    const b = `${x1 - third},${y1 - (slopes[index + 1] as number) * third}`;
    path += `C${a} ${b} ${x1},${y1}`;
  }
  return path;
}

function tangents(points: readonly CurvePoint[]) {
  const count = points.length;
  const slopes = new Array<number>(count).fill(0);
  if (count < 2) return slopes;

  const secants = new Array<number>(count - 1).fill(0);
  for (let index = 0; index < count - 1; index += 1) {
    const [x0, y0] = points[index] as CurvePoint;
    const [x1, y1] = points[index + 1] as CurvePoint;
    secants[index] = x1 === x0 ? 0 : (y1 - y0) / (x1 - x0);
  }

  slopes[0] = secants[0] as number;
  slopes[count - 1] = secants[count - 2] as number;
  for (let index = 1; index < count - 1; index += 1) {
    const before = secants[index - 1] as number;
    const after = secants[index] as number;
    slopes[index] = before * after <= 0 ? 0 : (before + after) / 2;
  }

  for (let index = 0; index < count - 1; index += 1) {
    const secant = secants[index] as number;
    if (secant === 0) {
      slopes[index] = 0;
      slopes[index + 1] = 0;
      continue;
    }
    const a = (slopes[index] as number) / secant;
    const b = (slopes[index + 1] as number) / secant;
    const excess = a * a + b * b;
    if (excess <= 9) continue;
    const scale = 3 / Math.sqrt(excess);
    slopes[index] = scale * a * secant;
    slopes[index + 1] = scale * b * secant;
  }
  return slopes;
}

/**
 * Theme bridge: maps the design tokens onto the CSS custom properties TanStack
 * Charts reads (palette, tooltip chrome, focus and crosshair fills) and sets
 * the inherited `color` and font the scene derives from. Wrap every `Chart` in
 * one; a legend placed inside stacks below the plot.
 */
export function ChartContainer({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.container, style)} />;
}

/* ---------------------------------- Tooltip -------------------------------- */

export type ChartTooltipIndicator = 'dot' | 'line';

export interface ChartTooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'content'> {
  /** The tooltip model from `renderTooltipBody`'s context. */
  content: ChartTooltipModel | string;
  /** Focused points from the same context, matched to rows by index. */
  points?: readonly ChartPoint[];
  /** Swatch shape next to each row. */
  indicator?: ChartTooltipIndicator;
  /** Replaces a row's formatted value; `point` is the row's chart point. */
  formatter?: (value: string, name: string, point: ChartPoint | undefined) => React.ReactNode;
  /** Omits the title (the shared axis value on grouped focus). */
  hideLabel?: boolean;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
  // Remaining `renderTooltipBody` context fields are accepted so the context
  // can be spread straight in; they are not forwarded to the DOM. Dismissal
  // stays the chart's: `dismiss()` is inert for a pointer-pinned tooltip in
  // 0.16.0, and wrapping it here would only hide that.
  defaultBody?: React.ReactNode;
  pinned?: boolean;
  dismiss?: () => void;
}

/**
 * Tooltip body for `renderTooltipBody`:
 * `renderTooltipBody={(context) => <ChartTooltipContent {...context} />}`.
 * The chart owns focus, anchoring, placement, and dismissal; this renders the
 * title and one swatch + label + value row per focused series.
 */
export function ChartTooltipContent({
  content,
  points = [],
  indicator = 'dot',
  formatter,
  hideLabel = false,
  style,
  defaultBody: _defaultBody,
  pinned: _pinned,
  dismiss: _dismiss,
  ...props
}: ChartTooltipContentProps) {
  if (typeof content === 'string') {
    return (
      <div {...props} {...stylex.props(styles.tooltip, style)}>
        <span {...stylex.props(styles.tooltipTitle)}>{content}</span>
      </div>
    );
  }

  const { title, color, rows } = content;
  // Grouped focus yields one row per point (same order); a single point yields
  // channel rows that all belong to the one focused point.
  const pointFor = (index: number) =>
    rows.length === points.length ? points[index] : points[0];

  return (
    <div {...props} {...stylex.props(styles.tooltip, style)}>
      {!hideLabel && title ? (
        <span {...stylex.props(styles.tooltipTitle)}>
          {color ? (
            <span
              {...stylex.props(styles.swatch, indicators[indicator], styles.swatchColor(color))}
            />
          ) : null}
          {title}
        </span>
      ) : null}
      <div {...stylex.props(styles.tooltipRows)}>
        {rows.map((row: ChartTooltipRow, index) => (
          <div key={`${row.label}-${index}`} {...stylex.props(styles.tooltipRow)}>
            {row.color ? (
              <span
                {...stylex.props(
                  styles.swatch,
                  indicators[indicator],
                  styles.swatchColor(row.color),
                )}
              />
            ) : null}
            <span {...stylex.props(styles.tooltipLabel)}>{row.label}</span>
            <span {...stylex.props(styles.tooltipValue)}>
              {formatter ? formatter(row.value, row.label, pointFor(index)) : row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Legend --------------------------------- */

export interface ChartLegendItem {
  label: React.ReactNode;
  /** Any CSS color, including the palette references the chart resolves. */
  color: string;
  /** Stable identity; defaults to the index. */
  key?: string;
}

export type ChartLegendAlign = 'start' | 'center' | 'end';

export interface ChartLegendProps extends DivProps {
  items: readonly ChartLegendItem[];
  align?: ChartLegendAlign;
}

/** HTML legend rendered outside the SVG: a wrapping row of swatch + label. */
export function ChartLegend({
  items,
  align = 'center',
  style,
  ...props
}: ChartLegendProps) {
  return (
    <div {...props} {...stylex.props(styles.legend, legendAligns[align], style)}>
      {items.map((item, index) => (
        <span key={item.key ?? index} {...stylex.props(styles.legendItem)}>
          <span {...stylex.props(styles.swatch, indicators.dot, styles.swatchColor(item.color))} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

interface ColorSceneContext {
  scene: { colors: ResolvedColorScale };
}

/**
 * Derives legend items from a chart's resolved color scale. Pass `onRender`
 * to `<Chart onRender={onRender} />` and `items` to `<ChartLegend items />`.
 * Items only change identity when the domain or its colors change.
 */
export function useChartLegend() {
  const [items, setItems] = React.useState<readonly ChartLegendItem[]>([]);
  const onRender = React.useCallback((context: ColorSceneContext) => {
    const { domain, map } = context.scene.colors;
    const next = domain.map((value: ChartKey) => ({
      key: String(value),
      label: String(value),
      color: map(value),
    }));
    setItems((previous) => (sameItems(previous, next) ? previous : next));
  }, []);
  return { items, onRender };
}

function sameItems(a: readonly ChartLegendItem[], b: readonly ChartLegendItem[]) {
  return (
    a.length === b.length &&
    a.every((item, i) => item.key === b[i].key && item.color === b[i].color)
  );
}

/* ---------------------------------- Styles --------------------------------- */

const styles = stylex.create({
  // The custom properties are read by TanStack Charts with fallbacks; they
  // are unconditional here, so the conditional-custom-property gotcha in
  // STYLEX.md does not apply.
  container: {
    '--ts-chart-1': colors.chart1,
    '--ts-chart-2': colors.chart2,
    '--ts-chart-3': colors.chart3,
    '--ts-chart-4': colors.chart4,
    '--ts-chart-5': colors.chart5,
    '--ts-chart-6': colors.chart6,
    // Focus marker and crosshair fills are halos painted over the mark: the
    // surface color, so the series stroke around them stays legible.
    '--ts-chart-focus-fill': colors.background,
    '--ts-chart-crosshair-marker-fill': colors.background,
    '--ts-chart-crosshair-label-halo': colors.background,
    // The tooltip is the library's own element, so its chrome is written as
    // custom properties rather than composed styles. The shadow carries the
    // edge the way `ring({ shadow: shadow.lg })` does on Popover and Select,
    // which is why the border itself is off.
    '--ts-chart-tooltip-background': colors.popover,
    '--ts-chart-tooltip-color': colors.popoverForeground,
    '--ts-chart-tooltip-border': 'none',
    '--ts-chart-tooltip-border-radius': radius.md,
    '--ts-chart-tooltip-shadow': `0 0 0 ${stroke.border} ${colors.border}, ${shadow.lg}`,
    '--ts-chart-tooltip-padding': `${space.s2} ${space.s25}`,
    '--ts-chart-tooltip-font': `${fontWeight.medium} ${fontSize.xs}/${lineHeight.snug} ${font.sans}`,
    // Scene text is rendered with `font-family: inherit`, and anything the
    // chart theme leaves as `currentColor` derives from this color.
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    minWidth: 0,
    width: '100%',
  },
  // Applied to the `<svg>` the library serializes: it carries `tabindex`, so
  // without this the browser paints its own focus ring on every click. The box
  // sizing repeats the library's own `width`/`height` attributes so the
  // server-rendered surface still fills its host under a CSS reset that gives
  // `svg` an intrinsic size.
  surface: {
    display: 'block',
    height: '100%',
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: stroke.focus,
    width: '100%',
  },
  tooltip: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    gap: space.s15,
    lineHeight: lineHeight.snug,
  },
  tooltipTitle: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: fontWeight.medium,
    gap: space.s2,
  },
  tooltipRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s15,
  },
  tooltipRow: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s2,
  },
  tooltipLabel: {
    color: colors.mutedForeground,
    fontWeight: 'normal',
  },
  tooltipValue: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.medium,
    marginInlineStart: 'auto',
    paddingInlineStart: space.s4,
  },
  swatch: {
    flexShrink: 0,
  },
  swatchColor: (color: string) => ({
    backgroundColor: color,
  }),
  legend: {
    alignItems: 'center',
    color: colors.mutedForeground,
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    gap: space.s4,
    lineHeight: lineHeight.snug,
    paddingBlockStart: space.s3,
  },
  legendItem: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: space.s15,
  },
});

const indicators = stylex.create({
  // A dot rather than a rounded square: the radius scale starts at 6px, which
  // is already past half of an 8px swatch, so a square swatch would need a
  // 2px radius token this scale does not have.
  dot: {
    borderRadius: radius.full,
    height: iconSize.xxs,
    width: iconSize.xxs,
  },
  // A bar as tall as its row, for tooltips whose rows carry a series stroke.
  line: {
    alignSelf: 'stretch',
    borderRadius: radius.sm,
    width: space.s1,
  },
});

const legendAligns = stylex.create({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
});
