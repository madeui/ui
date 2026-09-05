'use client';

import * as stylex from '@stylexjs/stylex';
import { areaY, defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';

import { space, fontSize, fontWeight, lineHeight, container } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, ChartContainer, chartTheme } from '@/components/ui/chart';

const activeUsers = [
  { day: 1, users: 1180 },
  { day: 2, users: 1240 },
  { day: 3, users: 1195 },
  { day: 4, users: 1310 },
  { day: 5, users: 1290 },
  { day: 6, users: 1385 },
  { day: 7, users: 1360 },
  { day: 8, users: 1440 },
  { day: 9, users: 1420 },
  { day: 10, users: 1510 },
  { day: 11, users: 1475 },
  { day: 12, users: 1580 },
  { day: 13, users: 1620 },
  { day: 14, users: 1690 },
];

// A sparkline reads as shape, not magnitude, so the scale spans the data
// rather than starting at zero — anchoring at zero flattens a 43% rise into a
// straight line. The tenth-of-a-range padding keeps the stroke off the edges,
// which `margin: 0` would otherwise clip, and the area fills to that floor.
const users = activeUsers.map((point) => point.users);
const padding = (Math.max(...users) - Math.min(...users)) / 10;
const floor = Math.min(...users) - padding;
const ceiling = Math.max(...users) + padding;

// No guides, zero margin, and no focus or keyboard behavior: the plot fills
// the box and reads as decoration next to the number that carries the value.
const definition = defineChart({
  marks: [
    areaY(activeUsers, { x: 'day', y: 'users', y1: floor, fillOpacity: 0.15 }),
    lineY(activeUsers, { x: 'day', y: 'users', strokeWidth: 2 }),
  ],
  scales: {
    x: { scale: scalePoint },
    y: { scale: () => scaleLinear().domain([floor, ceiling]) },
  },
  theme: chartTheme,
  guides: false,
  margin: 0,
  pointer: false,
  keyboard: false,
});

export default function ChartSparkline() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardDescription>Active users</CardDescription>
        <CardTitle style={styles.value}>1,690</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <Chart definition={definition} height={48} ariaLabel="Active users over the last 14 days" />
        </ChartContainer>
        <p {...stylex.props(styles.caption)}>Up 43% over 14 days</p>
      </CardContent>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: container.md,
  },
  value: {
    fontSize: fontSize.xl,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
  },
  caption: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    margin: 0,
    marginBlockStart: space.s2,
  },
});
