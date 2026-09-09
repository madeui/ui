'use client';

import * as stylex from '@stylexjs/stylex';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { container, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const visitors = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

// Two series, so the config carries two entries and the legend names both.
const chartConfig = {
  desktop: { label: 'Desktop', color: colors.chart1 },
  mobile: { label: 'Mobile', color: colors.chart2 },
} satisfies ChartConfig;

export default function ChartLine() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <LineChart accessibilityLayer data={visitors} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} stroke={colors.border} strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: colors.mutedForeground, fontSize: fontSize.xs }}
        />
        <ChartTooltip
          cursor={{ stroke: colors.border }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
        {/* No per-point dots: the tooltip already marks the hovered month on
            every line, which is the only place a dot carries information. */}
        <Line
          dataKey="desktop"
          type="monotone"
          stroke={chartConfig.desktop.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke={chartConfig.mobile.color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
