'use client';

import * as stylex from '@stylexjs/stylex';
import { Cell, Label, Pie, PieChart } from 'recharts';

import { container, fontSize, fontWeight } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const sessions = [
  { browser: 'chrome', sessions: 6240 },
  { browser: 'safari', sessions: 1910 },
  { browser: 'firefox', sessions: 820 },
  { browser: 'edge', sessions: 640 },
  { browser: 'other', sessions: 510 },
];

// Every slice comes from one series, so the config is keyed by the values of
// the `nameKey` field rather than by a `dataKey`.
const chartConfig = {
  chrome: { label: 'Chrome', color: colors.chart1 },
  safari: { label: 'Safari', color: colors.chart2 },
  firefox: { label: 'Firefox', color: colors.chart3 },
  edge: { label: 'Edge', color: colors.chart4 },
  // Slot 6 rather than 5: the two smallest slices sit next to each other in
  // the ring, and slots 4 and 5 are close enough in hue to blur there.
  other: { label: 'Other', color: colors.chart6 },
} satisfies ChartConfig;

const count = new Intl.NumberFormat('en-US');
const total = sessions.reduce((sum, row) => sum + row.sessions, 0);

export default function ChartPie() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <PieChart>
        {/* The slices carry their own labels, so the tooltip needs no title. */}
        <ChartTooltip content={<ChartTooltipContent nameKey="browser" hideLabel />} />
        <Pie
          data={sessions}
          dataKey="sessions"
          nameKey="browser"
          innerRadius="58%"
          // A stroke in the surface color separates the slices, so the ring
          // reads as one shape cut into parts rather than five loose arcs.
          stroke={colors.background}
          strokeWidth={2}
        >
          {sessions.map((row) => (
            <Cell key={row.browser} fill={chartConfig[row.browser as Browser].color} />
          ))}
          <Label content={<CentreTotal />} />
        </Pie>
        <ChartLegend
          itemSorter={null}
          content={<ChartLegendContent nameKey="browser" />}
        />
      </PieChart>
    </ChartContainer>
  );
}

type Browser = keyof typeof chartConfig;

// The centre of a donut is empty, so the total goes there as chart text: it
// scales with the plot and never covers a slice.
function CentreTotal({ viewBox }: { viewBox?: unknown }) {
  const box = viewBox as { cx?: number; cy?: number } | undefined;
  if (box?.cx == null || box.cy == null) return null;
  return (
    <text x={box.cx} y={box.cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={box.cx}
        y={box.cy}
        fill={colors.foreground}
        fontSize={fontSize.xl}
        fontWeight={fontWeight.semibold}
      >
        {count.format(total)}
      </tspan>
      {/* One 24px step below the number, in SVG user units. */}
      <tspan
        x={box.cx}
        y={box.cy + 24}
        fill={colors.mutedForeground}
        fontSize={fontSize.xs}
      >
        Sessions
      </tspan>
    </text>
  );
}

const styles = stylex.create({
  chart: {
    aspectRatio: '1',
    maxWidth: container.lg,
  },
});
