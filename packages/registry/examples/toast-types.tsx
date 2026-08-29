import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { toast, Toaster, ToastProvider } from '@/components/ui/toast';
import { space } from '@/lib/constants.stylex';

export default function ToastTypes() {
  return (
    <ToastProvider>
      <div {...stylex.props(styles.row)}>
        <Button
          variant="outline"
          onClick={() => toast('Event created', { description: 'Team sync at 3 PM.' })}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Changes saved')}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('Could not save', { description: 'Try again.' })}
        >
          Error
        </Button>
      </div>
      <Toaster />
    </ToastProvider>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
});
