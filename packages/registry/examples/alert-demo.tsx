import * as stylex from '@stylexjs/stylex';

import { container } from '@/lib/constants.stylex';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDemo() {
  return (
    <Alert style={styles.alert}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}

const styles = stylex.create({
  alert: {
    width: container.xl,
  },
});
