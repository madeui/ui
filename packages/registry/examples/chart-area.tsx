'use client';

import * as stylex from '@stylexjs/stylex';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

const signups = [
  { month: 'Jan', free: 420, pro: 120 },
  { month: 'Feb', free: 460, pro: 150 },
  { month: 'Mar', free: 510, pro: 190 },
  { month: 'Apr', free: 480, pro: 230 },
  { month: 'May', free: 560, pro: 260 },
  { month: 'Jun', free: 610, pro: 310 },
];

const chartConfig = {
  free: { label: 'Free', color: colors.chart1 },
  pro: { label: 'Pro', color: colors.chart2 },
} satisfies ChartConfig;

export default function ChartArea() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <AreaChart accessibilityLayer data={signups} margin={{ left: 12, right: 12 }}>
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
          content={<ChartTooltipContent indicator="line" />}
        />
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
        {/* A shared `stackId` stacks the layers and pins their order, so they
            never swap between updates. The stroke keeps each band's top edge
            legible where two translucent fills meet. */}
        <Area
          dataKey="free"
          type="monotone"
          stackId="signups"
          stroke={chartConfig.free.color}
          strokeWidth={2}
          fill={chartConfig.free.color}
          fillOpacity={0.3}
        />
        <Area
          dataKey="pro"
          type="monotone"
          stackId="signups"
          stroke={chartConfig.pro.color}
          strokeWidth={2}
          fill={chartConfig.pro.color}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
