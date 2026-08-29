import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { container } from '@/lib/constants.stylex';

export default function CardActionDemo() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>New comment on your pull request.</p>
      </CardContent>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: container.md,
  },
});
