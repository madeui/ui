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
import { Input } from '@/components/ui/input';

export default function CardDemo() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Project name" />
      </CardContent>
      <CardFooter>
        <Button>Deploy</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: '22rem',
  },
});
