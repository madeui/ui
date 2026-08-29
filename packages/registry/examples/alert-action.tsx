import * as stylex from '@stylexjs/stylex';

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { container } from '@/lib/constants.stylex';

export default function AlertActionDemo() {
  return (
    <Alert style={styles.alert}>
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Undo
        </Button>
      </AlertAction>
    </Alert>
  );
}

const styles = stylex.create({
  alert: {
    width: container.xl,
  },
});
