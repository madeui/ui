'use client';

import * as stylex from '@stylexjs/stylex';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { container, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const revenue = [
  { month: 'Jan', subscriptions: 42100, services: 18300 },
  { month: 'Feb', subscriptions: 44800, services: 21900 },
  { month: 'Mar', subscriptions: 47600, services: 19700 },
  { month: 'Apr', subscriptions: 51200, services: 24400 },
  { month: 'May', subscriptions: 53900, services: 26100 },
  { month: 'Jun', subscriptions: 58300, services: 27800 },
];

const chartConfig = {
  subscriptions: { label: 'Subscriptions', color: colors.chart1 },
  services: { label: 'Services', color: colors.chart2 },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ChartTooltipExample() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <LineChart accessibilityLayer data={revenue} margin={{ left: 12, right: 12 }}>
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
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(month) => `${month} 2026`}
              formatter={(value) => currency.format(Number(value))}
            />
          }
        />
        <Line
          dataKey="subscriptions"
          type="monotone"
          stroke={chartConfig.subscriptions.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="services"
          type="monotone"
          stroke={chartConfig.services.color}
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
