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

const sales = [
  { quarter: 'Q1', europe: 120, americas: 98, asia: 64 },
  { quarter: 'Q2', europe: 135, americas: 110, asia: 82 },
  { quarter: 'Q3', europe: 128, americas: 125, asia: 97 },
  { quarter: 'Q4', europe: 150, americas: 140, asia: 115 },
];

const chartConfig = {
  europe: { label: 'Europe', color: colors.chart1 },
  americas: { label: 'Americas', color: colors.chart2 },
  asia: { label: 'Asia', color: colors.chart3 },
} satisfies ChartConfig;

export default function ChartLegendExample() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      <BarChart accessibilityLayer data={sales} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} stroke={colors.border} strokeDasharray="4 4" />
        <XAxis
          dataKey="quarter"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: colors.mutedForeground, fontSize: fontSize.xs }}
        />
        <ChartTooltip
          cursor={{ fill: colors.accent }}
          content={<ChartTooltipContent />}
        />
        {/* `verticalAlign` reaches the body, which pads on the side facing the
            plot; the entries take their label and color from the config. */}
        <ChartLegend
          itemSorter={null}
          verticalAlign="top"
          content={<ChartLegendContent />}
        />
        <Bar dataKey="europe" fill={chartConfig.europe.color} radius={[4, 4, 0, 0]} />
        <Bar dataKey="americas" fill={chartConfig.americas.color} radius={[4, 4, 0, 0]} />
        <Bar dataKey="asia" fill={chartConfig.asia.color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
