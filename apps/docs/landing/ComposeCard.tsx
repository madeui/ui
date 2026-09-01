import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/ui/toolbar';
import { space } from '@/lib/constants.stylex';

export default function ComposeCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Write an update</CardTitle>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarButton render={<Toggle aria-label="Bold" size="sm" />}>
                B
              </ToolbarButton>
              <ToolbarButton render={<Toggle aria-label="Italic" size="sm" />}>
                I
              </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarButton render={<Button variant="ghost" size="sm" />}>
              Attach
            </ToolbarButton>
          </Toolbar>
          <Textarea placeholder="Shipped the new onboarding flow…" rows={3} />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Post update</Button>
        <Button variant="secondary">Save draft</Button>
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
    gap: space.s3,
  },
});
