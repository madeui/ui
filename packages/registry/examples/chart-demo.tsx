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
  chartGridAxis,
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
// `radius` is a corner radius in scene pixels and rounds all four corners of
// the bar, so it stays small enough not to lift the bar off the baseline.
const definition = defineChart({
  marks: [barY(revenue, { x: 'month', y: 'revenue', radius: 4 })],
  scales: {
    x: { scale: () => scaleBand().padding(0.3), axis: chartAxis },
    // `chartGridAxis` keeps the scale and its gridlines and drops the visible
    // axis: the grid already carries the magnitude, and the tooltip carries
    // the value.
    y: { scale: scaleLinear, nice: true, grid: true, axis: chartGridAxis },
  },
  theme: chartTheme,
  // Row order and labels of the single-point tooltip.
  tooltip: {
    use: tooltip,
    items: [
      { channel: 'x', label: 'Month' },
      { channel: 'y', label: 'Revenue' },
    ],
  },
});

export default function ChartDemo() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        aspectRatio={16 / 9}
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
