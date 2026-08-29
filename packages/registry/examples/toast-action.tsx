import { Button } from '@/components/ui/button';
import { toast, Toaster, ToastProvider } from '@/components/ui/toast';

export default function ToastAction() {
  return (
    <ToastProvider>
      <Button
        variant="outline"
        onClick={() =>
          toast('Message archived', {
            actionProps: {
              children: 'Undo',
              onClick: () => toast('Message restored'),
            },
          })
        }
      >
        Archive message
      </Button>
      <Toaster />
    </ToastProvider>
  );
}
