'use client';

import * as stylex from '@stylexjs/stylex';
import { Area, AreaChart, YAxis } from 'recharts';

import { space, fontSize, fontWeight, lineHeight, container } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

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

const chartConfig = {
  users: { label: 'Active users', color: colors.chart1 },
} satisfies ChartConfig;

// A sparkline reads as shape, not magnitude, so the scale spans the data
// rather than starting at zero — a zero baseline flattens a 43% rise into a
// straight line. The tenth-of-a-range padding keeps the stroke off the edges.
const users = activeUsers.map((point) => point.users);
const padding = (Math.max(...users) - Math.min(...users)) / 10;
const domain: [number, number] = [
  Math.min(...users) - padding,
  Math.max(...users) + padding,
];

export default function ChartSparkline() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardDescription>Active users</CardDescription>
        <CardTitle style={styles.value}>1,690</CardTitle>
      </CardHeader>
      <CardContent>
        {/* No axes, no grid, no tooltip: the plot is decoration next to the
            number that carries the value. The margin is only what keeps the
            stroke off the edges it would otherwise be clipped by. */}
        <ChartContainer config={chartConfig} style={styles.chart}>
          <AreaChart
            data={activeUsers}
            margin={{ top: 2, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <linearGradient id="sparkline-users" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartConfig.users.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={chartConfig.users.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {/* A hidden axis is what carries the domain when none is drawn. */}
            <YAxis hide domain={domain} />
            <Area
              dataKey="users"
              type="monotone"
              baseValue={domain[0]}
              stroke={chartConfig.users.color}
              strokeWidth={2}
              fill="url(#sparkline-users)"
              isAnimationActive={false}
            />
          </AreaChart>
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
  chart: {
    aspectRatio: '4',
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
