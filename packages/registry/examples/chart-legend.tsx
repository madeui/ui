'use client';

import * as stylex from '@stylexjs/stylex';
import { barY, defineChart, group } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

import { container } from '@/lib/constants.stylex';

import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  useChartLegend,
} from '@/components/ui/chart';

const sales = [
  { quarter: 'Q1', region: 'Europe', sales: 120 },
  { quarter: 'Q1', region: 'Americas', sales: 98 },
  { quarter: 'Q1', region: 'Asia', sales: 64 },
  { quarter: 'Q2', region: 'Europe', sales: 135 },
  { quarter: 'Q2', region: 'Americas', sales: 110 },
  { quarter: 'Q2', region: 'Asia', sales: 82 },
  { quarter: 'Q3', region: 'Europe', sales: 128 },
  { quarter: 'Q3', region: 'Americas', sales: 125 },
  { quarter: 'Q3', region: 'Asia', sales: 97 },
  { quarter: 'Q4', region: 'Europe', sales: 150 },
  { quarter: 'Q4', region: 'Americas', sales: 140 },
  { quarter: 'Q4', region: 'Asia', sales: 115 },
];

const definition = defineChart({
  marks: [barY(sales, { x: 'quarter', y: 'sales', color: 'region', layout: group({ padding: 0.15 }) })],
  scales: {
    x: { scale: () => scaleBand().padding(0.25) },
    y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Sales' } },
  },
  color: { domain: ['Europe', 'Americas', 'Asia'] },
  focus: 'group-x',
  tooltip,
});

export default function ChartLegendExample() {
  // Reads the resolved color scale after each render; items keep their
  // identity until the domain or its colors change.
  const { items, onRender } = useChartLegend();

  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Quarterly sales by region"
        onRender={onRender}
        renderTooltipBody={(context) => <ChartTooltipContent {...context} />}
      />
      <ChartLegend items={items} />
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.xxl,
  },
});
