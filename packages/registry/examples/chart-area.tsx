'use client';

import * as stylex from '@stylexjs/stylex';
import { areaY, defineChart, stack } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { tooltip } from '@tanstack/charts/tooltip';

import { container } from '@/lib/constants.stylex';

import { Chart, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const signups = [
  { month: 'Jan', plan: 'Free', signups: 420 },
  { month: 'Jan', plan: 'Pro', signups: 120 },
  { month: 'Feb', plan: 'Free', signups: 460 },
  { month: 'Feb', plan: 'Pro', signups: 150 },
  { month: 'Mar', plan: 'Free', signups: 510 },
  { month: 'Mar', plan: 'Pro', signups: 190 },
  { month: 'Apr', plan: 'Free', signups: 480 },
  { month: 'Apr', plan: 'Pro', signups: 230 },
  { month: 'May', plan: 'Free', signups: 560 },
  { month: 'May', plan: 'Pro', signups: 260 },
  { month: 'Jun', plan: 'Free', signups: 610 },
  { month: 'Jun', plan: 'Pro', signups: 310 },
];

// `stack()` pins the series order so layers never swap between updates; the
// tooltip reports each layer's own value, not the cumulative edge.
const definition = defineChart({
  marks: [
    areaY(signups, {
      x: 'month',
      y: 'signups',
      color: 'plan',
      layout: stack({ order: ['Free', 'Pro'] }),
      fillOpacity: 0.7,
    }),
  ],
  scales: {
    x: { scale: () => scalePoint().padding(0.1) },
    y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Sign-ups' } },
  },
  focus: 'group-x',
  tooltip,
});

export default function ChartArea() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Monthly sign-ups by plan, stacked"
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
