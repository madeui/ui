import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { container } from '@/lib/constants.stylex';

export default function CardSmallDemo() {
  return (
    <Card size="sm" style={styles.card}>
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter padding for dense layouts.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm">Continue</Button>
      </CardFooter>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: container.sm,
  },
});
