'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import type {
  ChartKey,
  ChartPoint,
  ChartTooltipContent as ChartTooltipModel,
  ChartTooltipRow,
  ResolvedColorScale,
} from '@tanstack/charts';
import {
  Chart,
  type ChartTooltipBodyRenderContext,
} from '@tanstack/charts/react/tooltip';

import { space, fontSize, lineHeight, fontWeight, stroke } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface DivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

// `Chart` is TanStack Charts' React component (the tooltip-capable entry, so
// `renderTooltipBody` is available), re-exported so consumers import every
// chart part from one place. Create definitions at module scope or inside
// `useMemo` — definition identity is the update boundary.
export { Chart };
export type { ChartPoint, ChartTooltipBodyRenderContext };

/**
 * Theme bridge: maps the design tokens onto the CSS custom properties TanStack
 * Charts reads (palette, tooltip chrome, focus and crosshair fills) and sets
 * the inherited `color` that axes, ticks, and gridlines derive from. Wrap
 * every `Chart` in one; a legend placed inside stacks below the plot.
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
  // can be spread straight in; they are not forwarded to the DOM.
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
    '--ts-chart-tooltip-background': colors.popover,
    '--ts-chart-tooltip-color': colors.popoverForeground,
    '--ts-chart-tooltip-border': `${stroke.border} solid ${colors.border}`,
    '--ts-chart-tooltip-border-radius': radius.md,
    '--ts-chart-tooltip-shadow': shadow.md,
    '--ts-chart-tooltip-padding': `${space.s2} ${space.s3}`,
    '--ts-chart-tooltip-font': `${fontWeight.medium} ${fontSize.xs}/${lineHeight.snug} ${font.sans}`,
    // Axes, ticks, and gridlines derive from currentColor (the library applies
    // its own opacities for muted text and grid strokes).
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    gap: space.s2,
    minWidth: 0,
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
    borderRadius: radius.sm,
    height: space.s2,
    width: space.s2,
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
