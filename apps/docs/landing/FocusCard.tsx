'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { space } from '@/lib/constants.stylex';

export default function FocusCard() {
  const [value, setValue] = React.useState(18);

  React.useEffect(() => {
    const timer = setTimeout(() => setValue(64), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Focus session</CardTitle>
        <CardDescription>Notifications pause while you work.</CardDescription>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <ToggleGroup variant="outline" spacing="joined" defaultValue={['45']}>
            <ToggleGroupItem value="25">25 min</ToggleGroupItem>
            <ToggleGroupItem value="45">45 min</ToggleGroupItem>
            <ToggleGroupItem value="60">60 min</ToggleGroupItem>
          </ToggleGroup>
          <Progress value={value} locale="en-US">
            <ProgressLabel>In progress</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Pause</Button>
        <Button variant="ghost">End early</Button>
      </CardFooter>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: '100%',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s5,
  },
});
