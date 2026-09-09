'use client';

import * as stylex from '@stylexjs/stylex';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

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

// Short axis labels: they sit outside the web, and a long one is the first
// thing to be clipped when the box narrows.
const scores = [
  { area: 'Speed', current: 92, previous: 78 },
  { area: 'Design', current: 88, previous: 81 },
  { area: 'Support', current: 74, previous: 70 },
  { area: 'Docs', current: 96, previous: 90 },
  { area: 'Pricing', current: 61, previous: 55 },
];

const chartConfig = {
  current: { label: 'This release', color: colors.chart1 },
  previous: { label: 'Previous', color: colors.chart2 },
} satisfies ChartConfig;

export default function ChartRadar() {
  return (
    <ChartContainer config={chartConfig} style={styles.chart}>
      {/* A percentage outer radius leaves room for the labels at every width;
          a fixed margin only works at the width it was chosen for. */}
      <RadarChart accessibilityLayer data={scores} outerRadius="72%">
        <PolarGrid stroke={colors.border} />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: colors.mutedForeground, fontSize: fontSize.xs }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
        {/* Two filled shapes on top of each other muddy both. The reference
            shape is an outline — dashed, so the comparison survives without
            color — and only the current one is filled. */}
        <Radar
          dataKey="previous"
          stroke={chartConfig.previous.color}
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="none"
        />
        <Radar
          dataKey="current"
          stroke={chartConfig.current.color}
          strokeWidth={2}
          fill={chartConfig.current.color}
          fillOpacity={0.2}
        />
      </RadarChart>
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    aspectRatio: '1',
    maxWidth: container.lg,
  },
});
