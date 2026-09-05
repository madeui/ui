'use client';

import * as stylex from '@stylexjs/stylex';
import { defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
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
  { month: 'Jan', stream: 'Subscriptions', amount: 42100 },
  { month: 'Jan', stream: 'Services', amount: 18300 },
  { month: 'Feb', stream: 'Subscriptions', amount: 44800 },
  { month: 'Feb', stream: 'Services', amount: 21900 },
  { month: 'Mar', stream: 'Subscriptions', amount: 47600 },
  { month: 'Mar', stream: 'Services', amount: 19700 },
  { month: 'Apr', stream: 'Subscriptions', amount: 51200 },
  { month: 'Apr', stream: 'Services', amount: 24400 },
  { month: 'May', stream: 'Subscriptions', amount: 53900 },
  { month: 'May', stream: 'Services', amount: 26100 },
  { month: 'Jun', stream: 'Subscriptions', amount: 58300 },
  { month: 'Jun', stream: 'Services', amount: 27800 },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const definition = defineChart({
  marks: [lineY(revenue, { x: 'month', y: 'amount', z: 'stream', strokeWidth: 2 })],
  scales: {
    x: { scale: () => scalePoint().padding(0.2), axis: chartAxis },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: {
        ...chartAxis,
        ticks: { ...chartAxis.ticks, format: (value) => currency.format(Number(value)) },
      },
    },
  },
  theme: chartTheme,
  focus: 'group-x',
  tooltip,
});

export default function ChartTooltip() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Monthly revenue by stream"
        renderTooltipBody={(context) => (
          <ChartTooltipContent
            {...context}
            indicator="line"
            // Grouped focus: each row's point is the series at that month, so
            // the raw `yValue` is what gets formatted.
            formatter={(value, _name, point) =>
              typeof point?.yValue === 'number' ? currency.format(point.yValue) : value
            }
          />
        )}
      />
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
