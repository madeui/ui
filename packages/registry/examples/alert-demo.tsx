import * as stylex from '@stylexjs/stylex';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDemo() {
  return (
    <div {...stylex.props(styles.col)}>
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Log in again.</AlertDescription>
      </Alert>
    </div>
  );
}

const styles = stylex.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '28rem',
  },
});
