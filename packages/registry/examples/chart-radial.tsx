'use client';

import * as stylex from '@stylexjs/stylex';
import { Cell, RadialBar, RadialBarChart } from 'recharts';

import { container } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const adoption = [
  { plan: 'starter', accounts: 1840 },
  { plan: 'team', accounts: 1290 },
  { plan: 'business', accounts: 760 },
  { plan: 'enterprise', accounts: 310 },
];

const chartConfig = {
  starter: { label: 'Starter', color: colors.chart1 },
  team: { label: 'Team', color: colors.chart2 },
  business: { label: 'Business', color: colors.chart3 },
  enterprise: { label: 'Enterprise', color: colors.chart4 },
} satisfies ChartConfig;

export default function ChartRadial() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <RadialBarChart
        data={adoption}
        innerRadius="28%"
        outerRadius="96%"
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip content={<ChartTooltipContent nameKey="plan" hideLabel />} />
        {/* One ring per category, longest first: a radial bar's length is
            harder to compare than a straight one, so the order does the work
            the shared baseline does on a bar chart. The background traces each
            full ring, so a bar reads as a share of it and needs no gridlines. */}
        <RadialBar dataKey="accounts" background={{ fill: colors.muted }} cornerRadius={4}>
          {adoption.map((row) => (
            <Cell key={row.plan} fill={chartConfig[row.plan as Plan].color} />
          ))}
        </RadialBar>
        <ChartLegend
          itemSorter={null}
          content={<ChartLegendContent nameKey="plan" />}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

type Plan = keyof typeof chartConfig;

const styles = stylex.create({
  chart: {
    aspectRatio: '1',
    maxWidth: container.md,
  },
});
