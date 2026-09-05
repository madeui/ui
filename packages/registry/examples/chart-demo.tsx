'use client';

import * as stylex from '@stylexjs/stylex';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

import { container } from '@/lib/constants.stylex';

import {
  Chart,
  ChartContainer,
  ChartTooltipContent,
  chartAxis,
  chartTheme,
} from '@/components/ui/chart';

const revenue = [
  { month: 'Jan', revenue: 18600 },
  { month: 'Feb', revenue: 30500 },
  { month: 'Mar', revenue: 23700 },
  { month: 'Apr', revenue: 7300 },
  { month: 'May', revenue: 20900 },
  { month: 'Jun', revenue: 21400 },
];

// Module-scope definition: its identity is the chart's update boundary.
const definition = defineChart({
  marks: [barY(revenue, { x: 'month', y: 'revenue' })],
  scales: {
    x: { scale: () => scaleBand().padding(0.3), axis: chartAxis },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { ...chartAxis, label: 'Revenue' },
    },
  },
  theme: chartTheme,
  // Row order and labels of the single-point tooltip; `'y'` reuses the axis label.
  tooltip: { use: tooltip, items: [{ channel: 'x', label: 'Month' }, 'y'] },
});

export default function ChartDemo() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Monthly revenue, January to June"
        renderTooltipBody={(context) => <ChartTooltipContent {...context} />}
      />
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
