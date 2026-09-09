'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import {
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type DefaultLegendContentProps,
  type LegendPayload,
  type TooltipContentProps,
} from 'recharts';

import {
  space,
  fontSize,
  lineHeight,
  fontWeight,
  iconSize,
  container as containerWidth,
} from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

/* ---------------------------------- Config --------------------------------- */

/**
 * One entry per series, keyed by the `dataKey` (or `nameKey`) the series is
 * drawn with. The entry carries the human label the tooltip and legend print
 * and the color the series is painted in — read it back where the mark is
 * declared, so the same value reaches the plot and the chrome:
 *
 * ```tsx
 * const chartConfig = {
 *   desktop: { label: 'Desktop', color: colors.chart1 },
 * } satisfies ChartConfig;
 *
 * <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={8} />
 * ```
 */
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    /** Any CSS color; use the `chart1` … `chart6` tokens for series. */
    color?: string;
    /** Rendered before the label in the legend. */
    icon?: React.ComponentType;
  }
>;

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

/** The config of the nearest `ChartContainer`. Throws outside one. */
export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used inside a <ChartContainer />.');
  }
  return context;
}

/* --------------------------------- Container ------------------------------- */

export interface ChartContainerProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'className' | 'style' | 'children'
  > {
  /** Series labels and colors, keyed by `dataKey`. */
  config: ChartConfig;
  /** The chart element, e.g. `<BarChart data={rows}>…</BarChart>`. */
  children: React.ReactElement;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

/**
 * Provides the config to `ChartTooltipContent` and `ChartLegendContent`, sets
 * the font and color the chart's own text inherits, and sizes the plot. The
 * single child is the chart element, measured by a responsive container.
 *
 * The box is reserved with `aspect-ratio` (16 / 9 by default) rather than a
 * height: the plot is laid out in the browser, and the reserved box is what
 * keeps the page from shifting when it arrives. Override the ratio through
 * `style`.
 */
export function ChartContainer({
  config,
  children,
  style,
  ...props
}: ChartContainerProps) {
  const value = React.useMemo(() => ({ config }), [config]);
  return (
    <ChartContext.Provider value={value}>
      <div {...props} {...stylex.props(styles.container, style)}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ---------------------------------- Tooltip -------------------------------- */

/** The chart's tooltip. Give it a body with `content={<ChartTooltipContent />}`. */
export const ChartTooltip = RechartsTooltip;

export type ChartTooltipIndicator = 'dot' | 'line';

type InjectedTooltipProps = Partial<
  Pick<
    TooltipContentProps,
    'active' | 'payload' | 'label' | 'formatter' | 'labelFormatter'
  >
>;

export interface ChartTooltipContentProps extends InjectedTooltipProps {
  /** Swatch shape next to each row. */
  indicator?: ChartTooltipIndicator;
  /** Omits the title (the shared axis value). */
  hideLabel?: boolean;
  /** Omits the swatches. */
  hideIndicator?: boolean;
  /** Config key for the title, when the axis value is not one. */
  labelKey?: string;
  /** Config key for every row's label, when the `dataKey` is not one. */
  nameKey?: string;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

/**
 * Tooltip body: `<ChartTooltip content={<ChartTooltipContent />} />`. The chart
 * owns hit-testing, placement, and dismissal; this renders the title and one
 * swatch + label + value row per series, labelled and colored from the config.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  labelKey,
  nameKey,
  style,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const title = hideLabel
    ? null
    : tooltipTitle(payload, config, label, labelKey, labelFormatter);

  return (
    <div {...stylex.props(styles.tooltip, style)}>
      {title == null ? null : (
        <span {...stylex.props(styles.tooltipTitle)}>{title}</span>
      )}
      <div {...stylex.props(styles.tooltipRows)}>
        {payload.map((item, index) => {
          const [key, itemConfig] = lookUp(
            config,
            item,
            String(nameKey ?? item.name ?? item.dataKey ?? index),
          );
          const color = itemConfig?.color ?? item.color ?? item.payload?.fill;
          const value = formatter
            ? formatter(item.value, item.name, item, index, payload)
            : item.value;
          return (
            <div key={key} {...stylex.props(styles.tooltipRow)}>
              {hideIndicator || !color ? null : (
                <span
                  {...stylex.props(
                    styles.swatch,
                    indicators[indicator],
                    styles.swatchColor(color),
                  )}
                />
              )}
              <span {...stylex.props(styles.tooltipLabel)}>
                {itemConfig?.label ?? item.name ?? key}
              </span>
              <span {...stylex.props(styles.tooltipValue)}>{first(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// A formatter may return the value alone or a `[value, name]` pair; only the
// value belongs in the value cell.
const first = (value: React.ReactNode | [React.ReactNode, React.ReactNode]) =>
  Array.isArray(value) ? value[0] : value;

function tooltipTitle(
  payload: NonNullable<TooltipContentProps['payload']>,
  config: ChartConfig,
  label: React.ReactNode,
  labelKey: string | undefined,
  labelFormatter: TooltipContentProps['labelFormatter'],
) {
  // The axis value is the title wherever there is one — on a shared tooltip
  // every row belongs to it, so a series label would name only the first row.
  // A config entry keyed by that value relabels it. Only when there is no axis
  // value (a pie, a radial bar) does the title come from the series itself,
  // and `labelKey` is how a caller points at the entry that names it.
  const axisValue =
    typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;
  let resolved: React.ReactNode;
  if (labelKey == null && axisValue != null) {
    resolved = config[axisValue]?.label ?? label;
  } else {
    const item = payload[0];
    const [, itemConfig] = lookUp(
      config,
      item,
      String(labelKey ?? item?.dataKey ?? item?.name ?? ''),
    );
    resolved = itemConfig?.label ?? label;
  }
  if (resolved == null || resolved === '') return null;
  return labelFormatter ? labelFormatter(resolved, payload) : resolved;
}

/* --------------------------------- Look-up --------------------------------- */

/**
 * Finds a payload entry's config entry. `key` is usually the series `dataKey`,
 * which is a config key directly. On a pie or a radial bar every slice comes
 * from one series, so the key that tells them apart is a field of the datum
 * (`nameKey="browser"`) and the config key is that field's value — read it off
 * the datum, one or two levels down, depending on the mark.
 */
function lookUp(
  config: ChartConfig,
  item: unknown,
  key: string,
): [string, ChartConfig[string] | undefined] {
  const datum = record(record(item)?.payload);
  const resolved =
    text(datum?.[key]) ?? text(record(datum?.payload)?.[key]) ?? key;
  return [resolved, config[resolved]];
}

const record = (value: unknown) =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;

const text = (value: unknown) => (typeof value === 'string' ? value : undefined);

/* ---------------------------------- Legend --------------------------------- */

/** The chart's legend. Give it a body with `content={<ChartLegendContent />}`. */
export const ChartLegend = RechartsLegend;

type InjectedLegendProps = Partial<
  Pick<DefaultLegendContentProps, 'payload' | 'verticalAlign'>
>;

export interface ChartLegendContentProps extends InjectedLegendProps {
  /** Omits the swatches. */
  hideIcon?: boolean;
  /** Config key for every entry's label, when `dataKey` is not one. */
  nameKey?: string;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

/**
 * Legend body: `<ChartLegend content={<ChartLegendContent />} />`. A wrapping
 * row of swatch + label, labelled and colored from the config.
 */
export function ChartLegendContent({
  payload,
  verticalAlign = 'bottom',
  hideIcon = false,
  nameKey,
  style,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      {...stylex.props(
        styles.legend,
        verticalAlign === 'top' ? styles.legendTop : styles.legendBottom,
        style,
      )}
    >
      {payload.map((item: LegendPayload, index) => {
        const [key, itemConfig] = lookUp(
          config,
          item,
          String(nameKey ?? item.dataKey ?? item.value ?? index),
        );
        const Icon = itemConfig?.icon;
        const color = itemConfig?.color ?? item.color;
        return (
          <span key={key} {...stylex.props(styles.legendItem)}>
            {Icon ? (
              <Icon />
            ) : hideIcon || !color ? null : (
              <span
                {...stylex.props(
                  styles.swatch,
                  indicators.dot,
                  styles.swatchColor(color),
                )}
              />
            )}
            {itemConfig?.label ?? item.value ?? key}
          </span>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Styles --------------------------------- */

const styles = stylex.create({
  container: {
    // The plot is laid out in the browser once the container can be measured;
    // the reserved ratio is what keeps the page from shifting when it arrives.
    aspectRatio: '16 / 9',
    // Chart text inherits the font, and anything the chart paints as
    // `currentColor` derives from this color.
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    justifyContent: 'center',
    minWidth: 0,
    width: '100%',
  },
  // The popup edge is a shadow ring rather than a border, the way Popover and
  // Select draw theirs.
  tooltip: {
    backgroundColor: colors.popover,
    borderRadius: radius.md,
    boxShadow: `0 0 0 1px ${colors.border}, ${shadow.lg}`,
    color: colors.popoverForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    gap: space.s15,
    lineHeight: lineHeight.snug,
    minWidth: containerWidth.xs,
    paddingBlock: space.s2,
    paddingInline: space.s25,
  },
  tooltipTitle: {
    fontWeight: fontWeight.medium,
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
    justifyContent: 'center',
    lineHeight: lineHeight.snug,
  },
  legendTop: {
    paddingBlockEnd: space.s3,
  },
  legendBottom: {
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
