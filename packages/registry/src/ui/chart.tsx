'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import type {
  ChartAxisPresentationOptions,
  ChartKey,
  ChartPoint,
  ChartScene,
  ChartTheme,
  ChartTooltipContent as ChartTooltipModel,
  ChartTooltipRow,
  ChartValue,
  RenderChartSvgOptions,
  ResolvedColorScale,
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
 * `renderTooltipBody` is available) with two house behaviors added: the
 * surface carries the focus-visible ring, and the chart is revealed once the
 * browser has measured its container. Create definitions at module scope or
 * inside `useMemo` — definition identity is the update boundary.
 */
export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({ renderSvg, style, ...props }: ChartProps<TDatum, TXValue, TYValue>) {
  // A server cannot measure the container, so its SVG is laid out at
  // `initialWidth` and the browser scales that scene to fit until the chart
  // mounts — the "paints small, then grows" first frame. The chart re-renders
  // at the measured width in a layout effect, so revealing it on mount makes
  // the first painted frame the final one. The host div keeps its box while
  // hidden, so nothing shifts. Charts need scripting either way: without it
  // there is no pointer, keyboard, or tooltip behavior.
  const [measured, setMeasured] = React.useState(false);
  useIsomorphicLayoutEffect(() => setMeasured(true), []);

  return (
    <BaseChart
      {...(props as ChartProps<TDatum, TXValue, TYValue>)}
      renderSvg={renderSvg ?? renderChartSurface}
      style={measured ? style : { ...style, visibility: 'hidden' }}
    />
  );
}

// `useLayoutEffect` commits before the browser paints, which is what keeps the
// reveal from costing a frame; on the server React skips it and warns, so the
// environment picks the effect. The branch is constant per environment, so the
// hook order never changes between renders.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

// The surface is markup the library serializes, not a React element, so its
// styles ride the class name `renderChartSvg` puts on the `<svg>`.
function renderChartSurface<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(scene: ChartScene<TDatum, TXValue, TYValue>, options: RenderChartSvgOptions) {
  const { className } = stylex.props(styles.surface);
  return renderChartSvg(scene as ChartScene, {
    ...options,
    className: options.className ? `${options.className} ${className}` : className,
  });
}

/* ---------------------------------- Theme ---------------------------------- */

// The scene is a numeric space in SVG user units, so scene-side sizes mirror
// the CSS scale at the 16px root. Themeable tokens resolve to `var()` and
// cannot be used here — only `defineConsts` scales can.
const scenePx = (rem: string) => Number.parseFloat(rem) * 16;

/**
 * Scene colors for `defineChart({ theme })`. The library paints each role at a
 * fixed opacity — 11% for gridlines, 68% for tick labels — so `grid` takes
 * `colors.foreground`, which at 11% lands on `colors.border`, and the tick
 * labels reach `colors.mutedForeground` through `chartAxis`'s `opacity: 1`.
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
 * `ticks` spread too when an axis needs its own `count` or `format`.
 */
export const chartAxis: ChartAxisPresentationOptions = {
  line: false,
  ticks: { size: 0, padding: scenePx(space.s2) },
  tickLabels: { fontSize: scenePx(fontSize.xs), opacity: 1 },
};

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
    // edge the way `ring({ shadow: shadow.md })` does on Popover and Select,
    // which is why the border itself is off.
    '--ts-chart-tooltip-background': colors.popover,
    '--ts-chart-tooltip-color': colors.popoverForeground,
    '--ts-chart-tooltip-border': 'none',
    '--ts-chart-tooltip-border-radius': radius.md,
    '--ts-chart-tooltip-shadow': `0 0 0 ${stroke.border} ${colors.border}, ${shadow.md}`,
    '--ts-chart-tooltip-padding': `${space.s2} ${space.s25}`,
    '--ts-chart-tooltip-font': `${fontWeight.medium} ${fontSize.xs}/${lineHeight.snug} ${font.sans}`,
    // Scene text is rendered with `font-family: inherit`, and anything the
    // chart theme leaves as `currentColor` derives from this color.
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    gap: space.s3,
    minWidth: 0,
    width: '100%',
  },
  // Applied to the `<svg>` the library serializes: it carries `tabindex`, so
  // without this the browser paints its own focus ring on every click.
  surface: {
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: stroke.focus,
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
    gap: space.s1,
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
  },
  legendItem: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: space.s15,
  },
});

const indicators = stylex.create({
  dot: {
    borderRadius: radius.full,
    height: iconSize.xxs,
    width: iconSize.xxs,
  },
  line: {
    borderRadius: radius.full,
    height: space.s3,
    width: space.s05,
  },
});

const legendAligns = stylex.create({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
});
