import * as stylex from '@stylexjs/stylex';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDestructive() {
  return (
    <Alert variant="destructive" style={styles.alert}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Log in again.</AlertDescription>
    </Alert>
  );
}

const styles = stylex.create({
  alert: {
    width: '28rem',
  },
});
