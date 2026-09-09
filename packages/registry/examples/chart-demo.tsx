'use client';

import * as stylex from '@stylexjs/stylex';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

const revenue = [
  { month: 'Jan', revenue: 18600 },
  { month: 'Feb', revenue: 30500 },
  { month: 'Mar', revenue: 23700 },
  { month: 'Apr', revenue: 7300 },
  { month: 'May', revenue: 20900 },
  { month: 'Jun', revenue: 21400 },
];

// The config is the single source for the series label and its color: the
// tooltip reads the label from here, and the mark below is filled from the
// same entry.
const chartConfig = {
  revenue: { label: 'Revenue', color: colors.chart1 },
} satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <BarChart accessibilityLayer data={revenue} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} stroke={colors.border} strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: colors.mutedForeground, fontSize: fontSize.xs }}
        />
        <ChartTooltip
          cursor={{ fill: colors.accent }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
        {/* Rounded only at the data end, so the bar stays anchored to the baseline. */}
        <Bar dataKey="revenue" fill={chartConfig.revenue.color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
