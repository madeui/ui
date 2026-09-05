'use client';

import * as stylex from '@stylexjs/stylex';
import { defineChart } from '@tanstack/charts';
import { pie, polar, radialArc } from '@tanstack/charts/polar';
import { tooltip } from '@tanstack/charts/tooltip';

import { container } from '@/lib/constants.stylex';

import { Chart, ChartContainer, ChartTooltipContent, chartTheme } from '@/components/ui/chart';

const browsers = [
  { browser: 'Chrome', share: 62 },
  { browser: 'Safari', share: 19 },
  { browser: 'Firefox', share: 8 },
  { browser: 'Edge', share: 6 },
  { browser: 'Other', share: 5 },
];

// `pie` allocates the angles; `radialArc` paints them. A responsive inner
// radius makes the donut hole; return 0 for a full pie.
const slices = pie(browsers, { value: 'share', gapAngle: 0.02 });

const definition = defineChart({
  marks: [
    polar({
      inset: 8,
      marks: [
        radialArc(slices, {
          innerRadius: ({ radius }) => radius * 0.6,
          cornerRadius: 4,
          color: 'browser',
          key: 'browser',
        }),
      ],
      scales: { angle: null, radius: null },
    }),
  ],
  scales: { x: null, y: null },
  theme: chartTheme,
  // Polar points carry angle and radius, so the tooltip names its own rows.
  tooltip: {
    use: tooltip,
    content: ([point]) => ({
      title: point.datum.browser,
      color: point.color,
      rows: [{ label: 'Share', value: `${point.datum.share}%` }],
    }),
  },
});

export default function ChartPie() {
  return (
    <ChartContainer style={styles.chart}>
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Browser share"
        renderTooltipBody={(context) => <ChartTooltipContent {...context} />}
      />
    </ChartContainer>
  );
}

const styles = stylex.create({
  chart: {
    maxWidth: container.lg,
  },
});
