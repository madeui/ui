'use client';

import * as stylex from '@stylexjs/stylex';
import { defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { tooltip } from '@tanstack/charts/tooltip';

import { container } from '@/lib/constants.stylex';

import { Chart, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const visitors = [
  { month: 'Jan', device: 'Desktop', visitors: 186 },
  { month: 'Jan', device: 'Mobile', visitors: 80 },
  { month: 'Feb', device: 'Desktop', visitors: 305 },
  { month: 'Feb', device: 'Mobile', visitors: 200 },
  { month: 'Mar', device: 'Desktop', visitors: 237 },
  { month: 'Mar', device: 'Mobile', visitors: 120 },
  { month: 'Apr', device: 'Desktop', visitors: 73 },
  { month: 'Apr', device: 'Mobile', visitors: 190 },
  { month: 'May', device: 'Desktop', visitors: 209 },
  { month: 'May', device: 'Mobile', visitors: 130 },
  { month: 'Jun', device: 'Desktop', visitors: 214 },
  { month: 'Jun', device: 'Mobile', visitors: 140 },
];

// `z` splits the rows into series; with no explicit color scale, each series
// takes the next slot of the palette the container provides.
const definition = defineChart({
  marks: [
    lineY(visitors, { x: 'month', y: 'visitors', z: 'device', strokeWidth: 2, points: true }),
  ],
  scales: {
    x: { scale: () => scalePoint().padding(0.2) },
    y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Visitors' } },
  },
  focus: 'group-x',
  tooltip,
});

export default function ChartLine() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Monthly visitors by device"
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
