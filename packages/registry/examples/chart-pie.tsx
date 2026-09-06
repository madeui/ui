'use client';

import * as stylex from '@stylexjs/stylex';
import { defineChart } from '@tanstack/charts';
import { pie, polar, radialArc } from '@tanstack/charts/polar';
import { tooltip } from '@tanstack/charts/tooltip';

import { container, fontSize, fontWeight, lineHeight } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import { Chart, ChartContainer, ChartTooltipContent, chartTheme } from '@/components/ui/chart';

const browsers = [
  { browser: 'Chrome', sessions: 6240 },
  { browser: 'Safari', sessions: 1910 },
  { browser: 'Firefox', sessions: 820 },
  { browser: 'Edge', sessions: 640 },
  { browser: 'Other', sessions: 510 },
];

const count = new Intl.NumberFormat('en-US');
const total = browsers.reduce((sum, row) => sum + row.sessions, 0);

// `pie` allocates the angles; `radialArc` paints them. A responsive inner
// radius makes the donut hole; return 0 for a full pie. The slices are
// separated by a stroke in the surface color rather than an angular gap, so
// the ring reads as one shape cut into parts.
const slices = pie(browsers, { value: 'sessions' });

const definition = defineChart({
  marks: [
    polar({
      inset: 8,
      marks: [
        radialArc(slices, {
          innerRadius: ({ radius }) => radius * 0.62,
          color: 'browser',
          key: 'browser',
          stroke: colors.background,
          strokeWidth: 2,
        }),
      ],
      scales: { angle: null, radius: null },
    }),
  ],
  scales: { x: null, y: null },
  theme: chartTheme,
  // Polar points carry angle and radius, so the tooltip names its own rows.
  tooltip: {
    use: tooltip,
    content: ([point]) => ({
      title: point.datum.browser,
      color: point.color,
      rows: [{ label: 'Sessions', value: count.format(point.datum.sessions) }],
    }),
  },
});

export default function ChartPie() {
  return (
    // The library paints no centre label, so the total is HTML stacked over the
    // plot: the wrapper is the positioning context and the label ignores the
    // pointer so the slices underneath stay hoverable.
    <div {...stylex.props(styles.figure)}>
      <ChartContainer>
        <Chart
          definition={definition}
          aspectRatio={1}
          ariaLabel="Sessions by browser"
          renderTooltipBody={(context) => <ChartTooltipContent {...context} />}
        />
      </ChartContainer>
      <div {...stylex.props(styles.centre)}>
        <span {...stylex.props(styles.total)}>{count.format(total)}</span>
        <span {...stylex.props(styles.caption)}>Sessions</span>
      </div>
    </div>
  );
}

const styles = stylex.create({
  figure: {
    display: 'grid',
    maxWidth: container.sm,
    placeItems: 'center',
    position: 'relative',
    width: '100%',
  },
  centre: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
  total: {
    fontSize: fontSize.xl,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
  },
  caption: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
  },
});
