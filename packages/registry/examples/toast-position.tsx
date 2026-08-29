import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { toast, Toaster, ToastProvider } from '@/components/ui/toast';
import { space } from '@/lib/constants.stylex';

export default function ToastPosition() {
  return (
    <ToastProvider>
      <Button
        variant="outline"
        onClick={() => toast('Synced to top left')}
      >
        Show toast
      </Button>
      <Toaster style={styles.topLeft} />
    </ToastProvider>
  );
}

const styles = stylex.create({
  topLeft: {
    bottom: null,
    right: null,
    left: space.s4,
    top: space.s4,
  },
});
